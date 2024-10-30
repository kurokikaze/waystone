import { BaseDirectory, create, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import { booleanGuard } from "../bechamel/strategies/simulationUtils";
import { ClientMessage } from "../clientProtocol";
import testReplay from './testReplay.json';
import testReplay2 from './testReplay2.json';

export class ReplayLogService {
    static REPLAYS_DIR = 'replays'

    private isTauri() {
        return Boolean(
            typeof window !== 'undefined' &&
            window !== undefined &&
            // @ts-ignore
            window.__TAURI_IPC__ !== undefined
        )
    }

    public async getReplaysList() {
        if (this.isTauri()) {
            const dirExists = await exists(ReplayLogService.REPLAYS_DIR, { baseDir: BaseDirectory.AppConfig })
            if (!dirExists) {
                await create(ReplayLogService.REPLAYS_DIR, { baseDir: BaseDirectory.AppConfig })
            }
            const entries = await readDir(ReplayLogService.REPLAYS_DIR, { baseDir: BaseDirectory.AppData });

            return entries.map(entry => entry.name).filter(booleanGuard);
        }
        return ['testReplay', 'testReplay2'];
    }

    public async readReplay(replay: string):Promise<ClientMessage[]> {
        if (this.isTauri()) {
            const contentRaw = await readTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replay}`, { baseDir: BaseDirectory.AppConfig });
            const replayContent = JSON.parse(contentRaw) as ClientMessage[];
            return replayContent;
        }
        return new Promise((resolve) => resolve((replay === 'testReplay' ? testReplay : testReplay2) as ClientMessage[]));
    }

    private async createReplayFileIfNotExists(replayName: string, replayContents: string[]) {
        const deckFileExists = await exists(`${ReplayLogService.REPLAYS_DIR}\\${replayName}.log`, { baseDir: BaseDirectory.AppConfig });
        if (!deckFileExists) {
            await this.saveReplay(replayName, replayContents);
        }
    }

    public async saveReplay(replayName: string, replayContents: string[]) {
        if (this.isTauri()) {
            await writeTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replayName}.log`, "[\n" + replayContents.join(",\n") + "\n]", { baseDir: BaseDirectory.AppConfig })
        }
    }
}