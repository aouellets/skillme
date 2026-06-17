// Ad-hoc end-to-end smoke test for the Skill Me MCP endpoint.
// Drives the real /api/mcp JSON-RPC route exactly like a claude.ai connector would.
const BASE = process.env.MCP_BASE ?? 'http://localhost:3000'
const URL = `${BASE}/api/mcp`
const TOKEN = `e2e-test-${Date.now()}`

let pass = 0
let fail = 0
const log = (ok, name, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  ok ? pass++ : fail++
}

let idc = 0
async function rpc(method, params) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Token': TOKEN },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++idc, method, params }),
  })
  return { status: res.status, body: await res.json().catch(() => null) }
}

const callTool = (name, args = {}) => rpc('tools/call', { name, arguments: args })
const textOf = (r) => r.body?.result?.content?.map((c) => c.text).join('\n') ?? ''
const isError = (r) => r.body?.result?.isError === true

// 1. initialize
{
  const r = await rpc('initialize', { protocolVersion: '2025-11-25' })
  log(r.body?.result?.serverInfo?.name === 'Skill Me', 'initialize handshake', r.body?.result?.serverInfo?.name)
}

// 2. tools/list — expect all 9 tools
const EXPECTED_TOOLS = [
  'get_active_skills', 'browse_skills', 'install_skill', 'uninstall_skill',
  'list_installed', 'rate_skill', 'browse_packs', 'install_pack', 'manage_collection',
]
{
  const r = await rpc('tools/list')
  const names = (r.body?.result?.tools ?? []).map((t) => t.name)
  const missing = EXPECTED_TOOLS.filter((t) => !names.includes(t))
  log(missing.length === 0, 'tools/list exposes all 9 tools', missing.length ? `missing: ${missing}` : `${names.length} tools`)
}

// 3. browse_skills (no filter)
let firstSkillId = null
{
  const r = await callTool('browse_skills', { limit: 5 })
  const t = textOf(r)
  const m = t.match(/skill_id:\s*(\S+)/)
  firstSkillId = m?.[1] ?? null
  log(!isError(r) && /Found \d+ skill/.test(t), 'browse_skills returns catalog', t.split('\n')[0])
}

// 4. browse_skills by category
{
  const r = await callTool('browse_skills', { category: 'coding', limit: 5 })
  log(!isError(r) && textOf(r).length > 0, 'browse_skills category=coding')
}

// 5. get_active_skills on a fresh user — should be empty + connected
{
  const r = await callTool('get_active_skills')
  const t = textOf(r)
  log(!isError(r) && /installed|browse skills/i.test(t), 'get_active_skills (fresh user)', t.slice(0, 70))
}

// 6. install_skill — the DB-backed write path
let installOk = false
{
  const r = await callTool('install_skill', { skill_id: firstSkillId ?? 'skillshelf' })
  const t = textOf(r)
  installOk = !isError(r) && /Installed/.test(t)
  log(installOk, 'install_skill writes to library', t.split('\n')[0].slice(0, 90))
}

// 7. list_installed — should reflect the install
{
  const r = await callTool('list_installed')
  const t = textOf(r)
  log(installOk ? /installed:/i.test(t) : true, 'list_installed', t.split('\n')[0].slice(0, 90))
}

// 8. get_active_skills again — content should now load
{
  const r = await callTool('get_active_skills')
  log(!isError(r), 'get_active_skills (after install)', textOf(r).slice(0, 70))
}

// 9. browse_packs + install_pack
let firstPackId = null
{
  const r = await callTool('browse_packs', { limit: 5 })
  const t = textOf(r)
  firstPackId = t.match(/pack_id:\s*(\S+)/)?.[1] ?? null
  log(!isError(r), 'browse_packs', t.split('\n')[0].slice(0, 90))
}
if (firstPackId) {
  const r = await callTool('install_pack', { pack_id: firstPackId })
  log(!isError(r), 'install_pack', textOf(r).split('\n')[0].slice(0, 90))
}

// 10. uninstall the skill we installed (cleanup)
if (firstSkillId) {
  const r = await callTool('uninstall_skill', { skill_id: firstSkillId })
  log(!isError(r), 'uninstall_skill (cleanup)', textOf(r).slice(0, 80))
}

console.log(`\n${pass} passed, ${fail} failed  (test token: ${TOKEN})`)
process.exit(fail > 0 ? 1 : 0)
