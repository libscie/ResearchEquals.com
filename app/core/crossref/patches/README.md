# XSD Patches

The raw XSDs taken from Crossref and JATS will not work with `node-libxml`, so we need to apply to some manual patches for it to parse.

Most of these patches involve changing the remote urls to local ones, but a few more changes are needed due.

These changes are reflected in `[xsd.diff](./xsd.diff)`.

# How to use

1. First, download the original schemas in a folder called `original-schemas` in a structure identical to the schemas in `schemas`.

2. Run `npm run patch-xsds` from the root directory

Under the hood this runs `cd app/core/crossref && cp -r original-schemas original-schemas-bak && patch -s -p0 < patches/xsd.diff && mv original-schemas schemas && mv original-schemas-bak original-schemas`

- [ ] TODO: Create a script that does all this for you
