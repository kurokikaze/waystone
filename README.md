# Waystone

This app lets you play Magi-Nation Duel locally, against the bot. You can edit both your and opponents' decks, and all effects are automated.

The cards currently included in the app are almost all cards of the Base set.

Match simulator is implemented. The decks and random seed are set in the `src/bechamel/tests/simulation.ts`, the sim is compiled with `npm run compile-sim` and started with `npm run sim`.