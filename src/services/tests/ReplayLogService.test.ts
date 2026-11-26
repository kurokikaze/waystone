import { isTauri } from '@tauri-apps/api/core';
import { BaseDirectory, mkdir, readDir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { ReplayLogService } from '../ReplayLogService';

jest.mock('@tauri-apps/api/core', () => ({ isTauri: jest.fn() }));
jest.mock('../testReplay.json', () => ({ __esModule: true, default: jest.requireActual('../testReplay.json') }));
jest.mock('../testReplay2.json', () => ({ __esModule: true, default: jest.requireActual('../testReplay2.json') }));
jest.mock('@tauri-apps/plugin-fs', () => ({
    BaseDirectory: { AppConfig: 1, AppData: 2 },
    mkdir: jest.fn(), readDir: jest.fn(), readTextFile: jest.fn(), writeTextFile: jest.fn(),
}));

describe('Desktop replay storage', () => {
    const service = new ReplayLogService();
    beforeEach(() => {
        jest.resetAllMocks();
        jest.mocked(isTauri).mockReturnValue(true);
        jest.mocked(readDir).mockResolvedValue([]);
    });

    it('creates an empty directory and uses the same base directory for listing, reading and saving', async () => {
        await expect(service.getReplaysList()).resolves.toEqual([]);
        expect(mkdir).toHaveBeenCalledWith('replays', { baseDir: BaseDirectory.AppConfig, recursive: true });
        expect(readDir).toHaveBeenCalledWith('replays', { baseDir: BaseDirectory.AppConfig });
        const replay = [{ for: 1, state: { step: 1 } }];
        await service.saveReplay('match', replay.map(entry => JSON.stringify(entry)));
        expect(writeTextFile).toHaveBeenCalledWith('replays/match.log', expect.any(String), { baseDir: BaseDirectory.AppConfig });
        const serialized = jest.mocked(writeTextFile).mock.calls[0][1];
        jest.mocked(readTextFile).mockResolvedValue(serialized);
        await expect(service.readReplay('match.log')).resolves.toEqual(replay);
        expect(readTextFile).toHaveBeenCalledWith('replays/match.log', { baseDir: BaseDirectory.AppConfig });
    });

    it('saves a match before the replay list has ever been opened', async () => {
        await service.saveReplay('first match', []);
        expect(mkdir).toHaveBeenCalledTimes(1);
        expect(jest.mocked(mkdir).mock.invocationCallOrder[0]).toBeLessThan(jest.mocked(writeTextFile).mock.invocationCallOrder[0]);
    });

    it('lists only replay files and sorts their names', async () => {
        jest.mocked(readDir).mockResolvedValue([
            { name: 'b.log', isFile: true, isDirectory: false, isSymlink: false },
            { name: 'a.log', isFile: true, isDirectory: false, isSymlink: false },
            { name: 'nested.log', isFile: false, isDirectory: true, isSymlink: false },
            { name: 'notes.txt', isFile: true, isDirectory: false, isSymlink: false },
        ]);
        await expect(service.getReplaysList()).resolves.toEqual(['a.log', 'b.log']);
    });

    it('propagates storage errors without overwriting an existing file at the directory path', async () => {
        jest.mocked(mkdir).mockRejectedValue(new Error('replays is a file'));
        await expect(service.getReplaysList()).rejects.toThrow('replays is a file');
        expect(readDir).not.toHaveBeenCalled();
        expect(writeTextFile).not.toHaveBeenCalled();
    });

    it.each(['not json', '{}', '[]', '[{"for":1,"action":{}}]'])('rejects an invalid replay: %s', async content => {
        jest.mocked(readTextFile).mockResolvedValue(content);
        await expect(service.readReplay('bad.log')).rejects.toThrow();
    });

    it('keeps browser sample replays independent of desktop storage', async () => {
        jest.mocked(isTauri).mockReturnValue(false);
        await expect(service.getReplaysList()).resolves.toEqual(['testReplay', 'testReplay2']);
        expect((await service.readReplay('testReplay')).some(entry => 'state' in entry)).toBe(true);
        expect(mkdir).not.toHaveBeenCalled();
        expect(readDir).not.toHaveBeenCalled();
    });
});
