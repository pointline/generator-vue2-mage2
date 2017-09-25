/* eslint no-undef: "off" */
/**
 * main container
 */
define(function () {
  return {
    template: `
      <div class="main-container">
        <h1 v-text="msg"></h1>
      </div>
    `,
    data () {
      return {
        'msg': 'hello peter'
      }
    }
  }
})
