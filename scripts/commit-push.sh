# commit changes and push repos
# usage: echo repo | sh scripts/commit-push.sh

while read repo; do
  cd ../$repo
  git add .
  git commit -m update
  git push
done