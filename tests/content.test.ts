import { describe, expect, it } from 'vitest'
import { AGENTS, SCENARIOS, RULES, LINKS, PROFILE, VALVIX, JOURNEY, CAPABILITIES } from '../src/data'
import { HOTSPOTS, STATIONS } from '../src/room/InvestigationRoom'

describe('investigation room content', () => {
  it('has six camera stations and valid evidence hotspots', () => {
    expect(STATIONS).toHaveLength(8)
    for (const h of HOTSPOTS) { expect(h.station).toBeGreaterThanOrEqual(0); expect(h.station).toBeLessThan(STATIONS.length); expect(['aios','insiderlens','walkmate','valvix','profile','journey','capabilities']).toContain(h.caseId) }
  })
  it('keeps VALVIX founder facts', () => { expect(VALVIX.since).toBe('2025'); expect(VALVIX.apps).toBe('10+'); expect(VALVIX.stats[0].value).toBe('10+') })
  it('has eight AIOS agents and valid replays', () => { expect(AGENTS).toHaveLength(8); for (const sc of Object.values(SCENARIOS)) for (const i of sc.steps) expect(AGENTS[i]).toBeDefined() })
  it('keeps the requested journey order and end-to-end summary', () => { expect(JOURNEY.map(j=>j.title)).toEqual(['Web development','App development','Full-stack development','VALVIX','Agentic AI']); expect(JOURNEY[0].year).toBe('2023'); expect(CAPABILITIES.map(c=>c.layer)).toContain('Servers / data') })
  it('keeps verified links and identity', () => { expect(PROFILE.name).toBe('Dinesh Nalla'); expect(LINKS.aios).toContain('/AIOS'); expect(RULES.map(r=>r.id)).toEqual(['T1','E1','F1']) })
})
