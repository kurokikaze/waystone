jest.mock('@tauri-apps/api/core', () => ({ isTauri: jest.fn() }));
jest.mock('@tauri-apps/plugin-fs', () => ({
    BaseDirectory: { AppConfig: 1 }, exists: jest.fn(), mkdir: jest.fn(),
    readTextFile: jest.fn(), writeTextFile: jest.fn(),
}));

describe('External Everflame configuration', () => {
    let config: typeof import('../../config/everflame');
    let fs: jest.Mocked<typeof import('@tauri-apps/plugin-fs')>;
    let fetchMock: jest.Mock;
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        jest.resetModules();
        jest.mocked(require('@tauri-apps/api/core').isTauri).mockReturnValue(true);
        fs = require('@tauri-apps/plugin-fs');
        config = require('../../config/everflame');
        fetchMock = jest.fn();
        globalThis.fetch = fetchMock;
    });
    afterAll(() => { globalThis.fetch = originalFetch; });

    it('creates the file on first desktop launch and shares concurrent initialization', async () => {
        fs.exists.mockResolvedValue(false);
        await Promise.all([config.loadEverflameConfig(), config.loadEverflameConfig()]);
        expect(fs.mkdir).toHaveBeenCalledWith('.', { baseDir: fs.BaseDirectory.AppConfig, recursive: true });
        expect(fs.writeTextFile).toHaveBeenCalledTimes(1);
        const [name, raw, options] = fs.writeTextFile.mock.calls[0];
        expect(name).toBe('everflame.json');
        expect(options).toEqual({ baseDir: fs.BaseDirectory.AppConfig });
        expect(config.getEverflameUrl('game')).toBe(`${JSON.parse(raw).serverUrl.replace(/\/+$/, '').replace(/:80$/, '')}/game`);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('uses an edited file for both sockets and HTTP requests without overwriting it', async () => {
        fs.exists.mockResolvedValue(true);
        fs.readTextFile.mockResolvedValue('{"serverUrl":"http://localhost:4321/base/"}');
        await config.loadEverflameConfig();
        expect(config.getEverflameUrl('game')).toBe('http://localhost:4321/base/game');
        expect(config.getEverflameUrl('/challenge')).toBe('http://localhost:4321/base/challenge');
        expect(config.getEverflameUrl('challenge/list')).toBe('http://localhost:4321/base/challenge/list');
        expect(fs.writeTextFile).not.toHaveBeenCalled();
    });

    it.each(['invalid JSON', '{}', '{"serverUrl":42}', '{"serverUrl":"ftp://localhost"}', '{"serverUrl":"http://localhost?query=1"}'])('reports invalid configuration without replacing it: %s', async raw => {
        fs.exists.mockResolvedValue(true);
        fs.readTextFile.mockResolvedValue(raw);
        await expect(config.loadEverflameConfig()).rejects.toThrow();
        expect(fs.writeTextFile).not.toHaveBeenCalled();
    });

    it('propagates file access failures and permits a later retry', async () => {
        fs.exists.mockRejectedValueOnce(new Error('Access denied'));
        await expect(config.loadEverflameConfig()).rejects.toThrow('Access denied');
        fs.exists.mockResolvedValue(true);
        fs.readTextFile.mockResolvedValue('{"serverUrl":"https://example.test"}');
        await config.loadEverflameConfig();
        expect(config.getEverflameUrl('game')).toBe('https://example.test/game');
    });

    it('loads the deployed JSON file in the browser without a cached response', async () => {
        jest.mocked(require('@tauri-apps/api/core').isTauri).mockReturnValue(false);
        fetchMock.mockResolvedValue({ ok: true, text: async () => '{"serverUrl":"https://games.example.test/"}' });
        await config.loadEverflameConfig();
        expect(fetchMock).toHaveBeenCalledWith('/everflame.json', { cache: 'no-store' });
        expect(config.getEverflameUrl('challenge')).toBe('https://games.example.test/challenge');
        expect(fs.exists).not.toHaveBeenCalled();
    });

    it('reports a missing deployed configuration', async () => {
        jest.mocked(require('@tauri-apps/api/core').isTauri).mockReturnValue(false);
        fetchMock.mockResolvedValue({ ok: false, status: 404 });
        await expect(config.loadEverflameConfig()).rejects.toThrow('HTTP 404');
    });
});
