# How to capture a new receipt

A receipt is a real run of the cartographer on a real folder, committed so a stranger can
re-verify it cold. The more real runs, the stronger the entry. This is the loop — repeat it on any
folder you own over the next few weeks.

## The loop

1. **Pick a folder you own and can publish** — a repo, a delivery folder, an automation pack. Not
   a client's proprietary code, not one that contains secrets, not an ICM/methodology folder (the
   territory is a body of work, not the method).
2. **Point the cartographer at it.** In a Claude project holding this folder + the territory:
   *"Be the cartographer. Map `<folder>`. Follow rules.md. Map the spine, not the whole tree."*
3. **Save the produced map** under `receipts/<name>/` — `catalog.md` + `objects/*.md` (or a
   `decline.md` if it's an archive). Add a short `run-notes.md`: what the territory is, who the
   later reader is, what you mapped and what you left off.
4. **Gate it green:**
   ```bash
   node verify.mjs --map receipts/<name> --territory /path/to/<folder>
   ```
   Fix any citation the checker rejects (the file wins — if it can't resolve, the card is wrong).
5. **Commit** the receipt. It is now reproducible from a cold clone (as long as the territory is
   public, or the reader has it).

## What makes a receipt strong

- **It cites source and gates green** — every `file:line` resolves; nothing is photocopied.
- **It has a real ghost or leftover**, marked — the honest residue is what proves you inventoried,
  not guessed.
- **It names a real "wrong neighbour"** on at least one card — the line that makes it a map.
- **A decline counts.** An honest "this folder is an archive, not a system" is a receipt too, and
  a strong one — it shows the tool knows the limit of its own job.

## Folders worth mapping (all yours, all safe to publish)

- `vendor-lilly` — done (`receipts/vendor-lilly/`).
- `atomic-tattoo-removal` — done (`receipts/atomic-tattoo-removal/`): the three-backends-in-one-repo map.
- `astanza-crm` — the clinic CRM (exclude `uploads/` + `offline-submissions/` — real customer data).
- `brewerybytes` — a smaller React + Firebase app; good for a compact second map.

Skip: `MySeniorCenter` (client code + SSNs), `fiji-modern` / `consignment-radar` (ICM starters —
that's mapping the method).
