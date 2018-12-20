import util from '../../utils/util.js'
import common from '../../utils/common.js';
import api from '../../utils/api.js';
// pages/cash/cash.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    available_predeposit: 0
  },

  getMoney() {
    let self = this;
    common.post(api.money_url, { formdata: true }, res => {
      if (200 == res.code) {
        self.setData({
          available_predeposit: res.datas.available_predeposit
        })
      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },

  goto: function(e) {
    util.goto(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMoney();
  },
  money(e) {
    this.setData({
      money: e.detail.value
    })
  },
  all:function(){
    this.setData({
      money: this.data.available_predeposit
    })
  },
  forward() {
    const that = this,
      money = Number(that.data.money);
    common.post(api.apply_withdraw_url, {money}, (res) => {
        if (200 == res.code) {
          that.getMoney();
          that.setData({ money:''})
          wx.showModal({
            title: '提示信息',
            content: res.datas,
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '提示信息',
            content: res.datas,
            showCancel: false
          })
        }
    }, "")
  }
})