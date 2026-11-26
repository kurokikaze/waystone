import { isTauri } from '@tauri-apps/api/core';
import { BaseDirectory, mkdir, writeTextFile } from '@tauri-apps/plugin-fs';
import { readFileSync } from 'node:fs';
import { ErrorDumpService } from '../ErrorDumpService';

jest.mock('@tauri-apps/api/core', () => ({ isTauri: jest.fn() }));
jest.mock('@tauri-apps/plugin-fs', () => ({
    BaseDirectory: { AppConfig: 1 }, mkdir: jest.fn(), writeTextFile: jest.fn(),
}));

describe('Tauri diagnostic dumps', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.mocked(isTauri).mockReturnValue(true);
    });

    it('uses native app storage even when a Node environment is present in the test', async () => {
        const filename = await ErrorDumpService.dumpActionFailure({ type: 'replays/open' }, null, new Error('file read failed'));
        expect(mkdir).toHaveBeenCalledWith('debugDumps', { baseDir: BaseDirectory.AppConfig, recursive: true });
        expect(writeTextFile).toHaveBeenCalledWith(`debugDumps/${filename}`, expect.any(String), { baseDir: BaseDirectory.AppConfig });
        const payload = JSON.parse(jest.mocked(writeTextFile).mock.calls[0][1]);
        expect(payload.error.message).toBe('file read failed');
        expect(payload.action.type).toBe('replays/open');
    });

    it('creates the state dump directory using mkdir', async () => {
        const filename = await ErrorDumpService.dumpGameState({ prompt: true });
        expect(mkdir).toHaveBeenCalledWith('stateDumps', { baseDir: BaseDirectory.AppConfig, recursive: true });
        expect(writeTextFile).toHaveBeenCalledWith(`stateDumps/${filename}`, expect.any(String), { baseDir: BaseDirectory.AppConfig });
    });

    it('grants access to each storage directory and its files', () => {
        const capability = JSON.parse(readFileSync('src-tauri/capabilities/migrated.json', 'utf8'));
        const allow = capability.permissions.find((permission: any) => permission.identifier === 'fs:scope').allow;
        expect(capability.permissions).toContain('fs:allow-mkdir');
        for (const folder of ['replays', 'debugDumps', 'stateDumps']) {
            expect(allow).toContain(`$APPCONFIG/${folder}`);
            expect(allow).toContain(`$APPCONFIG/${folder}/*`);
        }
    });
});
