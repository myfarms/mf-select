#!/bin/bash

cd src
npm --no-git-tag-version version "$@"
git add package.json
cd ..
npm version --force "$@"
