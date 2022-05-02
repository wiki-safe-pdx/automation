// scrape a new site, once repo has been established
// usage: deno run --allow-net --allow-read --allow-write=.. scripts/full-scrape.js protocol site

const protocol = Deno.args[0]
const site = Deno.args[1]
const sitemap = await fetch(`${protocol}://${site}/system/sitemap.json`).then(res => res.json())

// sitemap: [
//   {
//     slug: "about-changes-plugin",
//     title: "About Changes Plugin",
//     date: 1345050921509,
//     synopsis: "Changes reports pages ..."
//   }, ... ]

const inflight = []
for (const info of sitemap) {
  if (inflight.length > 5) await inflight.pop()
  inflight.push(backup(site, info.slug))
}
await Promise.all(inflight)

const sync = JSON.parse(Deno.readTextFileSync('status/sync.json'))
sync[site] = {protocol, update: Date.now()}
Deno.writeTextFileSync('status/sync.json',JSON.stringify(sync,null,2))
console.log(site) // pipe to commit-push script

async function backup(site, slug) {
  const json = await fetch(`${protocol}://${site}/${slug}.json`).then(res => res.json())
  await Deno.writeTextFile(`../${site}/${slug}`, JSON.stringify(json,null,2))
}
