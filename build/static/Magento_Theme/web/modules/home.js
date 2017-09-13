require([
  'vue',
  'homeApp',
  'modernizr.min'
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
