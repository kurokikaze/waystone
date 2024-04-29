import { DragonlandService } from "./DragonlandService";
import { GameConnector } from "./GameConnector";
import { SimulationStrategy } from "./strategies/SimulationStrategy";
import { StrategyConnector } from "./StrategyConnector";

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function play(username: string, deckId: string) {
  const dragonlandService = new DragonlandService("http://localhost:3000");

  await dragonlandService.login(username, "testing"); // 'tester4'
  const challenges = await dragonlandService.getChallenges();
  console.dir(challenges);
  if (!challenges || !("length" in challenges) || !challenges.length) {
    console.log("No challenges");
    await dragonlandService.createChallenge(deckId); // SimulationStrategy.deckId
    dragonlandService.waitForGame(async (gameHash: string) => {
      await dragonlandService.accessGame(gameHash);

      await timeout(300); // Just in case

      const connector = new GameConnector("http://localhost:3000");
      const io = connector.connect(gameHash);

      io.on("connect", () => {
        console.log("Connected, id is ", io.id);
      });

      const strategyConnector = new StrategyConnector(io);

      strategyConnector.connect(new SimulationStrategy());
    });
  } else {
    console.log(
      `Ready to accept challenge ${challenges[0].deckId}:${challenges[0].user}`,
    );
    const gameHash = await dragonlandService.acceptChallenge(
      challenges[0].user,
      SimulationStrategy.deckId,
    );
    console.log(`Started game ${gameHash}`);

    if (!gameHash) {
      return false;
    }

    await dragonlandService.accessGame(gameHash);

    await timeout(300); // Just in case

    const connector = new GameConnector("http://localhost:3000");
    const io = connector.connect(gameHash);

    io.on("connect", () => {
      console.log("Connected, id is ", io.id);
    });

    const strategyConnector = new StrategyConnector(io);

    strategyConnector.connect(new SimulationStrategy());
  }
}
if (process.argv.length < 4) {
  console.log("Not enough arguments");
} else {
  play(process.argv[2], process.argv[3]);
}
