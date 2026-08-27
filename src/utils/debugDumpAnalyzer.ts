import { BaseDirectory, exists, readDir, readTextFile } from "@tauri-apps/plugin-fs"
import { isTauri } from "@tauri-apps/api/core"
import * as fs from 'fs'
import * as path from 'path'
import { GameState } from '../bechamel/GameState'

export async function listDumps(): Promise<string[]> {
    if (isTauri()) {
        const dirExists = await exists('debugDumps', { baseDir: BaseDirectory.AppConfig })
        if (!dirExists) return []
        const entries = await readDir('debugDumps', { baseDir: BaseDirectory.AppConfig })
        return entries.map(e => e.name).filter(Boolean)
    }

    const localDir = path.resolve(process.cwd(), 'debugDumps')
    if (!fs.existsSync(localDir)) return []
    return fs.readdirSync(localDir).filter(Boolean)
}

export async function loadDump(filename: string): Promise<any> {
    if (isTauri()) {
        const contentRaw = await readTextFile(`debugDumps\\${filename}`, { baseDir: BaseDirectory.AppConfig })
        return JSON.parse(contentRaw)
    }

    const p = path.resolve(process.cwd(), 'debugDumps', filename)
    const contentRaw = fs.readFileSync(p, 'utf8')
    return JSON.parse(contentRaw)
}

export async function replayDump(dump: any, gameState: GameState): Promise<{ success: boolean, error?: any }> {
    if (!dump) return { success: false, error: new Error('No dump provided') }
    try {
        if (!gameState) throw new Error('No GameState instance provided')
        // shallow assign state; callers may choose to deep clone if desired
        gameState.state = dump.stateBefore
        try {
            gameState.update(dump.action)
            return { success: true }
        } catch (e) {
            return { success: false, error: e }
        }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function loadAndReplay(filename: string, gameState: GameState) {
    const dump = await loadDump(filename)
    return replayDump(dump, gameState)
}
