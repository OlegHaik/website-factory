import { renderSpintext, renderSpintextStable } from './spintext'

const tpl = "{{business_name}} is the {top|best|leading|#1} water damage restoration company in {{city}}."

console.log(
  renderSpintext(tpl, { business_name: 'Denver Water Pros', city: 'Denver' }, { seed: 'demo' }),
)

console.log(
  renderSpintextStable(tpl, { business_name: 'Denver Water Pros', city: 'Denver' }, 'denver:hero_h1'),
)
