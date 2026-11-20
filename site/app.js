// opendtbvault browser: reads site/data.json (written by build.py) and renders
// the browse grid, file pages, consoles and panels. Plain JS, no build step.
(function () {
  'use strict';
  var PAGE = 48;
  var D, F = [], byPath = {}, state = { page: 1 };
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(p) { return p.split('/').map(encodeURIComponent).join('/'); }
  function kb(n) { n = +n; return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : (n / 1024).toFixed(1) + ' KB'; }
  function base(p) { return p.slice(p.lastIndexOf('/') + 1); }
  var TYPE = { 'dtb': 'DTB', 'dtbo': 'DTBO', 'dts': 'DTS', 'u-boot-dtb': 'U-Boot DTB', 'dtb-backup-copy': 'DTB backup' };

  function load() {
    fetch('site/data.json').then(function (r) { return r.json(); }).then(function (d) {
      D = d;
      var c = d.columns;
      F = d.files.map(function (row) {
        var o = {};
        for (var i = 0; i < c.length; i++) o[c[i]] = row[i];
        o.name = base(o.path);
        o.sub = o.path.split('/').slice(2, -1).join('/');
        o.hay = [o.path, o.console, o.os, o.console_label, o.label_as_shared, o.root_model, o.root_compatible,
          o.panel_compatible, o.panel_init, o.pmic, o.sha256, o.source_group, o.andr36oid_profile, o.resolution].join(' ').toLowerCase();
        byPath[o.path] = o;
        return o;
      });
      var orig = F.filter(function (f) { return !f.duplicate_of; }).length;
      $('sub').textContent = F.length + ' files (' + orig + ' unique) for ' + d.consoles.length +
        ' consoles and boards, free to download, no account needed.';
      fill('f-console', F.map(function (f) { return f.console; }));
      fill('f-soc', F.map(function (f) { return f.soc || '(unknown)'; }));
      fill('f-os', F.map(function (f) { return f.os; }));
      fill('f-type', F.map(function (f) { return f.file_type; }), TYPE);
      fill('f-group', F.map(function (f) { return f.source_group; }));
      fromHash();
    }).catch(function () {
      $('count').textContent = 'Could not load site/data.json.';
    });
  }

  function fill(id, vals, names) {
    var seen = {}, out = [];
    vals.forEach(function (v) { if (!seen[v]) { seen[v] = 1; out.push(v); } });
    out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0; });
    var s = $(id);
    out.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v; o.textContent = names && names[v] ? names[v] : v;
      s.appendChild(o);
    });
  }

  // ---------------------------------------------------------------- browse
  function filtered() {
    var q = $('q').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var fc = $('f-console').value, fs = $('f-soc').value, fo = $('f-os').value, ft = $('f-type').value,
      fg = $('f-group').value, dups = $('f-dups').checked;
    var r = F.filter(function (f) {
      if (!dups && f.duplicate_of) return false;
      if (fc && f.console !== fc) return false;
      if (fs && (f.soc || '(unknown)') !== fs) return false;
      if (fo && f.os !== fo) return false;
      if (ft && f.file_type !== ft) return false;
      if (fg && f.source_group !== fg) return false;
      for (var i = 0; i < q.length; i++) if (f.hay.indexOf(q[i]) < 0) return false;
      return true;
    });
    var s = $('f-sort').value;
    var cmp = {
      console: function (a, b) { return a.path.toLowerCase() < b.path.toLowerCase() ? -1 : 1; },
      name: function (a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : (a.path < b.path ? -1 : 1); },
      size: function (a, b) { return b.bytes - a.bytes || (a.path < b.path ? -1 : 1); },
      sizeasc: function (a, b) { return a.bytes - b.bytes || (a.path < b.path ? -1 : 1); }
    }[s];
    return r.sort(cmp);
  }

  function card(f) {
    var a = document.createElement('a');
    a.className = 'item card';
    a.href = '#/file/' + url(f.path);
    var rev = f.label_as_shared || f.console_label;
    a.innerHTML =
      '<div class="t"><span class="badge">' + esc(TYPE[f.file_type] || f.file_type) + '</span>' +
      (f.duplicate_of ? '<span class="badge gray">Copy</span>' : '') +
      (f.os === 'stock' ? '<span class="badge ok">Stock</span>' : '<span class="badge gray">' + esc(f.os) + '</span>') +
      (f.label_as_shared ? '<span class="badge warn">Relabelled</span>' : '') + '</div>' +
      '<h3>' + esc(f.console) + '</h3>' +
      '<div class="fn">' + esc(f.name) + '</div>' +
      '<dl class="kv">' +
      '<dt>SoC</dt><dd>' + esc(f.soc ? f.soc.toUpperCase() : '-') + '</dd>' +
      '<dt>Label</dt><dd>' + esc(rev || '-') + '</dd>' +
      (f.resolution ? '<dt>Screen</dt><dd>' + esc(f.resolution) + '</dd>' : '') +
      '<dt>Size</dt><dd>' + kb(f.bytes) + '</dd></dl>';
    return a;
  }

  function renderBrowse() {
    var r = filtered();
    var pages = Math.max(1, Math.ceil(r.length / PAGE));
    if (state.page > pages) state.page = pages;
    $('count').textContent = r.length + (r.length === 1 ? ' file' : ' files') + (pages > 1 ? ', page ' + state.page + ' of ' + pages : '');
    var g = $('grid');
    g.innerHTML = '';
    r.slice((state.page - 1) * PAGE, state.page * PAGE).forEach(function (f) { g.appendChild(card(f)); });
    var p = $('pager');
    p.innerHTML = '';
    if (pages > 1) {
      var add = function (label, n, on) {
        var b = document.createElement('button');
        b.className = 'btn' + (on ? ' on' : '');
        b.textContent = label;
        b.disabled = n < 1 || n > pages;
        b.onclick = function () { state.page = n; renderBrowse(); window.scrollTo(0, 0); };
        p.appendChild(b);
      };
      add('Previous', state.page - 1);
      var lo = Math.max(1, state.page - 3), hi = Math.min(pages, lo + 6);
      for (var i = lo; i <= hi; i++) add(String(i), i, i === state.page);
      add('Next', state.page + 1);
    }
  }

  // ---------------------------------------------------------------- file page
  function row(k, v, mono) { return v ? '<dt>' + esc(k) + '</dt><dd' + (mono ? ' class="mono"' : '') + '>' + esc(v) + '</dd>' : ''; }

  function renderFile(path) {
    var f = byPath[path], v = $('v-file');
    if (!f) { v.innerHTML = '<p>File not found. <a href="#/browse">Back to the archive</a></p>'; return; }
    var dts = f.file_type === 'dts' ? null : f.path + '.dts';
    var rel = F.filter(function (o) { return o.console === f.console && o.path !== f.path && !o.duplicate_of; }).slice(0, 12);
    var same = f.panel_init ? F.filter(function (o) { return o.panel_init === f.panel_init && o.console !== f.console && !o.duplicate_of; }) : [];
    var consoles = {};
    same.forEach(function (o) { consoles[o.console] = 1; });
    var sc = Object.keys(consoles).sort();
    document.title = f.name + ' - ' + f.console + ' - opendtbvault';
    v.innerHTML =
      '<a class="crumb" href="#/browse">Browse the archive</a>' +
      '<div class="filehead"><div>' +
      '<div class="t"><span class="badge">' + esc(TYPE[f.file_type] || f.file_type) + '</span> ' +
      (f.os === 'stock' ? '<span class="badge ok">Stock</span>' : '<span class="badge gray">' + esc(f.os) + '</span>') + '</div>' +
      '<h1>' + esc(f.name) + '</h1>' +
      '<p class="muted">' + esc(f.console) + (f.soc ? ', ' + esc(f.soc.toUpperCase()) : '') + (f.ram ? ', ' + esc(f.ram) : '') +
      (f.console_label ? ', label ' + esc(f.console_label) : '') + '</p></div>' +
      '<div class="actions"><a class="btn primary" href="' + url(f.path) + '" download="' + esc(f.name) + '">Download file</a>' +
      (dts ? '<a class="btn" href="' + url(dts) + '" target="_blank" rel="noopener">View decompiled source (.dts)</a>' : '') +
      '<small>No account, no daily limit.</small></div></div>' +
      (f.label_as_shared ? '<p class="note">This file was shared as "' + esc(f.label_as_shared) + '", but its screen start sequence and board wiring match ' + esc(f.console) + ', so it is filed there.</p>' : '') +
      (f.duplicate_of ? '<p class="note">This file is byte-identical to <a href="#/file/' + url(f.duplicate_of) + '">' + esc(f.duplicate_of) + '</a>.</p>' : '') +
      '<div class="cols"><div class="stack">' +
      '<div class="card panel"><h2>Metadata</h2><dl class="meta">' +
      row('Console', f.console) + row('System', f.os) + row('Folder', f.sub) + row('Label when shared', f.console_label) +
      row('Root model', f.root_model) + row('Root compatible', f.root_compatible) + row('SoC', f.soc.toUpperCase()) +
      row('Size', kb(f.bytes) + ' (' + f.bytes + ' bytes)') + row('Source', f.source_group) + row('Found at', f.upstream_path) +
      '</dl></div>' +
      '<div class="card panel"><h2>Hardware</h2><dl class="meta">' +
      row('Panel', f.panel_compatible) + row('Resolution', f.resolution) + row('Refresh', f.refresh_hz ? f.refresh_hz + ' Hz' : '') +
      row('DSI lanes', f.dsi_lanes) + row('Panel init', f.panel_init, true) + row('LCD reset pin', f.lcd_reset_pin) +
      row('LCD power', f.lcd_power) + row('PMIC', f.pmic) +
      row('Charge voltage', f.charge_voltage_mv ? f.charge_voltage_mv + ' mV' : '') +
      row('Charge current', f.charge_current_ma ? f.charge_current_ma + ' mA' : '') +
      row('Joypad', f.joypad_compatible) + row('Stick mux', f.stick_mux) + row('Button GPIOs', f.button_gpios) +
      row('MMC', f.mmc_status) + row('Wi-Fi', f.wifi_chip) + row('Same panel as andr36oid', f.same_panel_as_andr36oid.split(',').join(', ')) +
      row('andr36oid profile', f.andr36oid_profile) +
      '</dl>' + (f.file_type === 'dts' ? '<p class="muted">DTS source files are read as text. Fields are left empty unless they can be read reliably.</p>' : '') + '</div>' +
      '<div class="card panel"><h2>SHA-256</h2><p class="mono">' + esc(f.sha256) + '</p></div>' +
      '<div class="card panel"><details class="how"><summary>How to use this file</summary><ol>' +
      '<li>Back up the SD card first, or at least the whole boot partition, so you can undo the change.</li>' +
      '<li>Put the card in a computer and open the boot partition (the small FAT partition).</li>' +
      '<li>Find the device tree the system loads. Many systems use one file such as <span class="mono">rk3326-r35s-linux.dtb</span> or <span class="mono">rg351mp-kernel.dtb</span>. Rename the downloaded file to exactly that name and replace the original.</li>' +
      '<li>Eject the card safely, put it back in the console and turn it on. If it does not boot, restore the original from your backup.</li>' +
      '</ol><p class="note">A device tree for the wrong board can set a wrong voltage. Check the board marking printed on your mainboard before you use it.</p></details></div>' +
      '</div><div class="stack">' +
      '<div class="card panel"><h2>More files for ' + esc(f.console) + '</h2><div class="rel">' +
      (rel.length ? rel.map(function (o) {
        return '<a href="#/file/' + url(o.path) + '"><span class="badge">' + esc(TYPE[o.file_type] || o.file_type) + '</span> ' + esc(o.os) +
          '<div class="fn">' + esc(o.path.split('/').slice(2).join('/')) + '</div></a>';
      }).join('') : '<p class="muted">No other files.</p>') +
      '<a href="#/browse?console=' + encodeURIComponent(f.console) + '">View all files for this console</a></div></div>' +
      (sc.length ? '<div class="card panel"><h2>Same screen init</h2><p class="muted">Also used by:</p><div class="rel">' +
        sc.slice(0, 15).map(function (c) { return '<a href="#/browse?console=' + encodeURIComponent(c) + '">' + esc(c) + '</a>'; }).join('') +
        (sc.length > 15 ? '<p class="muted">and ' + (sc.length - 15) + ' more</p>' : '') + '</div></div>' : '') +
      '</div></div>';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- tables
  function table(id, head, rows, linkCol) {
    var t = $(id);
    t.innerHTML = '<thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr>' + r.map(function (c, i) {
          if (i === linkCol) return '<td><a href="#/browse?console=' + encodeURIComponent(c) + '">' + esc(c) + '</a></td>';
          return '<td' + (/^len\d+:/.test(c) ? ' class="mono"' : '') + '>' + esc(c) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody>';
  }
  function renderConsoles() {
    var q = $('qc').value.trim().toLowerCase();
    table('t-consoles', ['Folder', 'Also known as', 'Board marking', 'Panel init', 'Resolution', 'PMIC', 'Systems', 'andr36oid profile'],
      D.consoles.filter(function (r) { return !q || r.join(' ').toLowerCase().indexOf(q) >= 0; }), 0);
  }
  function renderPanels() {
    table('t-panels', ['Panel init', 'Init length', 'Resolution', 'Panel compatible', 'Files', 'Consoles', 'andr36oid profile'], D.panels, -1);
  }

  // ---------------------------------------------------------------- routing
  function show(v) {
    ['browse', 'file', 'consoles', 'panels'].forEach(function (n) { $('v-' + n).hidden = n !== v; });
    Array.prototype.forEach.call(document.querySelectorAll('#nav a[data-v]'), function (a) {
      a.classList.toggle('on', a.getAttribute('data-v') === (v === 'file' ? 'browse' : v));
    });
  }
  function fromHash() {
    if (!D) return;
    var h = location.hash.replace(/^#\/?/, '');
    if (h.indexOf('file/') === 0) {
      show('file');
      renderFile(h.slice(5).split('/').map(decodeURIComponent).join('/'));
      return;
    }
    document.title = 'Browse - opendtbvault';
    if (h === 'consoles') { show('consoles'); renderConsoles(); return; }
    if (h === 'panels') { show('panels'); renderPanels(); return; }
    show('browse');
    var m = /[?&]console=([^&]*)/.exec(h);
    if (m) { $('f-console').value = decodeURIComponent(m[1]); state.page = 1; }
    renderBrowse();
  }

  ['q', 'f-console', 'f-soc', 'f-os', 'f-type', 'f-group', 'f-sort', 'f-dups'].forEach(function (id) {
    $(id).addEventListener(id === 'q' ? 'input' : 'change', function () { state.page = 1; renderBrowse(); });
  });
  $('qc').addEventListener('input', renderConsoles);
  $('theme').addEventListener('click', function () {
    var d = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', d ? 'dark' : 'light'); } catch (e) { /* private mode */ }
  });
  window.addEventListener('hashchange', fromHash);
  load();
})();
