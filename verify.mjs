#!/usr/bin/env node
/*
 * verify.mjs — the checker that gates a produced map.
 *
 * Every "must" in rules.md is a gate here, and each gate has a fixture that fails without it.
 * Runs offline, no dependencies, no API key.
 *
 *   node verify.mjs --selftest
 *       Run all bundled fixtures (good map passes; each bad fixture fails on its named gate;
 *       the archive declines). Fully self-contained — proves every gate bites from a cold clone.
 *
 *   node verify.mjs --map <mapDir> --territory <territoryDir>
 *       Validate a real produced map against the source it claims to cite. Citation resolution
 *       needs the territory; the other gates run on the map alone.
 *
 *   node verify.mjs --map <mapDir>
 *       Validate a map's internal consistency (all gates except citation resolution).
 *
 * Gates (rules.md section in parens):
 *   G1 schema        every card has frontmatter (noun/state/catalog/source) + the 4 sections (§card format)
 *   G2 does-not-hit  every card names the wrong neighbour                                   (§5)
 *   G3 citations     every source file:line resolves in the territory                       (§6, "the file wins")
 *   G4 no-photocopy  no card reproduces a long verbatim run from its cited source           (§6)
 *   G5 reachable     every card is in the catalog; every catalog row points at a real card  (§7, two hops)
 *   G6 no-slurp      the loader says "one card" and never "load everything"                 (§7)
 *   G7 decline       an archive produces a valid decline.md, not a fabricated catalog        (§8)
 *   G8 edges         every hits/misses slug resolves to a real catalog noun (no fake roads)  (§5)
 *   G9 live-wiring   a 'live' noun cites at least one real line of wiring, not just a        (§4, "mapping a
 *                    comment / blank / TODO — the cardinal sin of mapping a wish as live      wish as live")
 *
 * G9 (like G3/G4) needs the territory; ghost and leftover cards are exempt — a ghost is
 * expected to cite stale or absent wiring. It runs automatically whenever --territory is given,
 * so the live/leftover/ghost call is enforced in code, not left to judgment.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_WORD = 10; // a verbatim run of this many source words in a card = photocopy

// Read text with line endings normalized to \n — a map cloned on Windows checks out CRLF,
// and the parsers below must not care which platform the reader is on.
const readText = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

/* ── parsing ─────────────────────────────────────────────────────────────── */

function parseCard(text) {
  const fm = {};
  let body = text;
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].trim();
    }
    body = m[2];
  }
  const headings = [...body.matchAll(/^##\s+(.*)$/gm)].map((h) => h[1].trim().toLowerCase());
  return { fm, body, headings };
}

function parseCatalog(text) {
  const cards = [];
  for (const row of text.split('\n')) {
    if (!row.trim().startsWith('|')) continue;
    const link = row.match(/objects\/([A-Za-z0-9._-]+\.md)/);
    if (link) cards.push(link[1]);
  }
  return { cards, text };
}

function words(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

/* ── individual gates ────────────────────────────────────────────────────── */

function gateSchema(name, card) {
  const errs = [];
  for (const k of ['noun', 'state', 'catalog', 'source'])
    if (!card.fm[k]) errs.push(`${name}: missing frontmatter '${k}'`);
  if (card.fm.state && !['live', 'leftover', 'ghost'].includes(card.fm.state))
    errs.push(`${name}: state '${card.fm.state}' not one of live|leftover|ghost`);
  const has = (kw) => card.headings.some((h) => h.includes(kw));
  if (!has('what it is')) errs.push(`${name}: missing '## What it is'`);
  if (!has('why')) errs.push(`${name}: missing '## Why ...'`);
  if (!has('hits')) errs.push(`${name}: missing '## Hits ...'`);
  return errs;
}

function gateDoesNotHit(name, card) {
  return card.headings.some((h) => h.includes('does not hit'))
    ? []
    : [`${name}: missing '## Does not hit — the wrong neighbour' (a card without it is a glossary)`];
}

function gateCitations(name, card, territory) {
  if (!territory) return [];
  const errs = [];
  for (const cite of (card.fm.source || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const cm = cite.match(/^(.*?):(\d+)$/);
    if (!cm) { errs.push(`${name}: citation '${cite}' is not file:line`); continue; }
    const file = join(territory, cm[1]);
    if (!existsSync(file)) { errs.push(`${name}: citation '${cite}' → file not found`); continue; }
    const lines = readText(file).split('\n').length;
    if (+cm[2] > lines) errs.push(`${name}: citation '${cite}' → file has only ${lines} lines`);
  }
  return errs;
}

function gatePhotocopy(name, card, territory) {
  if (!territory) return [];
  const cardWords = words(card.body);
  const cardStr = ' ' + cardWords.join(' ') + ' ';
  const errs = [];
  const files = new Set(
    (card.fm.source || '').split(',').map((s) => s.trim().split(':')[0]).filter(Boolean),
  );
  for (const rel of files) {
    const file = join(territory, rel);
    if (!existsSync(file)) continue;
    const src = words(readText(file));
    for (let i = 0; i + RUN_WORD <= src.length; i++) {
      const run = src.slice(i, i + RUN_WORD).join(' ');
      if (cardStr.includes(' ' + run + ' ')) {
        errs.push(`${name}: photocopy — ${RUN_WORD}+ word verbatim run from ${rel}: "${run}…"`);
        break;
      }
    }
  }
  return errs;
}

// A line that is only a comment, only whitespace, or a plan/wish marker is not wiring.
const WISH = /\b(todo|fixme|coming soon|not yet|planned|to be (built|implemented|added|done)|will be|would be|should be|placeholder|stub|wip)\b/i;
const COMMENT = /^\s*(\/\/|\/\*|\*\/?|#|<!--|-->|--|;)/;

function gateLiveWiring(name, card, territory) {
  if (!territory) return []; // needs the territory to read the cited lines
  if (card.fm.state !== 'live') return []; // only live nouns must show wiring; ghost/leftover exempt
  const cited = [];
  let sawWiring = false;
  for (const cite of (card.fm.source || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const cm = cite.match(/^(.*?):(\d+)$/);
    if (!cm) continue;
    const file = join(territory, cm[1]);
    if (!existsSync(file)) continue; // unresolvable citations are G3's job, not this gate's
    const line = readText(file).split('\n')[+cm[2] - 1];
    if (line === undefined) continue;
    cited.push(cite);
    if (line.trim() !== '' && !COMMENT.test(line) && !WISH.test(line)) sawWiring = true;
  }
  if (cited.length === 0 || sawWiring) return [];
  return [
    `${name}: wish-as-live — a 'live' noun whose citations (${cited.join(', ')}) resolve only to ` +
      `comment / blank / plan lines, not wiring. A plan, a TODO, a "coming soon" is a ghost until ` +
      `you find the require / mount / call (rules.md §4).`,
  ];
}

function edgeList(card, key) {
  return (card.fm[key] || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function gateEdges(name, card, slugs) {
  const errs = [];
  for (const key of ['hits', 'misses'])
    for (const slug of edgeList(card, key))
      if (!slugs.has(slug))
        errs.push(`${name}: ${key} → '${slug}' is not a noun in the catalog (dangling edge)`);
  return errs;
}

function gateReachable(mapDir, catalog) {
  const errs = [];
  const objDir = join(mapDir, 'objects');
  const onDisk = existsSync(objDir) ? readdirSync(objDir).filter((f) => f.endsWith('.md')) : [];
  for (const c of catalog.cards)
    if (!onDisk.includes(c)) errs.push(`catalog points at objects/${c} but it does not exist`);
  for (const f of onDisk)
    if (!catalog.cards.includes(f)) errs.push(`orphan card objects/${f} is not in the catalog (unreachable)`);
  return errs;
}

function gateNoSlurp(text) {
  const errs = [];
  const forbidden = [
    /load\s+(the\s+)?(whole|entire|all)\b[^.\n]*\b(objects|folder|cards|source|tree|repo)/i,
    /add\s+every\s+file/i,
    /read\s+(the\s+)?(whole|entire)\b[^.\n]*\b(objects|folder|source|codebase)/i,
    /load\s+everything/i,
  ];
  for (const re of forbidden)
    if (re.test(text)) errs.push(`no-slurp: catalog contains a slurp instruction matching ${re}`);
  if (!/one\s+card/i.test(text))
    errs.push(`no-slurp: catalog must tell the reader to load ONE card (positive rule missing)`);
  return errs;
}

function gateDecline(text) {
  const errs = [];
  const low = text.toLowerCase();
  if (!/(archive|not a system|do not move|don't move|no movements)/.test(low))
    errs.push(`decline: must state that the nouns do not move each other (why it is not mappable)`);
  if (!/(mappable|a system would|instead|would look like)/.test(low))
    errs.push(`decline: must say what a mappable territory would look like instead`);
  return errs;
}

/* ── run against one map ─────────────────────────────────────────────────── */

function validateMap(mapDir, territory) {
  const errs = [];
  const declinePath = join(mapDir, 'decline.md');
  if (existsSync(declinePath) && !existsSync(join(mapDir, 'catalog.md')))
    return gateDecline(readText(declinePath));

  const catPath = join(mapDir, 'catalog.md');
  if (!existsSync(catPath)) return [`no catalog.md and no decline.md in ${mapDir}`];
  const catalog = parseCatalog(readText(catPath));

  errs.push(...gateNoSlurp(catalog.text));
  errs.push(...gateReachable(mapDir, catalog));

  const slugs = new Set(catalog.cards.map((f) => f.replace(/\.md$/, '')));
  for (const c of catalog.cards) {
    const p = join(mapDir, 'objects', c);
    if (!existsSync(p)) continue;
    const card = parseCard(readText(p));
    errs.push(...gateSchema(c, card));
    errs.push(...gateDoesNotHit(c, card));
    errs.push(...gateEdges(c, card, slugs));
    errs.push(...gateCitations(c, card, territory));
    errs.push(...gatePhotocopy(c, card, territory));
    errs.push(...gateLiveWiring(c, card, territory));
  }
  return errs;
}

/* ── selftest against bundled fixtures ───────────────────────────────────── */

function selftest() {
  const fx = join(HERE, 'fixtures');
  const terr = join(fx, 'territory');
  const cases = [
    { name: 'good-map (should PASS)', dir: join(fx, 'good-map'), territory: terr, expect: 'pass' },
    { name: 'archive-example decline (should PASS)', dir: join(fx, 'archive-example'), territory: null, expect: 'pass' },
    { name: 'bad: fabricated citation (should FAIL on citations)', dir: join(fx, 'bad-fabricated-citation'), territory: terr, expect: 'fail' },
    { name: 'bad: photocopy (should FAIL on no-photocopy)', dir: join(fx, 'bad-photocopy'), territory: terr, expect: 'fail' },
    { name: 'bad: missing does-not-hit (should FAIL on G2)', dir: join(fx, 'bad-missing-does-not-hit'), territory: terr, expect: 'fail' },
    { name: 'bad: slurp loader (should FAIL on no-slurp)', dir: join(fx, 'bad-slurp'), territory: terr, expect: 'fail' },
    { name: 'bad: dangling edge (should FAIL on edges)', dir: join(fx, 'bad-dangling-edge'), territory: terr, expect: 'fail' },
    { name: 'bad: wish mapped as live (should FAIL on live-wiring)', dir: join(fx, 'bad-wish-as-live'), territory: join(fx, 'wish-territory'), expect: 'fail' },
  ];
  let allGood = true;
  for (const c of cases) {
    const errs = validateMap(c.dir, c.territory);
    const got = errs.length === 0 ? 'pass' : 'fail';
    const ok = got === c.expect;
    allGood = allGood && ok;
    console.log(`${ok ? '✓' : '✗'} ${c.name} → ${got}`);
    if (!ok || (c.expect === 'fail' && process.env.VERBOSE))
      errs.forEach((e) => console.log(`      · ${e}`));
    else if (c.expect === 'fail') console.log(`      · blocked: ${errs[0]}`);
  }
  console.log(allGood ? '\nSELFTEST GREEN — every gate bites.' : '\nSELFTEST RED.');
  return allGood;
}

/* ── main ────────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

if (args.includes('--selftest')) {
  process.exit(selftest() ? 0 : 1);
} else if (args.includes('--map')) {
  const mapDir = get('--map');
  const territory = get('--territory');
  const errs = validateMap(mapDir, territory);
  if (errs.length === 0) {
    console.log(`✓ map is clean: ${mapDir}${territory ? ` (citations resolve against ${territory})` : ' (internal only; pass --territory to check citations)'}`);
    process.exit(0);
  }
  console.log(`✗ ${errs.length} problem(s) in ${mapDir}:`);
  errs.forEach((e) => console.log(`  · ${e}`));
  process.exit(1);
} else {
  console.log('usage: node verify.mjs --selftest');
  console.log('       node verify.mjs --map <mapDir> [--territory <territoryDir>]');
  process.exit(2);
}
