// pages/question_detail/question_detail.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
const WxParse = require("../../wxParse/wxParse.js");
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
    common.post(api.question_detail_url,options,res=>{
      this.setData({
        doc_title: res.datas.doc_title,
        doc_content: WxParse.wxParse('doc_content', 'html', res.datas.doc_content, this, 5)
      })
    },"")
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