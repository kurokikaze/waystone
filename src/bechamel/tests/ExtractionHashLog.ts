import * as fs from 'node:fs';
import * as path from 'node:path';

// Buffer writes without retaining the entire search trace in memory. Flush on
// close as well, so failed/iteration-limited runs still leave a useful prefix.
export class ExtractionHashLog {
    private buffer = '';
    private descriptor: number | undefined;

    constructor(filename: string) {
        fs.mkdirSync(path.dirname(filename), { recursive: true });
        this.descriptor = fs.openSync(filename, 'w');
    }

    public write(stateHash: string, actionsHash: string): void {
        if (this.descriptor === undefined) throw new Error('Extraction hash log is closed');
        this.buffer += `${stateHash} : ${actionsHash}\n`;
        if (this.buffer.length >= 64 * 1024) this.flush();
    }

    private flush(): void {
        if (this.buffer && this.descriptor !== undefined) {
            fs.writeFileSync(this.descriptor, this.buffer, { encoding: 'utf8' });
            this.buffer = '';
        }
    }

    public close(): void {
        if (this.descriptor === undefined) return;
        try {
            this.flush();
        } finally {
            fs.closeSync(this.descriptor);
            this.descriptor = undefined;
        }
    }
}