#!/bin/sh
which clay
if [ $? -eq 0 ]; then
    rm -rf build
    clay build
    cp source/news.html build/
    cp -r source/scoreboard build/
    cd build
    git init
    git add -A
    git commit -m "deploy static website"
    git push -u git@github.com:PoliCTF/2015.polictf.it master:master --force
fi
