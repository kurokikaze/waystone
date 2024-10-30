import { BaseDirectory, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import { booleanGuard } from "../bechamel/strategies/simulationUtils";
import { ClientMessage } from "../clientProtocol";
import testReplay from './testReplay.json';
import fs from 'fs';

export class TreeGraphService {
    static REPLAYS_DIR = 'graphs'

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
            const entries = await readDir(TreeGraphService.REPLAYS_DIR, { dir: BaseDirectory.AppData, recursive: false });
            console.dir(entries);
            return entries.map(entry => entry.name).filter(booleanGuard);
        }
        return ['testReplay'];
    }

    public async readReplay(replay: string):Promise<ClientMessage[]> {
        if (this.isTauri()) {
            const contentRaw = await readTextFile(`${TreeGraphService.REPLAYS_DIR}\\${replay}`, { dir: BaseDirectory.AppConfig });
            const replayContent = JSON.parse(contentRaw) as ClientMessage[];
            return replayContent;
        }
        return new Promise((resolve) => resolve(testReplay as ClientMessage[]));
    }

    private async createReplayFileIfNotExists(replayName: string, replayContents: string[]) {
        const deckFileExists = await exists(`${TreeGraphService.REPLAYS_DIR}\\${replayName}.log`, { dir: BaseDirectory.AppConfig });
        if (!deckFileExists) {
            await this.saveTree(replayName, replayContents.join(''));
        }
    }

    public async saveTree(replayName: string, replayContents: string) {
        if (this.isTauri()) {
            await writeTextFile(`${TreeGraphService.REPLAYS_DIR}\\${replayName}.log`, "[\n" + replayContents + "\n]", { dir: BaseDirectory.AppConfig })
        } else {
            console.log(fs.realpathSync(`${TreeGraphService.REPLAYS_DIR}\\${replayName}.log`))
            fs.writeFileSync(`${TreeGraphService.REPLAYS_DIR}\\${replayName}.log`, replayContents, 'ascii');
        }
    }
}