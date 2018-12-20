// pages/index/infoList.js
import common from '../../utils/common.js';
const 
  app = getApp(),
  http = common.https,
  page = 4;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    common.post('/index.php?act=article&op=article_list&ac_id=4',{},res=>{
      _this.setData({
        list: res.datas.article_list.map(item=>{
          let t = new Date(Number(item.article_time) * 1000),
            t1 = t.getFullYear(),
            t2 = t.getMonth() + 1,
            t3 = t.getDate();
          t2 = t2 < 10 ? '0' + t2 : t2;
          t3 = t3 < 10 ? '0' + t3 : t3;
          return Object.assign(item, {
            article_times: t1 + '-' + t2 + '-' + t3
          });
        })
      })
    },'');
  },
  linkTo(e) {
    let tyle = e.currentTarget.dataset.type,
      id = e.currentTarget.dataset.id,
      url = null;
    switch (tyle) {
      case '1':
        url = 'infoList';
        break;
      case '2':
        url = 'info_detail?id=' + id;
        break;
    }
    wx.navigateTo({
      url: url,
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

  },
  onShow: function () {
    this.onLoad()
  },
})