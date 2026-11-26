import { serverUrl as defaultServerUrl } from '../../public/everflame.json';
import { isTauri } from '@tauri-apps/api/core';
import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

let serverUrl = defaultServerUrl;
let loading: Promise<void> | undefined;

function parseConfig(raw: string): string {
    const config: unknown = JSON.parse(raw);
    if (!config || typeof config !== 'object' || !('serverUrl' in config) || typeof config.serverUrl !== 'string') {
        throw new Error('everflame.json must contain a serverUrl string');
    }
    const url = new URL(config.serverUrl.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash) {
        throw new Error('serverUrl must be an HTTP(S) base address without a query or fragment');
    }
    return url.href.replace(/\/+$/, '');
}

async function readConfig(): Promise<void> {
    if (isTauri()) {
        const options = { baseDir: BaseDirectory.AppConfig };
        if (await exists('everflame.json', options)) {
            serverUrl = parseConfig(await readTextFile('everflame.json', options));
        } else {
            const raw = JSON.stringify({ serverUrl: defaultServerUrl }, null, 2) + '\n';
            await mkdir('.', { ...options, recursive: true });
            await writeTextFile('everflame.json', raw, options);
            serverUrl = parseConfig(raw);
        }
    } else {
        const response = await fetch('/everflame.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Could not read everflame.json (HTTP ${response.status})`);
        serverUrl = parseConfig(await response.text());
    }
}

/** Read once at startup, before the lobby or game sockets can connect. */
export function loadEverflameConfig(): Promise<void> {
    if (!loading) loading = readConfig().catch(error => {
        loading = undefined;
        throw error;
    });
    return loading;
}

export function getEverflameUrl(path: string): string {
    return `${serverUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
