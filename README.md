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

## Everflame network server

The shared server address is configured in `src/config/everflame.json`:

```json
{
  "serverUrl": "http://localhost:3000"
}
```

Set the HTTP(S) base address of your Everflame installation, without `/game`,
`/challenge` or `/socket.io`. Both Socket.IO namespaces and the legacy challenge
list request use this address. The checked-in default is the original EC2 host.
The configuration is bundled into the app: rebuild Waystone after changing it
for a packaged Tauri application.

Each local or network match has its own Redux store. A network snapshot replaces
the previous UI state, rebuilds prompt allocations and static abilities, and
discards pending animations from the old connection. Reconnecting during a
prompt restores the server's pending choice; unfinished local selections are
reset. Actions are sent only after authentication and a fresh snapshot arrive.

## Replays and diagnostics

The desktop app stores replay `.log` files in `replays` under Tauri's AppConfig
directory. On Windows this is `%APPDATA%\waystone\replays` (Roaming, not Local).
The directory is created automatically before listing or saving matches.
The web version uses the bundled sample replays.

Replay loading errors appear on screen and are saved as JSON files in
`%APPDATA%\waystone\debugDumps`. Unhandled frontend errors and rejected promises
are also recorded there. State dumps use `%APPDATA%\waystone\stateDumps`.
Diagnostic directories are created when a dump is written; the app does not
currently maintain a continuous console log file.
