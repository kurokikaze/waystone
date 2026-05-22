import { BaseDirectory, create, exists, writeTextFile } from "@tauri-apps/plugin-fs"
import { isTauri } from "@tauri-apps/api/core"
import * as fs from 'fs'
import * as path from 'path'

export class ErrorDumpService {
    static DEBUG_DIR = 'debugDumps'
    static STATE_DIR = 'stateDumps'

    private static isTauriEnv() {
        try {
            return isTauri()
        } catch (_e) {
            return false
        }
    }

    private static isNodeEnv() {
        return (typeof process !== 'undefined' && !!process.versions && !!process.versions.node)
    }

    private static shortHash(input: string) {
        let h = 2166136261 >>> 0
        for (let i = 0; i < input.length; i++) {
            h ^= input.charCodeAt(i)
            h = Math.imul(h, 16777619) >>> 0
        }
        return (h >>> 0).toString(16).padStart(8, '0')
    }

    private static safeStringify(obj: any) {
        const seen = new WeakSet()
        try {
            return JSON.stringify(obj, function (_key, value) {
                if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`
                if (value instanceof Error) return { message: value.message, stack: value.stack, name: value.name }
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) return '[Circular]'
                    seen.add(value)
                }
                return value
            }, 2)
        } catch (_e) {
            try {
                return String(obj)
            } catch (__e) {
                return '<<unserializable>>'
            }
        }
    }

    public static async dumpActionFailure(action: any, stateBefore: any, error: any, context: any = {}) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const errorMsg = (error && (error.message || error.toString())) || 'unknown'
        const hash = this.shortHash(errorMsg + (action?.type || '') + this.safeStringify(context || {})).slice(0, 10)
        const filename = `${timestamp}_${hash}.json`
        const payload = {
            timestamp: new Date().toISOString(),
            action,
            stateBefore,
            error: {
                message: error?.message || String(error),
                stack: error?.stack || null,
                name: error?.name || null,
            },
            context,
        }

        try {
            const contentStr = this.safeStringify(payload)

            if (this.isNodeEnv()) {
                const dumpsDir = path.resolve(process.cwd(), ErrorDumpService.DEBUG_DIR)
                try {
                    fs.mkdirSync(dumpsDir, { recursive: true })
                } catch (_mkdirErr) {
                    // ignore mkdir errors
                }
                const filePath = path.join(dumpsDir, filename)
                fs.writeFileSync(filePath, contentStr, 'utf8')
                return filename
            }

            if (this.isTauriEnv()) {
                const dirExists = await exists(ErrorDumpService.DEBUG_DIR, { baseDir: BaseDirectory.AppConfig })
                if (!dirExists) {
                    await create(ErrorDumpService.DEBUG_DIR, { baseDir: BaseDirectory.AppConfig })
                }
                await writeTextFile(`${ErrorDumpService.DEBUG_DIR}\\${filename}`, contentStr, { baseDir: BaseDirectory.AppConfig })
            } else {
                // Fallback: write to console when not running in Tauri/Node
                try {
                    console.error('ErrorDumpService dump (fallback):', filename, payload)
                } catch (_c) {
                    // ignore
                }
            }
        } catch (e) {
            try {
                console.error('Failed writing error dump', e)
            } catch (_e) {
                // ignore
            }
        }

        return filename
    }

    public static async dumpGameState(state: any, context: any = {}) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const stateSummary = (typeof state === 'string') ? state : this.safeStringify(state)
        const hash = this.shortHash((context && JSON.stringify(context)) + stateSummary).slice(0, 10)
        const filename = `${timestamp}_state_${hash}.json`
        const payload = {
            timestamp: new Date().toISOString(),
            state,
            context,
        }

        try {
            const contentStr = this.safeStringify(payload)

            if (this.isNodeEnv()) {
                const dumpsDir = path.resolve(process.cwd(), ErrorDumpService.STATE_DIR)
                try {
                    fs.mkdirSync(dumpsDir, { recursive: true })
                } catch (_mkdirErr) {
                    // ignore mkdir errors
                }
                const filePath = path.join(dumpsDir, filename)
                fs.writeFileSync(filePath, contentStr, 'utf8')
                return filename
            }

            if (this.isTauriEnv()) {
                const dirExists = await exists(ErrorDumpService.STATE_DIR, { baseDir: BaseDirectory.AppConfig })
                if (!dirExists) {
                    await create(ErrorDumpService.STATE_DIR, { baseDir: BaseDirectory.AppConfig })
                }
                await writeTextFile(`${ErrorDumpService.STATE_DIR}\\${filename}`, contentStr, { baseDir: BaseDirectory.AppConfig })
            } else {
                try {
                    console.error('ErrorDumpService state dump (fallback):', filename)
                } catch (_c) {
                    // ignore
                }
            }
        } catch (e) {
            try {
                console.error('Failed writing state dump', e)
            } catch (_e) {
                // ignore
            }
        }

        return filename
    }
}
