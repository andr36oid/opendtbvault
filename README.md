# opendtbvault

This repo aims to create a collection of DTB files, for the largest amount of consoles, for different operating systems.
  
To avoid running costs, like dtbvault.com says they have, this is entirely hosted on GitHub, so you don't need to make an account with me and there are no download limits per day.
  
I also do not want you to send me money on Ko-Fi to download DTB files the factory made. Developers are welcome to just bulk download all of them and use them to do their development.

## What is in here

- `dtb/<board marking>__<system>/` - one folder per file. Each holds the original `.dtb` (or `.dtbo`) under its original file name, and a `.dts` next to it, decompiled with `dtc` so you can read and diff it without tools.
- `index.tsv` - one line per file: path, board marking as labelled by whoever shared it, RAM, the system it came from, where it was taken from, the root `compatible` string, size and SHA-256.
- `SHA256SUMS` - check your copy with `sha256sum -c SHA256SUMS`.

Get everything at once:

```
git clone https://github.com/andr36oid/opendtbvault
```

## About the labels

The board marking and system are what the person who shared the file wrote down. Some are wrong. The last two columns of `index.tsv` are our own check: we compared each file's screen start sequence and board wiring (reset and power pins, power chip, stick wiring, card slots) with the device trees of [andr36oid](https://github.com/andr36oid) and name the profile it matches.

A device tree for the wrong board can set a wrong voltage. Check the board marking printed on your mainboard before you use any of these.

## Where the files come from

These are device trees the console makers shipped on their stock cards, and device trees from community systems (ArkOS, dArkOS RE, EmuELEC, ROCKNIX). They are compiled from Linux kernel sources under the GPL-2.0.

## Add a file

Open a pull request or an issue with the `.dtb`, the marking printed on the mainboard, and the system and card it came from.
