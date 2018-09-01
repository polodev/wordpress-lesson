import ba from './ba';
import bn from './bn'
import ia from './ia'
const dates = [
  ...ba,
  ...bn,
  ...ia,
]

dates.sort(function (a, b) {
  let c = new Date(a.date)
  let d = new Date(b.date)
  return c-d;
})

export default dates;
