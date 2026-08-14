# Waystone

This app lets you play Magi-Nation Duel locally, against the bot. You can edit both your and opponents' decks, and all effects are automated.

The cards currently included in the app are almost all cards of the Base set.

Match simulator is implemented.

The reusable simulation class lives in src/bechamel/tests/simulation.ts.

For quick reproducible deck-vs-deck batches, use the harness in src/bechamel/tests/simulationHarness.ts:
- Configure card pools, run count, and base seed in defaultConfig.
- Build with npm run compile-sim.
- Run with npm run sim:harness.

Each harness run stores a compact JSON file in stateDumps with:
- seed
- generated decks for both players
- winner (if any)
- error message (if any)

The full action log is intentionally not stored, so any run can be reproduced by reusing the same seed and generated decks.