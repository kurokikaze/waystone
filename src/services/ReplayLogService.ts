import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs"

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

    public async saveReplay(replayName: string, replayContents: string[]) {
        if (this.isTauri()) {
            await writeTextFile(`${ReplayLogService.REPLAYS_DIR}\\${replayName}.log`, replayContents.join("\n"), { dir: BaseDirectory.AppConfig })
        }
    }
}