// pages/order/order_list.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
let http = common.https;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    r: false,
    curpage: 1,
    orderList: [],
    ReachBottomBloo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = wx.getSystemInfoSync();

    if (options.type == 'v') {
      this.setData({
        height: (data.windowHeight - 80) * 2,
        type: 'v',
        isType:false
      })
      this.getOrder('v');
    } else {
      this.setData({
        height: (data.windowHeight - 80) * 2,
        type: 'r',
        isType: true
      })
      this.getOrder('r');
    }
  },
  getOrder: function(e) {
    var _this = this;
    wx.showLoading({
      title: '努力加载中。。。',
      mask: true,
    })
    if (e === 's') {
      var webViewUrl = null;
      if (this.data.isType){
        webViewUrl = `${http}/wap/tmpl/member/member_return.html`;
      }else{
        webViewUrl = `${http}/wap/tmpl/member/member_return1.html`;
      }
      let key = wx.getStorageSync('keys').key;
      wx.hideLoading();
      wx.navigateTo({
        url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
      })
    } else if (e === 'w') {
      if(this.data.isType){
        var url = '/index.php?act=member_order&op=order_list&state_type=state_new';
        var obj = {
          curpage: _this.data.curpage
        }
      }else{
        var url = '/index.php?act=member_index&op=my_order&state_type=state_new';
        var obj = {
          curpage: _this.data.curpage,
          type:'v'
        }
      }
      common.post(url, obj, res => {
        console.log(res);
        let orderList = _this.data.orderList;
        if (this.data.isType){
          orderList = orderList.concat(res.datas.order_group_list);
        }else{
          orderList = orderList.concat(res.datas);
        }
        wx.hideLoading();
        if (res.datas.length < 10) {
          wx.showToast({
            title: '没有更多订单',
            icon: 'none'
          })
          _this.setData({
            ReachBottomBloo: false
          })
        }
        _this.setData({
          orderList
        })
      }, '')
    } else {
      var url = '/index.php?act=member_index&op=my_order';
      common.post(url, {
        type: e,
        curpage: _this.data.curpage
      }, res => {
        console.log(res);
        let orderList = _this.data.orderList;
        orderList = orderList.concat(res.datas);
        wx.hideLoading();
        if (res.datas.length < 10) {
          wx.showToast({
            title: '没有更多订单',
            icon: 'none'
          })
          _this.setData({
            ReachBottomBloo: false
          })
        }
        _this.setData({
          orderList
        })
      }, '')
    }
  },
  getDetail(e) {
    let types = e.currentTarget.dataset.type;
    // if (types === 's') {
    //   let webViewUrl = `${http}/wap/tmpl/member/member_return_ship.html`;
    //   let key = wx.getStorageSync('keys').key;
    //   wx.navigateTo({
    //     url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}&refund_id=${e.currentTarget.dataset.id}`,
    //   })
    // } else {
    // e.currentTarget.dataset.pay_sn && 
    // 设置pay_sn
    wx.setStorageSync('pay_sn', e.currentTarget.dataset.pay_sn);
    wx.navigateTo({
      url: 'order_detail?id=' + e.currentTarget.dataset.id + '&type=' + types,
    })
    // }
  },
  getType(e) {
    this.setData({
      curpage: 1,
      ReachBottomBloo: true,
      orderList: [],
      type: e.currentTarget.dataset.type
    })
    // e.currentTarget.dataset.type == 'r' ? this.getOrder('r') : this.getOrder('v');
    this.getOrder(e.currentTarget.dataset.type)
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
    var data = wx.getSystemInfoSync();
    if (wx.getStorageSync('need')) {
      this.setData({
        height: (data.windowHeight - 80) * 2,
        type: 'w',
        curpage: 1,
        ReachBottomBloo: true,
        orderList: [],
      })
      wx.setStorageSync('need', false);
      return this.getOrder('w');
    }
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
    if (!this.data.ReachBottomBloo) return false
    this.setData({
      curpage: ++this.data.curpage
    })
    var pro_type = this.data.pro_type;
    this.getOrder(pro_type);
  },
  loadMore: function() {
    if (!this.data.ReachBottomBloo) return false
    this.setData({
      curpage: ++this.data.curpage
    })
    var pro_type = this.data.pro_type;
    this.getOrder(pro_type);
  }
})