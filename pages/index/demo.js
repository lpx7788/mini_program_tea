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
    let _this = this;
    let news = wx.getStorage({
      key: 'news',
      success: function(res) {
        console.log( )
        let data = JSON.parse(res.data.datas);
        _this.setData({
          title: data.article_title,
          time: _this.timestampToTime(data.article_time),
          content: data.article_content
        })
        WxParse.wxParse('img', 'html', data.article_content, _this, 5)
      },
    })
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = date.getFullYear() + '-',
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
      D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ',
      h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':',
      m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
      s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
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