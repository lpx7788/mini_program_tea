const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';

// pages/break/break.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      },
    ],
    invite_member_list: [],
    filter_invite_member_list: []
  },
  goto: function (e) {
    util.goto(e);
  },
  bindCollapse: function (e) {
    let idx = e.currentTarget.dataset.idx, // 获取当前下标
      key = "filter_invite_member_list[" + idx + "].flag",
      val = this.data.filter_invite_member_list[idx].flag;
    this.setData({
      [key]: !val
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.id);
  },

  fliterList(list) {

    let c_list = [];

    for (let i in list) {
      let item = list[i],
        list_one = item.invite_one,
        list_two = item.invite_tow;

      delete item.invite_one;
      delete item.invite_tow;

      if (Object.prototype.toString.call(list_one) == '[object Array]') {
        for (let ii in list_one) {
          list_one[ii].is_one = true;
          list_one[ii].flag = false;
        }
      } else {
        list_one = [];
      }

      if (Object.prototype.toString.call(list_two) == '[object Array]') {
        for (let iii in list_two) {
          list_two[iii].is_one = true;
          list_two[iii].is_two = true;
          list_two[iii].flag = false;
        }
      } else {
        list_two = [];
      }

      item.flag = false;

      c_list = c_list.concat([item, ...list_one, ...list_two]);
    }

    return c_list;

  },

  getList(id) {
    let self = this;

    common.post(api.invite_url, {
      goods_id: id,
      formdata: true
    }, res => {
      if (200 == res.code) {

        self.setData({
          filter_invite_member_list: res.datas.invite_member_list
        })

      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
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
})