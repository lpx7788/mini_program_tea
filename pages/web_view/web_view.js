// pages/web_view/web_view.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let webViewUrl = options.webViewUrl + '?';//获取到跳转链接
    for (let key in options) {
      if (key == 'webViewUrl') continue;
      webViewUrl += `${key}=${options[key]}&`//拼接参数
    }
    webViewUrl = (webViewUrl.substring(webViewUrl.length - 1) == '&') ? webViewUrl.substring(0, webViewUrl.length - 1) : webViewUrl;//去除最后一个&符号
    webViewUrl = (webViewUrl.substring(webViewUrl.length - 1) == '?') ? webViewUrl.substring(0, webViewUrl.length - 1) : webViewUrl;//去除最后一个&符号
    console.log(webViewUrl)
    this.setData({
      webViewUrl: webViewUrl
    })
    // const scene = decodeURIComponent(options.scene)
    // app.globalData.scene = scene;
    // if (scene) common.getUserInfo();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const webViewUrl = e.webViewUrl;
    return {
      title: '',
      desc: '',
      path: `pages/index/index`
    }
  }
})