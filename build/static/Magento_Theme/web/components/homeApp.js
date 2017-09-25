/* eslint no-undef: "off" */
/**
 * homeApp入口文件
 */
define([
  'headerWrapper',
  'footerWrapper',
  'mainContainer'
], function (headerWrapper, footerWrapper, mainContainer) {
  return {
    template: `
      <div class="page-container">
          <header-wrapper></header-wrapper>
          <main-container></main-container>
          <footer-wrapper></footer-wrapper>
      </div>
    `,
    data () {
      return {

      }
    },
    components: {
      headerWrapper,
      footerWrapper,
      mainContainer
    }
  }
})
