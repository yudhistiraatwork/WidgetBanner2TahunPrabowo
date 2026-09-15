#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE_URL="https://github.com/yudhistiraatwork/WidgetBanner2TahunPrabowo.git"
COMMIT_MESSAGE="Initial banner implementation"

cd "$PROJECT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "Git belum terpasang. Instal Git terlebih dahulu, lalu jalankan ulang skrip ini."
  exit 1
fi

if ! git config user.name >/dev/null || ! git config user.email >/dev/null; then
  echo "Atur identitas Git terlebih dahulu:"
  echo "  git config --global user.name \"Nama Kamu\""
  echo "  git config --global user.email \"email@kamu.com\""
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_REMOTE="$(git remote get-url origin)"

  if [ "$CURRENT_REMOTE" != "$REMOTE_URL" ]; then
    echo "Remote origin sudah ada dan mengarah ke: $CURRENT_REMOTE"
    echo "Skrip dihentikan agar remote yang ada tidak tertimpa."
    exit 1
  fi
else
  git remote add origin "$REMOTE_URL"
fi

# Bila repository GitHub sudah dibuat dengan README, ambil commit awalnya terlebih dahulu.
if ! git rev-parse --verify HEAD >/dev/null 2>&1 && git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
  git fetch origin main
  git checkout -B main origin/main
fi

git add --all

if ! git diff --cached --quiet; then
  git commit -m "$COMMIT_MESSAGE"
else
  echo "Tidak ada perubahan baru untuk di-commit."
fi

git branch -M main
git push -u origin main

echo "Selesai: proyek sudah dipush ke $REMOTE_URL"
