import { defineTool } from '@deepseek-ai/dsh-tools'
import { list, retrieve, search } from './cli.js'

export const name = 'modern-web-guidance'
export const inject = ['tools']

const asText = {
  schema: { type: 'string' },
  render: (_args, value) => [{ type: 'text', text: value }],
}

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'modern_web_search',
    description:
      'MANDATORY first step for any HTML/CSS/client-side JS task, BEFORE writing code: modals/dialogs/popovers, ' +
      'forms and validation, dark mode, anchor positioning, container queries, view transitions, scroll-driven ' +
      'animations, accessibility, performance (LCP/INP/CLS), passkeys, dates/timezones, built-in browser AI, etc. ' +
      'Searches Google Chrome\'s curated modern-web-platform guides (offline) and returns [{id, description}]. ' +
      'Use a 2-5 word action-oriented ENGLISH query for ONE capability (e.g. "light dismiss dialog"); no framework ' +
      'or app names; split multi-feature tasks into separate searches. If results are weak, rephrase once. ' +
      'Do NOT use for backend, infra, scripts, or tooling tasks.',
    parameters: {
      query: { type: 'string', required: true, description: '2-5 word English query for a single web platform capability' },
    },
    output: asText,
    async execute(args) {
      return search(args.query)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'modern_web_retrieve',
    description:
      'Fetch full guide(s) (code patterns, gotchas, fallbacks) by id from modern_web_search results. ' +
      'Several ids may be passed comma-separated, including a broader discipline guide (html, css, forms, ' +
      'accessibility, performance, security). Apply the guide instead of legacy patterns, heavy polyfills or ' +
      'extra dependencies, then verify the implementation against it. When a guide shaped your code, end your ' +
      'reply with a short "### Modern Web Guidance" section naming the guide ids you applied and why.',
    parameters: {
      ids: { type: 'string', required: true, description: 'Guide id or comma-separated ids, e.g. "animate-to-from-top-layer,dialog"' },
    },
    output: asText,
    async execute(args) {
      return retrieve(args.ids)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'modern_web_list',
    description:
      'List ALL available Modern Web Guidance guides (ids + descriptions). Use only as a fallback when ' +
      'modern_web_search finds nothing relevant twice, or for a broad UI audit.',
    parameters: {},
    output: asText,
    async execute() {
      return list()
    },
  }))
}
