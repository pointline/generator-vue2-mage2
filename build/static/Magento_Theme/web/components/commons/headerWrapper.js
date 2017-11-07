/* eslint no-undef: "off" */
/**
 * header wrapper
 */
define(function () {
  return {
    template: `
      <header>
        <h1 v-text="msg"></h1>
      </header>
    `,
    data () {
      return {
        'msg': 'header'
      }
    }
  }
})
