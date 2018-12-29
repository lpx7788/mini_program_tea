// pages/index/info_detail.js
import common from '../../../utils/common.js';
import api from '../../../utils/api.js';
const url = '/index.php?act=article&op=article_show',
  app = getApp(),
  http = common.https,
  WxParse = require("../../../wxParse/wxParse.js");
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
    this.getDetail(options.id);
  },
  getDetail(id){
    let _this = this;
    common.get(url, { article_id:id},res=>{
      console.log(res);
      let t = new Date(Number(res.datas.article_time) * 1000),
        t1 = t.getFullYear(),
        t2 = t.getMonth() + 1,
        t3 = t.getDate();
      t2 = t2 < 10 ? '0' + t2 : t2;
      t3 = t3 < 10 ? '0' + t3 : t3;
      _this.setData({
        title: res.datas.article_title,
        time: t1 + '-' + t2 + '-' + t3,
        image: res.datas.image,
        videoUrl: res.datas.video_url,
        video_Url: res.datas.video_url.split("?")[0],
      })
      WxParse.wxParse('img', 'html', res.datas.article_content, _this, 15)
    },'');
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

  }
})