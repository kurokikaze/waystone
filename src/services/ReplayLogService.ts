import { BaseDirectory, mkdir, readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import { isTauri } from "@tauri-apps/api/core";
import { ClientMessage } from "../clientProtocol";
import testReplay from './testReplay.json';
import testReplay2 from './testReplay2.json';

export class ReplayLogService {
    static REPLAYS_DIR = 'replays'

    private isTauri() {
        return isTauri()
    }

    public async getReplaysList() {
        if (this.isTauri()) {
            await this.ensureDirectory();
            const entries = await readDir(ReplayLogService.REPLAYS_DIR, { baseDir: BaseDirectory.AppConfig });

            return entries.filter(entry => entry.isFile && entry.name.endsWith('.log')).map(entry => entry.name).sort();
        }
        return ['testReplay', 'testReplay2'];
    }

    public async readReplay(replay: string):Promise<ClientMessage[]> {
        if (this.isTauri()) {
            const contentRaw = await readTextFile(`${ReplayLogService.REPLAYS_DIR}/${replay}`, { baseDir: BaseDirectory.AppConfig });
            const replayContent = JSON.parse(contentRaw) as ClientMessage[];
            if (!Array.isArray(replayContent) || !replayContent.some(entry => entry && typeof entry === 'object' && 'state' in entry)) {
                throw new Error('Replay does not contain an initial game state');
            }
            return replayContent;
        }
        return (replay === 'testReplay' ? testReplay : testReplay2) as ClientMessage[];
    }

    private async ensureDirectory() {
        await mkdir(ReplayLogService.REPLAYS_DIR, { baseDir: BaseDirectory.AppConfig, recursive: true });
    }

    public async saveReplay(replayName: string, replayContents: string[]) {
        if (this.isTauri()) {
            await this.ensureDirectory();
            await writeTextFile(`${ReplayLogService.REPLAYS_DIR}/${replayName}.log`, "[\n" + replayContents.join(",\n") + "\n]", { baseDir: BaseDirectory.AppConfig })
        }
    }
}
