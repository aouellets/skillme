import { test } from 'node:test'
import assert from 'node:assert/strict'
import { coarseGeo } from './geo'

test('full Vercel headers decode, round to 2dp (incl. negative), and map fields', () => {
  const headers = new Headers({
    'x-vercel-ip-country': 'US',
    'x-vercel-ip-country-region': 'CA',
    'x-vercel-ip-city': 'San%20Francisco',
    'x-vercel-ip-latitude': '37.774929',
    'x-vercel-ip-longitude': '-122.419416',
  })
  assert.deepEqual(coarseGeo(headers), {
    country: 'US',
    region: 'CA',
    city: 'San Francisco',
    lat: 37.77,
    lng: -122.42,
  })
})

test('absent coordinate headers omit lat/lng keys entirely', () => {
  const headers = new Headers({
    'x-vercel-ip-country': 'US',
  })
  const geo = coarseGeo(headers)
  assert.deepEqual(geo, { country: 'US' })
  assert.ok(!('lat' in geo))
  assert.ok(!('lng' in geo))
})

test('non-numeric latitude is dropped but numeric longitude is kept', () => {
  const headers = new Headers({
    'x-vercel-ip-latitude': 'not-a-number',
    'x-vercel-ip-longitude': '2.351',
  })
  const geo = coarseGeo(headers)
  assert.ok(!('lat' in geo))
  assert.equal(geo.lng, 2.35)
})

test('empty Headers yields an empty object', () => {
  assert.deepEqual(coarseGeo(new Headers()), {})
})
