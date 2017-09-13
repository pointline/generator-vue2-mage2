import yargs from 'yargs'
import config from '../../config'

const args = yargs.options({
  'theme': {
    alias: 't',
    type: 'string',
    desc: 'themes',
    choices: [...Object.keys(config.themes)],
    demandOption: true
  },
  'mode': {
    alias: 'prod',
    type: 'boolean',
    default: false,
    desc: 'Production mode'
  },
  'cache': {
    alias: 'c',
    type: 'boolean',
    default: false,
    desc: 'Cache Clean'
  },
  'prot': {
    alias: 'p',
    type: 'number',
    default: 9000,
    desc: 'Prot'
  }
})
  .help()
  .argv

export default args
