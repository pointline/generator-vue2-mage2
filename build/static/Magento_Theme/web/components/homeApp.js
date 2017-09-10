/* eslint no-undef: "off" */
define([], function () {
  return {
    template: `
      <div class="main-content">
          <h1 v-text="msg"></h1>
      </div>
    `,
    data () {
      return {
        msg: 'hello Peter'
      }
    }
  }
})
