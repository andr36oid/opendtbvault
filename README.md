# opendtbvault

This repo aims to create a collection of DTB files, for the largest amount of consoles, for different operating systems.
  
To avoid running costs, like dtbvault.com says they have, this is entirely hosted on GitHub, so you don't need to make an account with me and there are no download limits per day.
  
I also do not want you to send me money on Ko-Fi to download DTB files the factory made. Developers are welcome to just bulk download all of them and use them to do their development.

## What is in here

Files are sorted by console, then by the system they came from:

```
<console>/<system>/[<more>/]<original file name>
R36S-Panel-4/stock/rk3326-rg351mp-linux.dtb
R36S-Panel-4/dArkOSen/rk3326-r36s-linux.dtb
K36/dArkOS-arkos4clone/5.10/rk3326-k36-linux.dtb
```

- `<console>` is the board marking printed on the mainboard where we know it (for example `G80CA-MB-V1.2`, `Y3506-V05-2551`), otherwise the console name. Files from different places only share a console folder when the board marking matches, or when the board wiring and the screen start sequence are the same.
- `<system>` is `stock` for the firmware the console shipped with, or the system the file came from (`ArkOS`, `dArkOS`, `dArkOSen`, `dArkOSRE`, `ROCKNIX`, `Armbian`, `andr36oid` and so on).
- Every `.dtb` and `.dtbo` has a `.dts` next to it with the same name plus `.dts`, decompiled with `dtc`, so you can read and diff it without tools.
- `index.tsv` - one line per file: console, system, the label it was shared with, SoC, panel, resolution, panel init, reset and power pins, PMIC, charge voltage and current, stick wiring, card slots, Wi-Fi chip, size and SHA-256.
- `panels.tsv` - one line per screen start sequence (panel init), with the consoles that use it.
- `consoles.tsv` - one line per console folder, with other names it is known by.
- `SOURCES.md` - where every group of files came from.
- `SHA256SUMS` - check your copy with `sha256sum -c SHA256SUMS`.
- `index.html` - a page to browse and search everything, for GitHub Pages.

Not only consoles: the device trees for other Rockchip boards that came with the same system images are here too.

Get everything at once:

```
git clone https://github.com/andr36oid/opendtbvault
```

Some searches:

```
# all files for one console
awk -F'\t' '$3=="R36S-Panel-4"' index.tsv

# which consoles use the same screen as a file you have (put its panel_init here)
awk -F'\t' '$19=="len370:abc2538808d7" {print $3}' index.tsv | sort -u

# every stock file with a 720x720 screen
awk -F'\t' '$4=="stock" && $15=="720x720" {print $1}' index.tsv
```

## About the labels

The board marking and system are what the person who shared the file wrote down. Some are wrong. Where a file's screen start sequence and board wiring clearly belong to another board, it sits under that board and `label_as_shared` keeps the label it came with. The `same_panel_as_andr36oid` column names the [andr36oid](https://github.com/andr36oid) profile that drives the same screen.

A device tree for the wrong board can set a wrong voltage. Check the board marking printed on your mainboard before you use any of these.

## Where the files come from

Device trees the console makers shipped on their stock cards, and device trees from community systems and their release images. `SOURCES.md` lists every source with its link and version. Device trees are compiled from Linux kernel and U-Boot sources under the GPL-2.0.

## Add a file

Open a pull request or an issue with the `.dtb`, the marking printed on the mainboard, and the system and card it came from.
