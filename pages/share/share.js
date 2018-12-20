const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';

// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;

    common.post(api.code_url, {
      formdata: true,
      inviter_id: wx.getStorageSync('inviter_id_1')
    }, res => {
      if (200 == res.code) {
        self.setData({
          datas: res.datas
        })

      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')

    this.setData({
      nickName: wx.getStorageSync('nickName'),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var inviter_id = wx.getStorageSync('inviter_id_1');
    var userName = wx.getStorageSync('nickName');
    return {
      title: '【' + userName + '】分享Share',
      path: '/pages/index/index?inviter_id=' + inviter_id,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})