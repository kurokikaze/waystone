import { BaseDirectory, exists, writeTextFile } from "@tauri-apps/api/fs"

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