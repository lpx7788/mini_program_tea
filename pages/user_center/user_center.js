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
    userInfo: {},
    hasUserInfo: false,
    datas: {},
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods_vip: [],
    isProblem: false,
    jifen:'',
    obj:{},
    agent:{},
    garden:'',
    qr_code:'',
    stauts:''
  },

  //我的积分
  getJifen() {
    const that = this;
    let obj = this.data.obj;
    obj.formdata = true;
  
    common.post(
      api.get_integral_url,
      obj,
      res=>{
      if(res.code == 200){
        console.log(333);
        console.log(res.datas);

        that.setData({
          jifen: res.datas.integral,
          garden: res.datas.garden,
          qr_code: res.datas.qr_code,
          agent: res.datas.agent
          
        })
        console.log(this.data.garden);
        console.log(this.data.qr_code);
        console.log(this.data.agent);
      }
    },'')

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
    const webViewUrl = `${http}/wap/tmpl/member/vr_order_list.html`;
    const key = wx.getStorageSync('keys').key;
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
    })
  },


  goto: function(e) {
    console.log(this.data.garden)
    if (e.currentTarget.dataset.status == 1 && this.data.agent.code==400){
      return wx.showModal({
        title: '提示信息',
        content: this.data.agent.msg,
        showCancel: false
      })
       return;
    }
    if (e.currentTarget.dataset.status == 2 && this.data.garden==0) {
      return wx.showModal({
        title: '提示信息',
        content: '暂无我的产量',
        showCancel: false
      })
      return;
    }
    if (e.currentTarget.dataset.status == 3 && this.data.qr_code==0) {
      return wx.showModal({
        title: '提示信息',
        content: '请申请成为合伙人',
        showCancel: false
      })
      return;
    }
    
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
      confirmColor: '#1E1A19',
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
    _this.getJifen();
    _this.getList();
    _this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName'),
    })
    common.get(api.get_user_answer, {
      key: this.data.key
    }, res => {
      _this.setData({
        // state: res.datas.stauts
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