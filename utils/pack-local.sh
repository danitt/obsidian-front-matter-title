#!/usr/bin/env bash
set -euo pipefail

node utils/pack-release.mjs release
rm -rf dist
mkdir dist
cp -r .packs/obsidian-front-matter-title-*/* dist/
rm dist/*.zip