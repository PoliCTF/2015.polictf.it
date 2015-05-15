#!/bin/sh
which clay
if [ $? -eq 0 ]; then
    rm -rf build
    clay build
    cp source/news.html build/
    cd build
    git init
    git add -A
    git commit -m "deploy static website"
    git push -u git@github.com:PoliCTF/polictf.github.io master:master --force
fi
