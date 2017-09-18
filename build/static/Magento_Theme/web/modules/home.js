require([
  'vue',
  'homeApp',
  'modernizr.min'
], function (Vue, homeApp) {
  /* eslint no-new: "off" */
  Vue.config.productionTip = false
  new Vue({
    el: '#app',
    template: '<homeApp/>',
    components: {
      homeApp
    }
  })
})
