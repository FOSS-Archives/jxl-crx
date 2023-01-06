JPEG XL browser extension
===

This is a browser extension that brings [JPEG XL] support for browsers.

[JPEG XL]: <https://jpegxl.info>

license
---

[GNU][GPL] [AGPL] ([v3][AGPLv3] [or later][GPLv3+])

[GPL]: <https://www.gnu.org/licenses/>
[AGPL]: <https://www.gnu.org/licenses/why-affero-gpl.html>
[AGPLv3]: <https://www.gnu.org/licenses/agpl-3.0>
[GPLv3+]: <https://www.gnu.org/licenses/gpl-faq.html#VersionThreeOrLater>

install
---

- [**Install from the Chrome Web Store**][Web Store listing]
- [**Install from Firefox Add-ons**][Firefox Add-ons listing]

[Web Store listing]: <https://chrome.google.com/webstore/detail/jpeg-xl-viewer/bkhdlfmkaenamnlbpdfplekldlnghchp>
[Firefox Add-ons listing]: <https://addons.mozilla.org/addon/jxl>

build instructions
---

~~~
git clone https://github.com/zamfofex/jxl-crx
cd jxl-crx
scripts/build.sh
~~~

This will download and build dependencies and create `jxl-mv2.zip` and `jxl-mv3.zip` output files in this repository’s directory.

Note for [Guix] users: You may prefer to use `scripts/guix-build.sh` instead, which will set up a FHS container with the necessary package dependencies for you. However, note that binaries will still be downloaded, so the container has network access.

[Guix]: <https://guix.gnu.org>

previous versions
---

The source code for versions prior to 0.2 can be found here: <https://gist.github.com/zamfofex/e6e0109862e5da8e7f6fa634b1ceca26>
