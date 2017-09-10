require([
  'lib/vue',
  'homeApp'
], function (Vue, homeApp) {
  /* eslint no-new: "off" */
  new Vue({
    el: '#app',
    template: '<homeApp/>',
    components: {
      homeApp
    }
  })
})
