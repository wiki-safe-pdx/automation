# scrape a new site, once repo has been established
# usage: sh scripts/full-scrape.sh protocol site

if [ -d "../$2" ] 
then
  deno run --allow-net --allow-read --allow-write=.. scripts/full-scrape.js $1 $2 |\
    sh scripts/commit-push.sh
else
  echo "Error: Repo directory $2 does not exists. See README.md"
fi