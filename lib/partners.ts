/**
 * Known-partner registry. Maps a skill/pack `author` to an official brand so
 * the UI can show that company's logo as a trust signal ("skills authored by
 * <company>"). Brand marks live in `partner-logos.ts` (simple-icons, CC0).
 *
 * Only well-known organizations whose skills we host belong here — matched on
 * the exact `author` string used in the catalog. Adding a new partner is just
 * a new entry (and, if needed, a mark in partner-logos.ts).
 */
import { BRAND_MARKS, type BrandMark } from './partner-logos'

export interface Partner {
  /** Display name (usually identical to the catalog author). */
  label: string
  /** Brand mark key in BRAND_MARKS. */
  logo: string
  /** Official site / org URL the logo links to. */
  url: string
  /** Brand accent color — drives the glow/rings/label in branded pack art. */
  color: string
  /** Dark brand tint for the top of the radial backdrop in branded art. */
  tint: string
  /**
   * Fill used to render the brand mark itself. The official brand hex where it
   * reads on the near-black UI; monochrome-dark brands (Vercel, OpenAI, …) and
   * very dark hexes fall back to white. Microsoft ignores this (rendered in its
   * four real tile colors). Keeps logos full-color and on-brand, not grayscale.
   */
  logoColor: string
}

/** Keyed by the exact catalog `author` string. */
const PARTNERS: Record<string, Partner> = {
  Anthropic: { label: 'Anthropic', logo: 'anthropic', url: 'https://github.com/anthropics/skills', color: '#d97757', tint: '#2a1712', logoColor: '#d97757' },
  'Hugging Face': { label: 'Hugging Face', logo: 'huggingface', url: 'https://github.com/huggingface/skills', color: '#ffd21e', tint: '#241f08', logoColor: '#ffd21e' },
  Google: { label: 'Google', logo: 'google', url: 'https://github.com/googleworkspace/cli', color: '#4285f4', tint: '#0d1b33', logoColor: '#4285f4' },
  Vercel: { label: 'Vercel', logo: 'vercel', url: 'https://github.com/vercel-labs/agent-skills', color: '#f5f7f5', tint: '#16181c', logoColor: '#ffffff' },
  Microsoft: { label: 'Microsoft', logo: 'microsoft', url: 'https://github.com/microsoft/skills', color: '#00a4ef', tint: '#0c1626', logoColor: '#ffffff' },
  WordPress: { label: 'WordPress', logo: 'wordpress', url: 'https://github.com/WordPress/agent-skills', color: '#2ea8e0', tint: '#0b1f2a', logoColor: '#3499cd' },
  Meta: { label: 'Meta', logo: 'meta', url: 'https://github.com/facebookresearch', color: '#0866ff', tint: '#0a1530', logoColor: '#0866ff' },
  OpenAI: { label: 'OpenAI', logo: 'openai', url: 'https://github.com/openai/skills', color: '#10a37f', tint: '#0a201a', logoColor: '#ffffff' },
  Stripe: { label: 'Stripe', logo: 'stripe', url: 'https://github.com/stripe/ai', color: '#635bff', tint: '#15132e', logoColor: '#635bff' },
  Supabase: { label: 'Supabase', logo: 'supabase', url: 'https://github.com/supabase/agent-skills', color: '#3ecf8e', tint: '#0c2018', logoColor: '#3fcf8e' },
  Sentry: { label: 'Sentry', logo: 'sentry', url: 'https://github.com/getsentry/sentry-for-ai', color: '#7b51f8', tint: '#1c1230', logoColor: '#8c5cf6' },
  MongoDB: { label: 'MongoDB', logo: 'mongodb', url: 'https://github.com/mongodb/agent-skills', color: '#47a248', tint: '#0e1f0d', logoColor: '#47a248' },
  HashiCorp: { label: 'HashiCorp', logo: 'hashicorp', url: 'https://github.com/hashicorp/agent-skills', color: '#7b42bc', tint: '#1a1026', logoColor: '#ffffff' },
  Render: { label: 'Render', logo: 'render', url: 'https://github.com/render-oss/skills', color: '#46e3b7', tint: '#0a201b', logoColor: '#46e3b7' },
  Expo: { label: 'Expo', logo: 'expo', url: 'https://github.com/expo/skills', color: '#6f7bff', tint: '#13132e', logoColor: '#ffffff' },
  Flutter: { label: 'Flutter', logo: 'flutter', url: 'https://github.com/flutter/skills', color: '#54c5f8', tint: '#0a2233', logoColor: '#54c5f8' },
  Dart: { label: 'Dart', logo: 'dart', url: 'https://github.com/dart-lang/skills', color: '#3ba9e0', tint: '#08243a', logoColor: '#40c4ff' },
  Cesium: { label: 'Cesium', logo: 'cesium', url: 'https://github.com/CesiumGS/cesiumjs-skills', color: '#48b0cc', tint: '#0c2027', logoColor: '#6caddf' },
  Medusa: { label: 'Medusa', logo: 'medusa', url: 'https://github.com/medusajs/medusa-agent-skills', color: '#9d7bff', tint: '#15122b', logoColor: '#ffffff' },
  Apify: { label: 'Apify', logo: 'apify', url: 'https://github.com/apify/agent-skills', color: '#13b46a', tint: '#0a2014', logoColor: '#ff9012' },
  // NOTE: HYROX is NOT a partner (it didn't author these skills). HYROX content
  // is licensed-affiliate methodology — see lib/methodology.ts, matched on the
  // `hyrox` tag, which leads the card/art with the HYROX wordmark descriptively.
  // ── Trusted-source expansion (first-party / official repos) ──
  'NVIDIA': { label: 'NVIDIA', logo: 'nvidia', url: 'https://github.com/NVIDIA/skills', color: '#76b900', tint: '#16200a', logoColor: '#76b900' },
  'Grafana Labs': { label: 'Grafana Labs', logo: 'grafana', url: 'https://github.com/grafana/skills', color: '#f46800', tint: '#241405', logoColor: '#f46800' },
  'Elastic': { label: 'Elastic', logo: 'elastic', url: 'https://github.com/elastic/agent-skills', color: '#00bfb3', tint: '#06201e', logoColor: '#00bfb3' },
  'Apple': { label: 'Apple', logo: 'apple', url: 'https://github.com/apple', color: '#f5f7f5', tint: '#16181c', logoColor: '#ffffff' },
  'Cockroach Labs': { label: 'Cockroach Labs', logo: 'cockroachlabs', url: 'https://github.com/cockroachdb/claude-plugin', color: '#6933ff', tint: '#150b2b', logoColor: '#ffffff' },
  'MotherDuck': { label: 'MotherDuck', logo: 'motherduck', url: 'https://github.com/motherduckdb/agent-skills', color: '#ffc400', tint: '#231f00', logoColor: '#ffc400' },
  'Snowflake Labs': { label: 'Snowflake Labs', logo: 'snowflake', url: 'https://github.com/Snowflake-Labs/coco-skills', color: '#29b5e8', tint: '#08222b', logoColor: '#29b5e8' },
  'Pulumi': { label: 'Pulumi', logo: 'pulumi', url: 'https://github.com/pulumi/agent-skills', color: '#8a3391', tint: '#1a0f1c', logoColor: '#f7bf2a' },
  'dbt Labs': { label: 'dbt Labs', logo: 'dbt', url: 'https://github.com/dbt-labs/dbt-agent-skills', color: '#ff694b', tint: '#24100c', logoColor: '#ff694b' },
  'Databricks': { label: 'Databricks', logo: 'databricks', url: 'https://github.com/databricks/databricks-agent-skills', color: '#ff3621', tint: '#240a07', logoColor: '#ff3621' },
  'Cloudflare': { label: 'Cloudflare', logo: 'cloudflare', url: 'https://github.com/cloudflare/skills', color: '#f38020', tint: '#241405', logoColor: '#f38020' },
  'Redis': { label: 'Redis', logo: 'redis', url: 'https://github.com/redis/agent-skills', color: '#ff4438', tint: '#240a08', logoColor: '#ff4438' },
  'Pinecone': { label: 'Pinecone', logo: 'pinecone', url: 'https://github.com/pinecone-io/skills', color: '#3d63dd', tint: '#0d1326', logoColor: '#ffffff' },
  'Qdrant': { label: 'Qdrant', logo: 'qdrant', url: 'https://github.com/qdrant/skills', color: '#dc244c', tint: '#240a10', logoColor: '#ffffff' },
  'Ai2': { label: 'Ai2', logo: 'ai2', url: 'https://github.com/allenai/asta-plugins', color: '#f0529c', tint: '#2a0f1d', logoColor: '#ffffff' },
  'Confluent': { label: 'Confluent', logo: 'confluent', url: 'https://github.com/confluentinc/agent-skills', color: '#4d8bf0', tint: '#0c1326', logoColor: '#ffffff' },
  'AMD Research': { label: 'AMD Research', logo: 'amd', url: 'https://github.com/AMDResearch/intellikit', color: '#ed1c24', tint: '#240809', logoColor: '#ffffff' },
  'ClickHouse': { label: 'ClickHouse', logo: 'clickhouse', url: 'https://github.com/ClickHouse/agent-skills', color: '#faff69', tint: '#21210a', logoColor: '#faff69' },
  'Apache Doris': { label: 'Apache Doris', logo: 'apachedoris', url: 'https://github.com/apache/doris-skills', color: '#1f8fff', tint: '#0a1d2e', logoColor: '#5ab9ff' },
  // ── Project-management MCP connectors (official vendor servers; logo = "this is the vendor's own MCP") ──
  // monday.com is intentionally absent: it isn't in simple-icons, so monday-mcp carries no brand mark
  // (same treatment as the community-authored airtable-mcp / trello-mcp connectors).
  'Notion': { label: 'Notion', logo: 'notion', url: 'https://github.com/makenotion/notion-mcp-server', color: '#f5f7f5', tint: '#16181c', logoColor: '#ffffff' },
  'Atlassian': { label: 'Atlassian', logo: 'atlassian', url: 'https://github.com/atlassian/atlassian-mcp-server', color: '#0052cc', tint: '#0a1330', logoColor: '#4c9aff' },
  'Linear': { label: 'Linear', logo: 'linear', url: 'https://linear.app/docs/mcp', color: '#5e6ad2', tint: '#14152b', logoColor: '#8d94f0' },
  'Asana': { label: 'Asana', logo: 'asana', url: 'https://developers.asana.com/docs/using-asanas-mcp-server', color: '#f06a6a', tint: '#240f0f', logoColor: '#f06a6a' },
  'ClickUp': { label: 'ClickUp', logo: 'clickup', url: 'https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server-1', color: '#7b68ee', tint: '#15122b', logoColor: '#7b68ee' },
}

export interface ResolvedPartner extends Partner {
  mark: BrandMark
}

/** Return partner branding for an author, or null if not a known partner. */
export function getPartner(author?: string | null): ResolvedPartner | null {
  if (!author) return null
  const p = PARTNERS[author]
  if (!p) return null
  const mark = BRAND_MARKS[p.logo]
  if (!mark) return null
  return { ...p, mark }
}

/** True when the author is a recognized partner brand. */
export function isPartner(author?: string | null): boolean {
  return getPartner(author) !== null
}

/**
 * Ordered partner list for the landing-page trust strip. Each links to that
 * partner's official pack on the catalog. Author must match a PARTNERS key.
 */
export const PARTNER_STRIP: { author: string; packSlug: string }[] = [
  // Headliners first — these fill the landing-page partner-pack showcase grid
  // (the marquee carries the full roster below).
  { author: 'Anthropic', packSlug: 'anthropic-official-skills' },
  { author: 'OpenAI', packSlug: 'openai-agent-skills' },
  { author: 'Google', packSlug: 'google-workspace-skills' },
  { author: 'Vercel', packSlug: 'vercel-agent-skills' },
  { author: 'Microsoft', packSlug: 'azure-sdk-skills-python' },
  { author: 'NVIDIA', packSlug: 'nvidia-skills' },
  { author: 'Stripe', packSlug: 'stripe-ai-skills' },
  { author: 'Cloudflare', packSlug: 'cloudflare-skills' },
  { author: 'Databricks', packSlug: 'databricks-agent-skills' },
  { author: 'Elastic', packSlug: 'elastic-agent-skills' },
  { author: 'Supabase', packSlug: 'supabase-agent-skills' },
  { author: 'Snowflake Labs', packSlug: 'snowflake-coco-skills' },
  // Long tail — appears in the scrolling marquee.
  { author: 'Grafana Labs', packSlug: 'grafana-skills' },
  { author: 'Sentry', packSlug: 'sentry-for-ai' },
  { author: 'Redis', packSlug: 'redis-agent-skills' },
  { author: 'MongoDB', packSlug: 'mongodb-agent-skills' },
  { author: 'HashiCorp', packSlug: 'hashicorp-agent-skills' },
  { author: 'Confluent', packSlug: 'confluent-agent-skills' },
  { author: 'Pulumi', packSlug: 'pulumi-agent-skills' },
  { author: 'dbt Labs', packSlug: 'dbt-agent-skills' },
  { author: 'Hugging Face', packSlug: 'hugging-face-ml-toolkit' },
  { author: 'Pinecone', packSlug: 'pinecone-skills' },
  { author: 'Qdrant', packSlug: 'qdrant-skills' },
  { author: 'MotherDuck', packSlug: 'motherduck-agent-skills' },
  { author: 'ClickHouse', packSlug: 'clickhouse-agent-skills' },
  { author: 'Cockroach Labs', packSlug: 'cockroachdb-claude-plugin' },
  { author: 'Apple', packSlug: 'apple-game-porting' },
  { author: 'Meta', packSlug: 'meta-projectaria' },
  { author: 'AMD Research', packSlug: 'amd-intellikit' },
  { author: 'Apache Doris', packSlug: 'apache-doris-skills' },
  { author: 'Ai2', packSlug: 'allenai-asta' },
  { author: 'Render', packSlug: 'render-skills' },
  { author: 'Expo', packSlug: 'expo-skills' },
  { author: 'Flutter', packSlug: 'flutter-agent-skills' },
  { author: 'Dart', packSlug: 'dart-agent-skills' },
  { author: 'Cesium', packSlug: 'cesiumjs-agent-skills' },
  { author: 'Medusa', packSlug: 'medusa-agent-skills' },
  { author: 'Apify', packSlug: 'apify-agent-skills' },
  { author: 'WordPress', packSlug: 'wordpress-agent-skills' },
]
