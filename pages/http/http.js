// pages/http/http.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
const app = getApp(),
  http = common.https,
  contract = '/index.php?act=member_cart&op=getContract';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    isAgree:true,
    integral_limit: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      goods_id: options.goods_id,
      num: options.num,
      type: options.type,
    })
    this.getContract();
  },
  getContract() {
    try {
      common.post(contract, {
        goods_id: this.data.goods_id,
        num: this.data.num,
        type: this.data.type,
        formdata: true
      }, (res) => {
        this.setData({
          obj: res.datas
        })
      }, "")
    } catch (err) {
      console.log(err);
    }
  },
  submit(e) {
    const isAgree = e.currentTarget.dataset.type === '1' ? false : true;
    if (isAgree) {
      if (!this.data.isAgree) {
         return wx.showToast({
          title: '未同意协议',
          icon: 'none'
        })
      }
      const key = wx.getStorageSync('keys').key;
      const webViewUrl = `${http}/wap/tmpl/order/buy_step1.html`;
      wx.navigateTo({
        url: `../web_view/web_view?webViewUrl=${webViewUrl}&goods_id=${this.data.goods_id}&buynum=${this.data.num}&key=${key}&integral_limit=${this.data.integral_limit}&type=v&buyType=${this.data.type}&a_id=${this.data.obj.contract_id}`,
      })
    } else {
      wx.showModal({
        title: '是否拒绝协议',
        content: '',
        success: (res) => {
          if (res.confirm) {
            return wx.navigateBack();
          }
        }
      })
    }
  },
  checkboxChange(val) {
    console.log(val)
    console.log(val.detail.value[0])
    this.setData({
      isAgree: val.detail.value[0] === '1'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})