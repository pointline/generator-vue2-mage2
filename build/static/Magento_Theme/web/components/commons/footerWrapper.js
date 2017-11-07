/* eslint no-undef: "off" */
/**
 * footer wrapper
 */
define(function () {
  return {
    template: `
      <footer>
        <h1 v-text="msg"></h1>
      </footer>
    `,
    data () {
      return {
        'msg': 'footer'
      }
    }
  }
})
