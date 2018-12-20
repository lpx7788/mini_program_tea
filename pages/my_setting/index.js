const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
let http = common.https;
// pages/user_center/user_center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jifen:'',
    obj:{},
    userInfo: {},
    hasUserInfo: false,
    datas: {},
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods_vip: [],
    isProblem: false
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //我的积分
  getJifen() {
    console.log(3333);
    const that = this;
    let obj = this.data.obj;
    obj.formdata = true;
    common.post(
      api.get_integral_url,
      obj,
      res => {
        if (res.code == 200) {
          console.log(res.datas);
          that.setData({
            jifen: res.datas.integral,
          })
        }
      }, '')

  },
  getMoney() {
    // 体现余额
    let self = this;
    common.post(api.money_url, {
      formdata: true
    }, res => {
      // 停止下拉刷新
      wx.stopPullDownRefresh();
      if (200 == res.code) {
        let data = res.datas;
        data = Object.assign(self.data.datas, data)
        self.setData({
          datas: data
        })
      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },
  gotoOrder(){
    // const webViewUrl = `${http}/wap/tmpl/member/order_list.html`;
    const key = wx.getStorageSync('keys').key;

    let webViewUrl = `${http}/wap/tmpl/member/address_list.html`;
 
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
    })


    // wx.navigateTo({
    //   url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
    // })
    // wx.navigateTo({
      // url: `shopping_detail&key=${key}`,
      // url: `./pages/banner_detail/index?goods_id=${id}&key=${key}&inviter_id=${inviter_id}`,
    // })
  },
  gotoShop: function(e) {
    // let state = e.currentTarget.dataset.type;
    // if (this.data.datas.level === '1') {
    //   return wx.showModal({
    //     title: '请先升级会员再入驻',
    //     content: 'Upgrade your membership before en-tering',
    //     showCancel: false,
    //     confirmText: '立即升级',
    //     confirmColor: '#1E1A19;'
    //   })
    // }
    // if (state == '1') {
      wx.navigateTo({
        url: '../rate/rate1',
      })
    // } else if (state == '2') {
    //   wx.showModal({
    //     title: '请先开通会员',
    //     content: 'Open the membership first',
    //     showCancel: false,
    //     confirmText: '立即开通',
    //     confirmColor: '#1E1A19;'
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goto: function(e) {
    // 跳转
    if (!e.currentTarget.dataset.url) return;
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  getWXPayInfo: function(order_sn) {
    let self = this;
    common.post(api.get_pay_info_url, {
      pay_sn: order_sn,
      formdata: true
    }, res => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function(res) {
          console.log('支付成功', res);

          // 跳转到个人中心
          wx.switchTab({
            url: '/pages/user_center/user_center',
            success: function(e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onShow();
            }
          })

        },
        'fail': function(res) {}
      })
    }, '')
  },
  createOrder: function(e) {
    let self = this,
      id = e.currentTarget.dataset.id;
    let txt = id === '23' ? '是否支付年费加入PARTY趴？' : '是否支付年费入驻商城？'
    wx.showModal({
      title: txt,
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#ddd',
      confirmText: '确认',
      confirmColor: '#1E1A19;',
      success: function(res) {
        if (res.confirm) {
          // common.conversion(id, wx.getStorageSync('local_invite_id'))
          common.conversion(id, wx.getStorageSync('inviter_id'))

          // 浏览接口
          common.browe(id);

          common.post(api.create_order_url, {
            goods_id: id,
            formdata: true
          }, res => {
            if (200 == res.code) {
              if (res.datas.not === '同一会员只能购买一次') {
                return wx.showModal({
                  title: '提示信息',
                  content: res.datas.not,
                  showCancel: false
                })
              }
              let order_sn = res.datas.order_sn; // 订单id
              self.getWXPayInfo(order_sn);
            } else {
              wx.showToast({
                title: '服务器错误',
                icon: 'none'
              })
            }
          }, '')

        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getList() {
    let self = this;
    common.post(api.goods_list_url, {
      formdata: true
    }, res => {
      // 停止下拉刷新
      wx.stopPullDownRefresh();
      if (200 == res.code) {
        self.setData({
          datas: res.datas
        })
        self.getMoney();
      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },
  getPoster() {
    // 首页海报
    // let self = this;
    // common.post(api.poster_url, {
    //   formdata: true,
    //   type: 1
    // }, res => {
    //   console.log('----进入getPoster-----');
    //   console.log(res)
    //   if (200 == res.code) {
    //     let data = res.datas,
    //       datas = Object.assign(self.data.datas, data);

    //     self.setData({
    //       datas: datas
    //     })

    //   } else {
    //     wx.showToast({
    //       title: '服务器错误',
    //       icon: 'none'
    //     })
    //   }
    // }, '')
  },
  onLoad: function(options) {
    this.getJifen();

  },
  gotoCircle(e) {
    let webViewUrl;
    const key = wx.getStorageSync('keys').key;
    let destinationName = e.currentTarget.dataset.name;
    if (key) {
      setHref(key)
    } else {
      common.getUserInfo(key => {
        setHref(key)
      })
    }

    function setHref(key) {
      if (e.currentTarget.dataset.type == 'shop') {
        webViewUrl = `${http}/wap/tmpl/shopping_list.html`
        wx.navigateTo({
          url: `../web_view/web_view?webViewUrl=${webViewUrl}&destinationName=${destinationName}&key=${key}`,
        })
      } else {
        webViewUrl = `${http}/wap/tmpl/cart_list.html`;
        wx.navigateTo({
          url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    this.getList();
    this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName'),
    })
    common.get(api.get_user_answer, {
      key: this.data.key
    }, res => {
      _this.setData({
        state: res.datas.stauts
      })
    }, '');
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
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShareAppMessage(e) {
    var that = this;
    var inviter_id = wx.getStorageSync('inviter_id_1');
    var userName = wx.getStorageSync('nickName');
    return {
      title: '【' + userName + '】分享Share',
      path: '/pages/index/index?inviter_id=' + inviter_id,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
})