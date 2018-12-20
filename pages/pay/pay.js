// pages/pay/pay.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
const http = common.https,
  balance = '/index.php?act=member_payment&op=pay_over',
  balance1 = '/index.php?act=member_payment&op=vr_pay_new';
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
    console.log(options);
    this.setData({
      type_a: options.type_a || 'r'
    })
    let _this = this;
    // options.type_a === 'r'&& wx.showModal({
    //   title: '温馨提示',
    //   content: '确定支付订单',
    //   success:(res)=>{
    //     res.confirm && _this.balance(options.pay_sn);
    //   }
    // })
    this.getWXPayInfo(options.pay_sn)
  },
  balance(sn) {
    let url = null;
    if (this.data.type_a === 'xuni') {
      url = balance1;
    } else {
      url = balance;
    }
    common.post(url, {
      pay_sn: sn,
      payment_code: 'predeposit'
    }, res => {
      wx.showModal({
        title: '',
        content: '支付成功!',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            const web_view = `${http}/wap/tmpl/member/order_list.html`;
            const key = wx.getStorageSync('keys').key;
            // 跳转到订单中心
            wx.redirectTo({
              url: `../web_view/web_view?webViewUrl=${web_view}&key=${key}`
            })
          }
        }
      })
    }, '')
  },
  getWXPayInfo: function(order_sn) {
    let self = this;
    var url = '';
    // if (this.data.type_a === 'xuni') {
    //   url = api.get_pay_info_url
    //   common.post(url, {
    //     pay_sn: order_sn,
    //     formdata: true
    //   }, res => {
    //     self.pay(res, 'v')
    //   }, '')
    // } else {
    url = '/index.php?act=member_payment&op=vr_wxpay'
    common.post(url, {
      pay_sn: order_sn,
      formdata: true,
      type: '1'
    }, res => {
      self.pay(res.datas, 'r')
    }, '')
    // }
  },
  pay(options, e) {
    const key = wx.getStorageSync('key');
    const that = this;
    wx.requestPayment({
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': options.package,
      'signType': options.signType,
      'paySign': options.paySign,
      success(res) {
        wx.showModal({
          title: '',
          content: '支付成功!',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              const web_view = `${http}/wap/tmpl/member/vr_order_list.html`;
              const key = wx.getStorageSync('keys').key;
              // 跳转到个人中心
              wx.navigateTo({
                url: `../web_view/web_view?webViewUrl=${web_view}&key=${key}`
              })
            }
          }
        })
      },
      fail(res) {
        console.log(res.errMsg);
        wx.showModal({
          title: '',
          content: '支付失败!',
          showCancel: false,
          success() {
            const web_view = `${http}/wap/tmpl/member/vr_order_list.html`;
            const key = wx.getStorageSync('keys').key;
            // 跳转到个人中心
            wx.navigateTo({
              url: `../web_view/web_view?webViewUrl=${web_view}&key=${key}`
            })
          }
        })
      }
    })
  },
  setUrl(options) {
    let webViewUrl;
    for (let key in options) {
      if (key == 'timeStamp' || key == 'nonceStr' || key == 'timeStamp' || key == 'package' || key == "signType" || key == 'paySign') continue;
      webViewUrl += `${key}=${options[key]}&` //拼接参数
    }
    webViewUrl = (webViewUrl.substring(webViewUrl.length - 1) == '&') ? webViewUrl.substring(0, webViewUrl.length - 1) : webViewUrl; //去除最后一个&符号
    webViewUrl = (webViewUrl.substring(webViewUrl.length - 1) == '?') ? webViewUrl.substring(0, webViewUrl.length - 1) : webViewUrl; //去除最后一个?符号
    return webViewUrl;
  },
  purchase() {
    let data = wx.getStorageSync('infoooooo');
    console.log(data)
    let webViewUrl = `${http}/wap/tmpl/order/buy_step1.html`;
    const key = wx.getStorageSync('keys').key;
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}&goods_id=${data.goods_id}&buynum=${data.num}&key=${key}&type=v&isFenQi=${data.isFenQi}`,
    })
  },
})