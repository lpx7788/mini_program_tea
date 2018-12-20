// pages/index/shopList1.js
import common from '../../utils/common.js';
const shopping_url = '/index.php?act=index',
  app = getApp(),
  http = common.https;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0, //
    isMore: true, //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(2);
  },
  getList(e) {
    let _this = this;
    common.post('/index.php?act=index&op=goods_list', {
      page: this.data.page,
      type: e,
      formdata: true
    }, res => {
      if (res.datas.length < 10) {
        _this.setData({
          isMore: false
        })
      }
      if (res.datas.length === 0) {
        return false;
      }
      _this.setData({
        list: res.datas
      })
    }, '')
  },
  linkTo(e) {
    const goods_id = e.currentTarget.dataset.goods_id;
    const key = wx.getStorageSync('keys').key;
    const inviter_id = wx.getStorageSync('inviter_id');
    wx.navigateTo({
      url: `shopping_detail?goods_id=${goods_id}&key=${key}&inviter_id=${inviter_id}`,
    })
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
    if (!this.data.isMore) {
      return false;
    }
    this.data.page++;
    this.getList(1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})