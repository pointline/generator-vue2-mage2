require([
  'vue',
  'homeApp'
], function (Vue, homeApp) {
  new Vue({
    el: '#app',
    template: '<homeApp/>',
    components: {
      homeApp
    }
  })
})
