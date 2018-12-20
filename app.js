//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onShow: function (options) {
    wx.setStorageSync('isLogin', 'false')
    let arr = [1011, 1012, 1013, 1007, 1008, 1048, 1049, 1073, 1074];
    if (arr.indexOf(options.scene) !== -1){
      wx.removeStorage({
        key: 'inviter_id',
        success: function (res) {
          console.log('清除缓存邀请id')
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    // key: 'd5947fd689703a279599757e2245f2e7',
    // sell_key: '891c048da5ab360d219d7583e4aa3881',
    // key: '7c44d624b842cb4747ed8d0561170250'
  }
})