# Waystone

This app lets you play Magi-Nation Duel locally, against the bot. You can edit both your and opponents' decks, and all effects are automated.

The cards currently included in the app are almost all cards of the Base set.

Bot code, tests and the match-simulation harness live in the sibling Bechamel
package. Shared wire messages and engine command conversion come from the
duel-protocol 0.1.0 GitHub Release archive. Moonlands remains the game engine.

For local development, keep Waystone and Bechamel side by side. Install and build
bechamel, then run `npm install` and
`npm run build` here. See `../bechamel/README.md` for commands and public APIs,
and `../duel-protocol/README.md` for package boundaries and the future triage split.

`src/worker/botWorker.ts` is the application adapter: it connects Bechamel to a
Web Worker and injects the application's diagnostic service. The local engine
host remains in `src/containedEngine`; wire conversion is re-exported there for
existing application imports.

The npm lockfile uses public registry URLs. The pre-existing Yarn lockfile is
preserved; npm is the verified installation path for this extraction.
