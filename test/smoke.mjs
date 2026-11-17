// Быстрая проверка без dsh: npm install && npm test
import { list, retrieve, search } from '../lib/cli.js'

const s = JSON.parse(await search('animate a dialog modal backdrop'))
console.log('search ->', s.length, 'results, first:', s[0]?.id)
if (!Array.isArray(s) || !s.length) throw new Error('search returned nothing')

const g = await retrieve(s[0].id)
console.log('retrieve ->', g.length, 'chars')
if (g.length < 500 || /saved to .* to prevent CLI stdout truncation/.test(g)) {
  throw new Error('retrieve did not return guide text')
}

const l = await list()
console.log('list ->', l.length, 'chars')
console.log('OK')
