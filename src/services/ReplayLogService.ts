import { BaseDirectory, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
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
            const entries = await readDir(ReplayLogService.REPLAYS_DIR, { dir: BaseDirectory.AppData, recursive: false });

            return entries.map(entry => entry.name).filter(booleanGuard);
        }
        return ['testReplay', 'testReplay2'];
    }

    public async readReplay(replay: string):Promise<ClientMessage[]> {
        if (this.isTauri()) {
            const contentRaw = await readTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replay}`, { dir: BaseDirectory.AppConfig });
            const replayContent = JSON.parse(contentRaw) as ClientMessage[];
            return replayContent;
        }
        return new Promise((resolve) => resolve((replay === 'testReplay' ? testReplay : testReplay2) as ClientMessage[]));
    }

    private async createReplayFileIfNotExists(replayName: string, replayContents: string[]) {
        const deckFileExists = await exists(`${ReplayLogService.REPLAYS_DIR}\\${replayName}.log`, { dir: BaseDirectory.AppConfig });
        if (!deckFileExists) {
            await this.saveReplay(replayName, replayContents);
        }
    }

    public async saveReplay(replayName: string, replayContents: string[]) {
        if (this.isTauri()) {
            await writeTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replayName}.log`, "[\n" + replayContents.join(",\n") + "\n]", { dir: BaseDirectory.AppConfig })
        }
    }
}