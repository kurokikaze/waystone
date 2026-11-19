import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import type { State } from 'moonlands';
import { ExtractionHashLog } from './ExtractionHashLog';
import { ReconSimulationStrategy } from '../strategies/ReconSimulationStrategy';
import { DirectActionExtractor } from '../strategies/DirectActionExtractor';
import { HashBuilder } from '../strategies/HashBuilder';

jest.mock('../strategies/simulationUtils', () => ({ getStateScore: () => 0 }));

describe('Extraction hash diagnostics', () => {
    let directory: string;

    beforeEach(() => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'waystone-extraction-'));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        fs.rmSync(directory, { recursive: true, force: true });
    });

    it('writes exact ordered hash pairs and flushes the final partial buffer', () => {
        const filename = path.join(directory, 'nested', 'hashes.txt');
        const log = new ExtractionHashLog(filename);
        log.write('state-one', 'actions-one');
        log.write('state-two', 'actions-two');
        log.close();
        log.close();
        expect(fs.readFileSync(filename, 'utf8')).toBe(
            'state-one : actions-one\nstate-two : actions-two\n',
        );
    });

    it('flushes large traces in bounded chunks without truncating previous writes', () => {
        const filename = path.join(directory, 'hashes.txt');
        const log = new ExtractionHashLog(filename);
        const line = `${'s'.repeat(80)} : ${'a'.repeat(64)}\n`;
        for (let index = 0; index < 2000; index++) {
            log.write('s'.repeat(80), 'a'.repeat(64));
        }
        expect(fs.statSync(filename).size).toBeGreaterThan(64 * 1024);
        log.close();
        expect(fs.readFileSync(filename, 'utf8')).toBe(line.repeat(2000));
    });

    it('logs the existing state signature and hashes even an empty extraction', () => {
        const sink = jest.fn();
        jest.spyOn(HashBuilder.prototype, 'makeHash').mockReturnValue('search-state');
        jest.spyOn(DirectActionExtractor, 'extractActions').mockReturnValue([]);
        const state = { getZone: () => ({ cards: [] }) } as unknown as State;
        new ReconSimulationStrategy(sink).startSolving(state, 1, 2);
        expect(sink).toHaveBeenCalledTimes(1);
        expect(sink).toHaveBeenCalledWith(
            'search-state', createHash('sha256').update('[]').digest('hex'),
        );
    });
});