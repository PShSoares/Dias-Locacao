#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "VERSION" ]]; then
  echo "Arquivo VERSION nao encontrado." >&2
  exit 1
fi

product_version="$(tr -d '[:space:]' < VERSION)"
commit_count="$(git rev-list --count HEAD 2>/dev/null || echo 0)"
short_sha="$(git rev-parse --short HEAD 2>/dev/null || echo no-git)"

build_version="${product_version}+build.${commit_count}.${short_sha}"

echo "PRODUCT_VERSION=${product_version}"
echo "BUILD_VERSION=${build_version}"
echo "GIT_SHA=${short_sha}"
