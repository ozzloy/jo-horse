#! /usr/bin/env bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

git status --porcelain | grep '^\s*[MADRC]' > /dev/null
if [ $? -eq 0 ]; then
    git add -u

    git commit --allow-empty-message -m ""

    git push origin "$BRANCH"
fi
