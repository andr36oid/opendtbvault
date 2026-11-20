# Sources

Every file in this repo was collected from the places below. Device trees describe hardware and almost all
of them come from the Linux kernel or U-Boot, which are GPL-2.0 (mainline device trees are often GPL-2.0
or MIT). Credit goes to the people who wrote and shared them. Each group below says where the files came
from and which OS folder they sit in (the second level of the tree: `<console>/<os>/`).

The `source_group` column of index.tsv names the group of every file, and `upstream_path` says where in
the source it was found.

## dArkOSen

- Source: https://github.com/djparentx/dArkOSen-R36S
- Version: commit 28f5427f7ae953ee6e813618705baf569fef0f27
- Taken: boot/dtb (r36s/, clone/, soysauce/): kernel and U-Boot DTBs per console folder
- Files here: 114, in OS folders `dArkOSen` (114)
- Licence: GPL-2.0 (Linux kernel / U-Boot device trees)

## dArkOSen release images

- Source: https://github.com/djparentx/dArkOSen-R36S/releases
- Version: images dArkOSen_R36_10152026, 10312026, 11112026 and update zip 10152026
- Taken: BOOT partition DTBs and the DTBs inside the U-Boot area, only files not already in the repo
- Files here: 33, in OS folders `dArkOSen` (33)
- Licence: GPL-2.0

## dArkOSRE

- Source: https://github.com/southoz/dArkOSRE-R36
- Version: commit 3f372c85aa53a26b265c3dc0c2661ec0fae5faf0
- Taken: files/BOOT/dtb and the default files at the top of BOOT
- Files here: 97, in OS folders `dArkOSRE` (97)
- Licence: GPL-2.0

## christianhaitian/linux (the dArkOS kernel)

- Source: https://github.com/christianhaitian/linux
- Version: branch rg351 commit 14c877ff3390cc41bc7ed35af0d168a8c04ab639, branch odroidgoA-4.4.y commit daf063fc503be035a3df68ad59209ee62c57cfc9
- Taken: arch/arm64/boot/dts/rockchip rk3326-* and px30-* DTS source files (not compiled, the include tree is not here)
- Files here: 81, in OS folders `dArkOS` (81)
- Licence: GPL-2.0

## arkos4clone

- Source: https://github.com/lcdyk0517/arkos4clone
- Version: commit 2656e5b6c063dd16badd1f7642752f0b280dbdd3
- Taken: boot/dArkOS/consoles: 4.4 and 5.10 DTB per console
- Files here: 184, in OS folders `dArkOS-arkos4clone` (184)
- Licence: GPL-2.0

## ArkOS4Clone and dArkOS4Clone release images

- Source: https://github.com/lcdyk0517/arkos4clone/releases
- Version: images ArkOS4Clone-20261008 and dArkOS4Clone-20261008
- Taken: DTBs not already in the repo (BOOT consoles/ and U-Boot area)
- Files here: 3, in OS folders `ArkOS-arkos4clone` (3)
- Licence: GPL-2.0

## AeolusUX R36S-DTB

- Source: https://github.com/AeolusUX/R36S-DTB
- Version: commit c2cceda38df84d872328d596aeff2646b1a56dc3
- Taken: R36S Panel 0-6, Panel 4-V22, R46H, RGB20S DTBs and DTS
- Files here: 51, in OS folders `ArkOS` (51)
- Licence: the repo README says CC BY-NC-ND 4.0; the device trees themselves derive from GPL-2.0 sources

## ArkOS release image

- Version: image ArkOS_R35S-R36S_v2.0_11072025_MultiPanel
- Taken: DTBs not already in the repo
- Files here: 1, in OS folders `ArkOS` (1)
- Licence: GPL-2.0

## EE-Clones-DTB

- Source: https://github.com/Vi-K36/EE-Clones-DTB
- Version: commit 73fb2cf
- Taken: stock and ArkOS DTBs per clone console
- Files here: 110, in OS folders `ArkOS` (16), `Gamely-Code` (14), `Refresh-Rate-Fix-by-mcasoo` (2), `stock` (78)
- Licence: GPL-2.0 (no licence file in the repo)

## Andr36oid-dtb-for-Clones

- Source: https://github.com/K4uanGP/Andr36oid-dtb-for-Clones
- Version: commit 316effe
- Taken: community andr36oid DTBs for clone consoles
- Files here: 11, in OS folders `andr36oid-community` (11)
- Licence: GPL-2.0

## R36S-K36-DTB-PATCH

- Source: https://github.com/immo2n/R36S-K36-DTB-PATCH
- Version: commit cdd88b8
- Taken: patched K36 DTBs and the stock rf3536k3ka DTS
- Files here: 3, in OS folders `dArkOS-arkos4clone-patched` (2), `stock` (1)
- Licence: GPL-2.0

## R36S-V30-DTB

- Source: https://github.com/basyair7/R36S-V30-DTB
- Version: commit 9ea3ca4
- Taken: R36S V30 DTBs
- Files here: 10, in OS folders `ArkOS` (10)
- Licence: GPL-2.0

## ROCKNIX

- Source: https://github.com/ROCKNIX/distribution
- Version: boot files of a build with a kernel dated 2025-07-05
- Taken: mainline DTBs and overlays not already in the repo
- Files here: 14, in OS folders `ROCKNIX` (14)
- Licence: GPL-2.0 or MIT (mainline Linux device trees)

## Armbian images for the R36S

- Version: images armbian-r36s-noble-xfce and armbian-r36s-bookworm-xfce (kernel 6.12.32)
- Taken: ScreenFiles panel DTBs from the FAT partition and every DTB in /boot/dtb of the root file system
- Files here: 167, in OS folders `Armbian` (167)
- Licence: GPL-2.0 or MIT (mainline Linux device trees)

## BadgeOS

- Version: release image
- Taken: rk3326-r36s.dtb
- Files here: 1, in OS folders `BadgeOS` (1)
- Licence: GPL-2.0

## stock firmware images

- Version: RG28XX V1.1.3, Mini 28 V2.1, a D-28S eMMC backup
- Taken: DTBs found in the bootloader, boot and resource areas
- Files here: 16, in OS folders `stock` (16)
- Licence: vendor files, shared for reference

## files shared by console owners

- Taken: stock and CFW DTBs sent in by owners
- Files here: 25, in OS folders `dArkOSRE` (7), `EmuELEC` (1), `ROCKNIX` (1), `stock` (16)
- Licence: vendor or CFW files, shared for reference

## files sent to andr36oid

- Taken: stock DTBs sent by owners of the consoles
- Files here: 9, in OS folders `stock` (9)
- Licence: vendor files, shared for reference

## issue reports

- Taken: DTBs attached to issue reports (stock, CFW and fixed versions)
- Files here: 136, in OS folders `andr36oid-community` (1), `dArkOS-arkos4clone` (1), `stock` (1), `unknown-system` (133)
- Licence: vendor or CFW files, shared for reference

## other files

- Taken: DTBs whose origin was not recorded when they were collected
- Files here: 11, in OS folders `ArkOS` (1), `ROCKNIX` (1), `unknown-system` (9)
- Licence: unknown, shared for reference

## andr36oid

- Source: https://github.com/andr36oid
- Version: kernel 5.10 candidate 12 and the BOOT profiles of the flasher
- Taken: kernel DTBs and the per-profile U-Boot logo DTBs
- Files here: 126, in OS folders `andr36oid` (126)
- Licence: GPL-2.0

## OS folder names

- `stock`: the firmware the console shipped with (also "original SD" and "stock SD" files)
- `ArkOS`, `dArkOS`, `dArkOSen`, `dArkOSRE`, `ROCKNIX`, `Armbian`, `BadgeOS`: that CFW
- `ArkOS-arkos4clone`, `dArkOS-arkos4clone`: the arkos4clone builds of ArkOS and dArkOS
- `dArkOS-arkos4clone-patched`: arkos4clone DTBs with a community patch
- `andr36oid`, `andr36oid-community`: andr36oid, and DTBs others made for it
- `darkos4all`, `unknown-system`: from an issue report, the CFW named there or none
