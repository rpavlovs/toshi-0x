
const ID = {
  EWA: 1,
  EWB: 2,
}

const NAME = Object.keys(ID).reduce((all, name) => {
  all[ID[name]] = name
  return all
}, {})

const ADDRESS = {
  [ID.EWA]: '0x6FC773BA50dc1dc6A4A3698251BAF3Cee1B6eb26'.toLowerCase(),
  [ID.EWB]: '0x92112771f33BE187CaF2226a041bE6F2bC2319f5'.toLowerCase(),
}


export default {
  ID,
  NAME,
  ADDRESS,
}
