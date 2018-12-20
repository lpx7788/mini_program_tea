// pages/feedback/feedback.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  feed(e) {
    this.setData({
      feedback: e.detail.value
    })
  },
  feedback(){
    const that = this,
      feedback = that.data.feedback;
    common.post(api.feedback_add_url, { feedback   }, (res) => {
      wx.showModal({
        title: '提示信息',
        content: '反馈成功！',
        showCancel:false,
        success(){
          wx.navigateBack({
            
          })
        }
      })
    }, "")
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