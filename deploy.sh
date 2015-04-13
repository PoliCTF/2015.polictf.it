workon polictf
rm -rf build
clay build
cd build
git init
git add -A
git commit -m "deploy static website"
git push -u git@github.com:TowerofHanoi/polictf.git master:gh-pages --force

