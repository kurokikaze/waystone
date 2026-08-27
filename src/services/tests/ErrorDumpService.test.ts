import { ErrorDumpService } from '../ErrorDumpService'
import * as fs from 'fs'
import * as path from 'path'

describe('ErrorDumpService', () => {
  const dumpsDir = path.resolve(process.cwd(), 'debugDumps')

  beforeEach(() => {
    if (fs.existsSync(dumpsDir)) {
      try { fs.rmSync(dumpsDir, { recursive: true, force: true }) } catch (e) { /* ignore */ }
    }
  })

  afterEach(() => {
    if (fs.existsSync(dumpsDir)) {
      try { fs.rmSync(dumpsDir, { recursive: true, force: true }) } catch (e) { /* ignore */ }
    }
  })

  test('creates dump file under debugDumps and contains expected fields', async () => {
    const action = { type: 'TEST_ACTION', payload: { foo: 'bar' } }
    const stateBefore = { foo: 'state' }
    const error = new Error('test error')
    const context = { location: 'unit-test' }

    const filename = await ErrorDumpService.dumpActionFailure(action, stateBefore, error, context)
    expect(typeof filename).toBe('string')

    const filePath = path.join(dumpsDir, filename)
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(content)
    expect(parsed).toHaveProperty('timestamp')
    expect(parsed.action).toEqual(expect.objectContaining({ type: 'TEST_ACTION' }))
    expect(parsed.stateBefore).toEqual(stateBefore)
    expect(parsed.error).toHaveProperty('message', 'test error')
    expect(parsed.context).toEqual(context)
  })
})
