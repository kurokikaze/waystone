import { BaseDirectory, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { async } from "rxjs";
import { booleanGuard } from "../bechamel/strategies/simulationUtils";
import { ClientAction, ClientMessage } from "../clientProtocol";

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
            console.dir(entries);
            return entries.map(entry => entry.name).filter(booleanGuard);
        }
        return [];
    }

    public async readReplay(replay: string):Promise<ClientMessage[]> {
        const contentRaw = await readTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replay}`, { dir: BaseDirectory.AppConfig });
        const replayContent = JSON.parse(contentRaw) as ClientMessage[];
        return replayContent;
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