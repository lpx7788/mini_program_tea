// pages/login/index.js
import common from '../../utils/common.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(o) {
    console.log(getCurrentPages())
    var page = getCurrentPages(),
      options = page[page.length - 2].options,
      router = `/${page[page.length - 2].route}`;
    this.setData({
      router,
      options
    })
    // common.share(this);
  },
  getUserInof(e) {
    const that = this,
      router = that.data.router,
      options = that.data.options, isClick = this.data.isClick;
    if (isClick) {
      that.data.isClick = false
      setTimeout(() => {
        that.data.isClick = true
      }, 3000)
    }else{
      return false
    }
    let str = '';
    if (e.detail.errMsg == 'getUserInfo:ok') {
      for (let k in options) {
        str += `${k}=${options[k]}&` //拼接参数
      }
      str = (str.substring(str.length - 1) == '&') ? str.substring(0, str.length - 1) : str; //去除最后一个&符号
      common.getUserInfo(() => {
        wx.reLaunch({
          url: `${router}?${str}`
        })
      })
      app.globalData.data = e.detail;
    } else {
      wx.showModal({
        title: '提示信息',
        content: '获取用户信息失败，需要授权才能继续使用',
        showCancel: false,
        confirmText: '去授权',
        success() {
          wx.openSetting({
            success: function success(res) {
              console.log('openSetting success', res.authSetting);
            }
          });
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})