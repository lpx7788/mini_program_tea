// pages/order/order_deatil.js
import common from '../../utils/common.js';
import api from '../../utils/api.js';
var QRCode = require('../../utils/qr.js');
var qrcode;
let http = common.https;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    r: 'v',
    msg: '确认收货',
    disabled: true,
    send: true,
    finsh: false,
    isDai: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      types: options.type,
      id: options.id,
      isType: options.type === 'w' ? true : false
    })
  },
  cost() {
    const that = this;
    var url = null;
    //支付 先拿sn去换参数
    if(this.data.isType && this.data.r === 'v'){
      url = '/index.php?act=member_payment&op=payfee';
    }else{
      url = "/index.php?act=member_payment&op=pay_new";
    }
    let sn = wx.getStorageSync('pay_sn');
    common.get(url, {
      pay_sn: sn
    }, options => {
      console.log(options);
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
                // 跳转到个人中心
                that.getOrder({
                  id: this.data.id,
                  type: this.data.types
                });
              }
            }
          })
        },
        fail(res) {
          wx.showModal({
            title: '',
            content: '支付失败!',
            showCancel: false,
          })
        }
      })
    }, '')
  },
  copy() {
    wx.setClipboardData({
      data: this.data.order_detail.order_sn,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  getOrder(options) {
    let id = options.id,
      url, _this = this,
      disabled,
      r, finsh;
    const obj = {};
    wx.showLoading({
      title: '努力加载中。。。',
      mask: true,
    })
    if (options.type === 'v') {
      url = '/index.php?act=member_vr_order&op=order_info';
      obj.order_id = id
    }
    if (options.type === 'r') {
      url = '/index.php?act=member_order&op=order_info';
      obj.order_id = id
    }
    if (options.type === 'w') {
      if ((wx.getStorageSync('typssse') === 'r')) {
        options.type = 'r';
        url = '/index.php?act=member_order&op=order_info';
      } else {
        url = '/index.php?act=member_vr_order&op=order_info';
        options.type = 'v';
      }
      obj.order_id = id;
      this.setData({
        isDai: true
      });
    }
    r = options.type;
    common.get(url, obj, (res) => {
      let data = res.datas.order_info;
      data.add_time = data.add_time.substring(0, 10);
      let buyer_cancel = data.if_buyer_cancel, //取消
        deliver = data.if_deliver, //是否发送
        evaluation = data.if_evaluation, //是否评价
        lock = data.if_lock, //冻结
        receive = data.if_receive, //是否接受
        refund_cancel = data.if_refund_cancel; //退款产生的取消
      let send = true,
        disabled = true,
        finsh = true,
        locks = false;
      if (lock) {
        locks = true;
        data.state_desc = '退货/退款中...'
      }
      if (buyer_cancel) {
        locks = true;
        data.state_desc = '取消交易'
      }
      if (refund_cancel) {
        send = false;
        data.state_desc = '待发货'
      }
      // if (deliver) {
      //   data.state_desc = ''
      // } 
      if (receive) {
        data.state_desc = '待接收'
        disabled = false
      }
      if (evaluation) {
        data.state_desc = '待评价'
        finsh = false;
      }
      let rec_id = null;
      if (r === 'r') {
        rec_id = data.goods_list[0].rec_id;
      } else if (r === 'v' && !this.data.isType) {
        rec_id = data.code_list[0].rec_id;
        _this.setData({
          isUse: data.code_list[0].vr_indate * 1000 > Date.parse(new Date()),
          stas: data.code_list[0].refund_lock
          // stas: data.code_list[0].vr_code_desc
        })
        console.log(data.code_list[0].vr_indate * 1000 > Date.parse(new Date()))
      } else if (r === 'v' && this.data.isType) {
        rec_id = data.goods_id;
        _this.setData({
          isUse: new Date(data.vr_indate) > Date.parse(new Date()),
        })
        wx.setStorageSync('pay_sn', data.order_sn);
      }
      _this.setData({
        order_detail: res.datas.order_info,
        disabled,
        finsh,
        send,
        lock: locks,
        evaluation: data.if_evaluation,
        r: r,
        goods_id: rec_id,
        store_member_id: data.store_member_id || data.code_list[0].store_id,
        sn: data.order_sn,
      })
      if (!(r === 'v' && this.data.isType)) {
        qrcode = new QRCode('canvas', {
          text: res.datas.order_info.order_sn,
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, '')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  confirm: function(e) {
    let _this = this,
      order_detail = this.data.order_detail,
      id = this.data.order_detail.order_id,
      url = '/index.php?act=member_order&op=order_receive';
    wx.showModal({
      title: '是否确认收货',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#cccccc',
      confirmText: '确认',
      confirmColor: '#1E1A19;',
      success: function(res) {
        if (res.confirm) {
          common.post(url, {
            order_id: id
          }, (res) => {
            if (200 == res.code) {
              _this.getOrder({
                id: _this.data.id,
                type: _this.data.types
              });
              wx.showToast({
                title: '收货成功',
              }), _this.setData({
                msg: '收货成功',
                disabled: false,
                order_detail,
                finsh: true,
                evaluation: true
              })
            } else {
              wx.showToast({
                title: res.datas.error,
              })
            }
          }, '')
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  check(e) {
    let stat = e.currentTarget.dataset.stat;
    let goods_id = this.data.goods_id;
    let id = wx.getStorageSync('keys').userid;
    let store_id = this.data.store_member_id;
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let webViewUrl;
    switch (stat) {
      case '0':
        webViewUrl = `${http}/wap/tmpl/member/order_delivery.html`;
        break;
      case '1':
        webViewUrl = `${http}/wap/tmpl/member/member_evaluation.html`;
        break;
      case '2':
        webViewUrl = `${http}/wap/tmpl/member/refund_all.html`;
        break;
      case '3':
        webViewUrl = `${http}/wap/tmpl/member/refund.html`;
        break;
      case '4':
        webViewUrl = `${http}/wap/tmpl/member/return.html`;
        break;
      case '5':
        console.log(id);
        console.log(store_id);
        console.log(avatarUrl);
        webViewUrl = `https://a.mindamedia.com/im/im/index.html&uid=${id}&send_id=${store_id}&avatar=${avatarUrl}&pre=pa-`;
        break;
      case '6':
        return this.cancleOrder();
        break;
    }
    let key = wx.getStorageSync('keys').key;
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}&order_id=${this.data.id}&order_goods_id=${goods_id}`,
    })
  },
  cancleOrder() {
    let _this = this,
      id = this.data.order_detail.order_id,
      url = '/index.php?act=member_vr_order&op=order_cancel';
    wx.showModal({
      title: '是否取消订单',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#cccccc',
      confirmText: '确认',
      confirmColor: '#1E1A19',
      success: function(res) {
        if (res.confirm) {
          common.post(url, {
            order_id: id,
            buyer_message: 'x'
          }, (res) => {
            if (res.code !== 200) {
              return wx.showModal({
                title: res.datas
              });
            }
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            })
            wx.setStorageSync('need', true)
            setTimeout(() => {
              wx.navigateBack({

              })
            }, 1000);
          }, '')
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  checks() {
    let _this = this,
      id = this.data.order_detail.order_id,
      url = '/index.php?act=member_vr_order&op=add_refund';
    wx.showModal({
      title: '',
      content: '由于PARTY趴分享规则，退款只能退回分享后商家实际所收到的金额',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#cccccc',
      confirmText: '确认',
      confirmColor: '#1E1A19;',
      success: function(res) {
        if (res.confirm) {
          common.post(url, {
            order_id: id,
            buyer_message: 'x'
          }, (res) => {
            if (200 == res.code) {
              wx.showToast({
                title: '退货受理中',
                icon: 'success'
              })
              setTimeout(() => {
                wx.navigateBack({

                })
              }, 1000);
            } else {
              wx.showToast({
                title: res.datas.error,
              })
            }
          }, '')
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrder({
      id: this.data.id,
      type: this.data.types
    });
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
    let obj = {
      type: this.data.types,
      id: this.data.id
    }
    this.getOrder(obj);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  cancle() {
    common.post('/index.php?act=member_order&op=order_cancel', {
        order_id: this.data.id
      }, res => {
        if (res.code !== 200) {
          return wx.showModal({
            title: res.datas
          });
        }
        wx.showToast({
          title: '取消成功',
          icon: 'success'
        })
        wx.setStorageSync('need', true)
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000);
      },
      '')
  }
})