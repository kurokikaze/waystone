import * as fs from 'node:fs';
import * as path from 'node:path';
import { type DeckConfig, Simulation } from './simulation';
import { DeckSampler, type DeckPool } from './DeckSampler';

type HarnessConfig = {
    runs: number;
    baseSeed: number;
    deckSize: number;
    outputDir: string;
    verbose: boolean;
    maxIterations: number;
    strategy: 'simulation' | 'recon';
    playerOnePool: DeckPool;
    playerTwoPool: DeckPool;
};

type SimulationRunResult = {
    run: number;
    seed: number;
    playerOneDeck: DeckConfig;
    playerTwoDeck: DeckConfig;
    winner: 1 | 2 | null;
    winnerName: string | null;
    error: string | null;
};

type HarnessOutput = {
    createdAt: string;
    config: HarnessConfig;
    results: SimulationRunResult[];
};

type CliOverrides = Partial<Pick<HarnessConfig, 'runs' | 'baseSeed' | 'deckSize' | 'outputDir' | 'verbose' | 'maxIterations' | 'strategy'>>;

const defaultConfig: HarnessConfig = {
    runs: 5,
    baseSeed: 2053,
    deckSize: 43,
    outputDir: './stateDumps',
    verbose: false,
    maxIterations: 5000,
    strategy: 'simulation',
    playerOnePool: {
        name: 'Cald Pool',
        magi: ['Grega', 'Magam', 'Sinder', 'Gar', 'Barak', 'Valkan', 'Ashgar'],
        cards: [
            'Fire Chogo',
            'Water of Life',
            'Fire Grag',
            'Arbolit',
            'Dream Balm',
            'Magma Hyren',
            'Kelthet',
            'Lava Aq',
            'Lava Arboll',
            'Diobor',
            'Drakan',
            'Thermal Blast',
            'Flame Geyser',
            'Lava Balamant',
            "Magma Armor",
            "Magma Hyren",
            'Quor',
            'Quor Pup',
            'Greater Vaal'
        ],
    },
    playerTwoPool: {
        name: 'Naroom Pool',
        magi: ['Poad', 'Tryn', 'Yaki', 'Pruitt', 'Evu', 'Orwin'],
        cards: [
            'Bhatar',
            'Timber Hyren',
            'Twee',
            'Balamant Pup',
            'Rudwot',
            'Arboll',
            'Carillion',
            'Furok',
            'Leaf Hyren',
            'Plith',
            'Weebo',
            'Ancestral Flute',
            'Robe of Vines',
            'Water of Life',
            "Hyren's Call",
            "Orwin's Gaze",
            'Vortex of Knowledge',
            'Grow',
            'Giant Carillion',
        ],
    },
};

function parseCliOverrides(args: string[]): CliOverrides {
    const overrides: CliOverrides = {};

    for (const arg of args) {
        if (!arg.startsWith('--')) {
            continue;
        }

        const [rawKey, rawValue] = arg.slice(2).split('=');
        const value = rawValue ?? '';

        switch (rawKey) {
            case 'runs':
                overrides.runs = Number(value);
                break;
            case 'baseSeed':
                overrides.baseSeed = Number(value);
                break;
            case 'deckSize':
                overrides.deckSize = Number(value);
                break;
            case 'maxIterations':
                overrides.maxIterations = Number(value);
                break;
            case 'outputDir':
                overrides.outputDir = value;
                break;
            case 'verbose':
                overrides.verbose = value === 'true' || value === '1';
                break;
            case 'strategy':
                if (value === 'recon' || value === 'simulation') overrides.strategy = value;
                break;
            default:
                break;
        }
    }

    return overrides;
}

function withConfigOverrides(baseConfig: HarnessConfig, overrides: CliOverrides): HarnessConfig {
    return {
        ...baseConfig,
        ...Object.fromEntries(
            Object.entries(overrides).filter(([, value]) => value !== undefined && value !== null && value !== ''),
        ),
    } as HarnessConfig;
}

function runSingleSimulation(config: HarnessConfig, runIndex: number): SimulationRunResult {
    const deckSampler = new DeckSampler({
        magiCount: 3,
        maxCopiesPerCard: 3,
    });

    const seed = config.baseSeed + runIndex;
    const playerOneDeck = deckSampler.sampleDeck(config.playerOnePool, config.deckSize, seed * 3 + 1);
    const playerTwoDeck = deckSampler.sampleDeck(config.playerTwoPool, config.deckSize, seed * 3 + 2);

    const simulation = new Simulation({
        rng: seed,
        playerOne: playerOneDeck,
        playerTwo: playerTwoDeck,
        writeLogs: false,
        maxIterations: config.maxIterations,
        strategy: config.strategy,
    });

    let winner: 1 | 2 | null = null;
    let winnerName: string | null = null;
    let error: string | null = null;

    simulation.subscribe({
        next: (result) => {
            winner = result.winner;
            winnerName = result.winnerName;
        },
        error: (runError) => {
            error = runError.message;
        },
    });

    const runSimulation = () => {
        try {
            const result = simulation.run();
            winner = result.winner;
            winnerName = result.winnerName;
        } catch (runError: unknown) {
            const message = runError instanceof Error ? runError.message : String(runError);
            error = message;
        }
    };

    if (config.verbose) {
        console.log('Running verbose simulation with seed:', seed);
        runSimulation();
    } else {
        console.log('Running simulation with seed:', seed);
        withMutedConsole(runSimulation);
    }

    return {
        run: runIndex + 1,
        seed,
        playerOneDeck,
        playerTwoDeck,
        winner,
        winnerName,
        error,
    };
}

function withMutedConsole(callback: () => void) {
    const originalLog = console.log;
    const originalDir = console.dir;
    const originalError = console.error;
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    const originalStderrWrite = process.stderr.write.bind(process.stderr);

    console.log = () => {};
    console.dir = () => {};
    console.error = () => {};
    process.stdout.write = (() => true) as typeof process.stdout.write;
    process.stderr.write = (() => true) as typeof process.stderr.write;

    try {
        callback();
    } finally {
        console.log = originalLog;
        console.dir = originalDir;
        console.error = originalError;
        process.stdout.write = originalStdoutWrite;
        process.stderr.write = originalStderrWrite;
    }
}

function runHarness(config: HarnessConfig): HarnessOutput {
    const results: SimulationRunResult[] = [];

    for (let runIndex = 0; runIndex < config.runs; runIndex++) {
        const result = runSingleSimulation(config, runIndex);
        results.push(result);
    }

    return {
        createdAt: new Date().toISOString(),
        config,
        results,
    };
}

function persistHarnessOutput(output: HarnessOutput): string {
    fs.mkdirSync(output.config.outputDir, { recursive: true });

    const filename = `${output.createdAt.replace(/[.:]/g, '-')}_simulation-harness.json`;
    const outputPath = path.join(output.config.outputDir, filename);

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    return outputPath;
}

function summarize(output: HarnessOutput) {
    const successCount = output.results.filter(result => !result.error).length;
    const errorCount = output.results.length - successCount;

    console.log(`Simulation harness completed: ${successCount}/${output.results.length} successful runs`);
    if (errorCount > 0) {
        console.log(`Runs with errors: ${errorCount}`);
    }
}

const harnessConfig = withConfigOverrides(defaultConfig, parseCliOverrides(process.argv.slice(2)));
const harnessOutput = runHarness(harnessConfig);
const outputPath = persistHarnessOutput(harnessOutput);

summarize(harnessOutput);
console.log(`Saved harness output to ${outputPath}`);
