
const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
let page = 4;
let http = common.https;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {
      is_shop: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.isChinese("T13131", 3));
  },
  save(e) {
    const t = e.currentTarget.dataset.type,
      obj = this.data.obj,
      value = e.detail.value;
    switch (t) {
      case '1':
        obj.true_name = value;
        break;
      case '2':
        obj.phone = value;
        break;
      case '3':
        obj.email = value;
        break;
      case '4':
        obj.wx_num = value;
        break;
      case '5':
        obj.address = value;
        break;
      case '6':
        obj.message = value;
        break;
      case '7':
        obj.is_shop = value;
        break;
    }
    this.setData({
      obj: obj
    })
  },
  submit() {
    let obj = this.data.obj;
    obj.formdata = true;
    console.log(obj);

    if(this.judge()){
      common.post(
        api.partner_url,
        obj,
        res=>{
        console.log(res);
        if(res.code !== 200){
          return wx.showToast({
            title: res.datas.error,
          })
        }
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(()=>{
          wx.navigateBack({})
        },1000);
      },'')
    }
  },
  judge() {
    let obj = this.data.obj;
    if (!obj.true_name){
      return wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    }
    // if (!this.isChinese(obj.true_name, 1)) {
    //   return wx.showToast({
    //     title: '检测到您的真实姓名不是纯中文，请重新填写，方便我们用联系您',
    //     icon: 'none'
    //   })
    // }
    if (!obj.phone) {
      return wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
    if (obj.phone && obj.phone.length !== 11) {
      return wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }
    if (!obj.email){
      return wx.showToast({
        title: '请输入QQ/Email',
        icon: 'none'
      })
    }
    if (!obj.email ) {
      return wx.showToast({
        title: '请输入QQ/Email ',
        icon: 'none'
      })
    }
    if (!obj.wx_num) {
      return wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
    }

    console.log(this.data.obj.is_shop);
    if (this.data.obj.is_shop == 1 && !obj.address){
      return wx.showToast({
        title: "请输入店铺信息",
        icon: 'none'
      })
    }
    // if (obj.wx_num && this.isChinese(obj.wx_num, 3)) {
    //   return wx.showToast({
    //     title: "微信号不正确",
    //     icon: 'none'
    //   })
    // }
    // if (obj.is_shop === '1' && !obj.address){
    //   return wx.showToast({
    //     title: "店铺信息为空",
    //     icon: 'none'
    //   })
    // }
    return true;
  },
  isChinese(str, t) {
    let res = /^[a-zA-Z][_|a-zA-Z|-|]{5,19}$/;
    switch (t) {
      case 1:
        res = /[^\u4e00-\u9fa5]/g;
        break;
      case 2:
        res = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        break;
      case 3:
        res = /^[a-zA-Z][_|a-zA-Z0-9|-]{5,19}$/;
        break;
    }
    return !res.test(str);
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