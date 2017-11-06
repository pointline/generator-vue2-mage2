require([
  'vue',
  'homeApp'
], function (Vue, homeApp) {
  /* eslint no-new: "off" */
  Vue.config.productionTip = false
  // 实例化vue
  new Vue({
    el: '#app',
    template: '<homeApp/>',
    components: {
      homeApp
    }
  })
})
