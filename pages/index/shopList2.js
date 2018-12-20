// pages/index/shopList2.js
import common from '../../utils/common.js';
const shopping_url = '/index.php?act=index',
  app = getApp(),
  http = common.https;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //
    leftH: 0,
    rightH: 0,
    goods_list1: [],
    goods_list2: [],
    isMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(1);
  },
  getList(e) {
    let _this = this;
    common.post('/index.php?act=index&op=goods_list', {
      page: this.data.page,
      type: e
    }, res => {
      if (res.datas.length < 10) {
        _this.setData({
          isMore: false
        })
      }
      if (res.datas.length === 0) {
        return false;
      }
      const newArr = _this.setHight(_this.data.goods_list1, _this.data.goods_list2, res.datas.my_goods);
      _this.setData({
        goods_list: newArr
      })
    }, '')
  },
  setHight(arr1, arr2, list) {
    // height = null, width = null,
    let newHeight = null,
      rh = this.data.rightH,
      lh = this.data.leftH,
      arr = [];
    console.log(rh, lh)
    let p = list.forEach((item, index) => {
      newHeight = item.info[1] * 330 / item.info[0];
      if (lh <= rh) {
        lh += (newHeight + 158);
        item.index = index;
        arr1.push(item);
      } else {
        rh += (newHeight + 158);
        item.index = index;
        arr2.push(item);
      }
    })
    this.data.rightH = rh;
    this.data.leftH = lh;
    arr.push({
      arr1
    }, {
      arr2
    })
    return arr;
  },
  Jump(e){
    let goods_id = e.currentTarget.dataset.goods_id,
      inviter_id = wx.getStorageSync('inviter_id'),key = wx.getStorageSync("keys").key;
    wx.navigateTo({
      url: `shopping_detail?goods_id=${goods_id}&key=${key}&inviter_id=${inviter_id}`
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