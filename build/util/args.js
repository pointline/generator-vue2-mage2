import yargs from 'yargs'
import config from '../../config'

const args = yargs.options({
  // 'watch': {
  //   alias: 'w',
  //   type: 'boolean',
  //   default: false,
  //   desc: 'theme changes'
  // },
  'theme': {
    alias: 't',
    type: 'string',
    desc: 'themes',
    choices: [...Object.keys(config.themes)]
  }
  // 'production': {
  //   alias: 'prod',
  //   type: 'boolean',
  //   default: false,
  //   desc: 'Production mode'
  // }
})
  .help()
  .argv

export default args
