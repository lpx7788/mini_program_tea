import common from '../../utils/common.js';
import api from '../../utils/api.js';
const shopping_url = 'index.php?act=index',
  app = getApp(),
  http = common.https,
  goods_detail_url = '/index.php?act=goods&op=goods_detail',
  buy_step1_url = '/index.php?act=member_buy&op=buy_step1',
  goods_body_url = '/index.php?act=goods&op=goods_body',
  cart_add_url = '/index.php?act=member_cart&op=cart_add',
  cart_count_url = '/index.php?act=member_cart&op=cart_count',
  WxParse = require("../../wxParse/wxParse.js");
let curpage = 1,
  page = 4;
Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    circular: true,
    goods_list: [],
    integral_limit: 0,
    http: http,
    shoppingBloo: false,
    num: 1,
    size_current: 0,
    color_current: 0,
    shoppingBloo_1: false,
    cover: true,
    currentArr: [],
    masking: false,
    masking1: false, //虚拟的留言输入框
    msg: null, //留言
    numbers: 1, //
    isFenQi: '1'
  },
  goIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  cancleThis() {
    this.setData({
      masking1: false
    });
  },
  onLoad(e) {
    this.setData({
      goods_id: e.goods_id,
      inviter_id: e.inviter_id
    })

    common.share(this);
    this.getIndex();
    this.getDetails();
  },
  getIndex() {
    let _this = this;
    common.post(api.goods_list_url, {
      formdata: true
    }, res => {
      // 停止下拉刷新
      wx.stopPullDownRefresh();
      if (200 == res.code) {
        _this.setData({
          datas: res.datas
        })
      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },
  getData(e) {
    console.log(goods_detail_url)
    const that = this;
    const goods_id = that.data.goods_id;
    const inviter_id = that.data.inviter_id || '';
    wx.showLoading({
      title: '加载中',
    })
    common.get(goods_detail_url, {
      goods_id,
      inviter_id
    }, (res) => {
      var data = res.datas;
      var goods_map_spec = [];
      var currentArr = [];
      wx.setStorageSync('inviter_id', data.share_invite_id)
      wx.setNavigationBarTitle({
        title: data.goods_info.goods_name,
      })
      if (data.goods_info.spec_name) {
        for (let i in data.goods_info.spec_name) {
          var goods_specs = {};
          goods_specs["goods_spec_id"] = i;
          goods_specs['goods_spec_name'] = data.goods_info.spec_name[i];
          if (data.goods_info.spec_value) {
            for (let vi in data.goods_info.spec_value) {
              if (i == vi) {
                goods_specs['goods_spec_value'] = [];
                for (let vvi in data.goods_info.spec_value[vi]) {
                  var specs_value = {};
                  specs_value["specs_value_id"] = vvi;
                  specs_value["specs_value_name"] = data.goods_info.spec_value[vi][vvi];
                  goods_specs['goods_spec_value'].push(specs_value)
                }
              }
            }
            currentArr.push({
              currentIndex: goods_specs['goods_spec_value'][0]['specs_value_id']
            })
            goods_map_spec.push(goods_specs);
          } else {
            data.goods_info.spec_value = [];
          }
        }
      } else {
        goods_map_spec = [];
      }
      var type_p = data.goods_info.is_virtual == 0 ? true : false;
      var imgUrl;
      if (type_p) {
        imgUrl = data.goods_image.split(",");
      } else {
        imgUrl = data.goods_image.split("&&");
      }
      try {
        currentArr = Object.assign(currentArr, that.data.currentArr);
      } catch (e) {
        console.log(e);
      }
      console.log(goods_map_spec);
      let space = data.spec_list;
      that.setData({
        type_p,
        value: data,
        goods_image: imgUrl,
        goods_map_spec,
        currentArr,
        space,
        store_member_id: data.store_info.member_id,
        goods_video: data.goods_info.goods_video,
        goods_video_url: data.goods_info.goods_video.split('?')[0],
        idss: data.store_info.store_id
      })
      // 浏览接口
      common.browe(data.goods_info.goods_id);
      that.getDetails();
      that.cartCount();
      wx.hideLoading()
    }, "")
  },
  //获取介绍内容
  getDetails() {
    console.log(goods_body_url)
    const that = this;
    const goods_id = that.data.goods_id;
    wx.showLoading({
      title: '加载中',
    })
    common.get(goods_body_url, {
      goods_id
    }, (res) => {
      // that.setData({
      //   item: WxParse.wxParse('img', 'html', res, that, 5)
      // })
      console.log(res.datas.goods_body);
      WxParse.wxParse('img', 'html', res.datas.goods_body, that, 5)
      wx.hideLoading()
    }, "")
  },
  Jump(e) {
    let webViewUrl;
    const key = wx.getStorageSync('keys').key;
    let store_name = e.currentTarget.dataset.name;
    let store_id = e.currentTarget.dataset.id;
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
          url: `../web_view/web_view?webViewUrl=${webViewUrl}&store_name=${encodeURI(store_name)}&store_id=${store_id}&key=${key}`,
        })
      } else {
        // webViewUrl = `${http}/wap/tmpl/cart_list.html`;
        // wx.navigateTo({
        //   url: `../web_view/web_view?webViewUrl=${webViewUrl}&key=${key}`,
        // })
        wx.switchTab({
          url: '../break/break',
        })
      }
    }
  },
  //客服
  shareType(e) {
    const that = this;
    that.setData({
      shareBloo: !that.data.shareBloo
    })
  },
  //打电话
  PhoneCall() {
    let id = wx.getStorageSync('keys').userid;
    let store_id = this.data.store_member_id;
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let webViewUrl = `https://a.mindamedia.com/im/im/index.html&uid=${id}&send_id=${store_id}&avatar=${avatarUrl}&pre=pa-`;
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}`,
    })
  },
  //
  shoppingtoggle(e) {
    const that = this;
    const shoppingBloo = that.data.shoppingBloo;
    let type_p = that.data.type_p;
    if (type_p) {
      that.setData({
        shoppingBloo: !shoppingBloo
      })
    } else {
      that.setData({
        masking1: true
      })
    }
  },
  checkClick(){
    wx.navigateTo({
      url: `../http/http1`,
    })
  },
  createOrderss(e) {
    let id = e.currentTarget.dataset.id;
    // wx.setStorageSync('infoooooo', {
    //   goods_id: id,
    //   num: this.data.numbers,
    //   isFenQi: this.data.isFenQi,
    // })
    wx.navigateTo({
      url: `../http/http?goods_id=${id}&num=${this.data.numbers}&type=${this.data.isFenQi}`,
    })
    return false;
    // let self = this,
    //   id = e.currentTarget.dataset.id;

    // common.conversion(id, self.data.inviter_id);
    // const obj = {
    //   goods_id: id,
    //   formdata: true,
    //   quantity: this.data.numbers,
    // }
    // if (this.data.msg) {
    //   obj.buyer_msg = this.data.msg
    // }
    // common.post(api.create_order_url, obj, res => {
    //   console.log(res.datas.not)
    //   if (res.datas.not === '请先购买会员') {
    //     wx.showModal({
    //       title: '您还没有购买会员',
    //       content: '是否购买会员',
    //       showCancel: true,
    //       cancelText: '取消',
    //       cancelColor: '#ddd',
    //       confirmText: '确认',
    //       confirmColor: '#1E1A19',
    //       success: res => {
    //         if (res.confirm) {
    //           self.setData({
    //             masking: true,
    //             masking1: false
    //           })
    //         }
    //       }
    //     })
    //     return false
    //   }
    //   if (200 == res.code) {
    //     let order_sn = res.datas.order_sn; // 订单id
    //     self.setData({
    //       masking1: false
    //     })
    //     wx.navigateTo({
    //       url: '../pay/pay?pay_sn=' + order_sn + '&type_a=xuni',
    //     })
    //   } else {
    //     wx.showToast({
    //       title: '服务器错误',
    //       icon: 'none'
    //     })
    //   }
    // }, '')
  },
  shoppingtoggle_1() {
    let shoppingBloo_1 = this.data.shoppingBloo_1;
    this.setData({
      shoppingBloo_1: !shoppingBloo_1
    })
  },
  radioChange(e) {
    this.data.isFenQi = e.detail.value;
  },
  //加入购物车
  addCart() {
    const that = this,
      goods_id = that.data.goods_id,
      quantity = that.data.num;
    console.log(goods_id, quantity)
    common.post(cart_add_url, {
      goods_id,
      quantity
    }, (res) => {
      if (res.code != 200) return wx.showToast({
        title: res.datas,
        icon: 'none'
      })
      wx.showToast({
        title: '加入成功',
        icon: 'none'
      })
      let cart_count = that.data.cart_count;
      that.cartCount();
    }, "")

  },
  //获取购物车数量
  cartCount() {
    const that = this;
    common.post(cart_count_url, {}, (res) => {
      if (res.code != 200) return wx.showToast({
        title: res.datas.error,
        icon: 'none'
      })
      that.setData({
        cart_count: res.datas.cart_count
      })
    }, "")
  },
  Choice(e) {
    const that = this,
      id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      currentArr = that.data.currentArr;
    currentArr[index].currentIndex = id;
    console.log(currentArr)
    that.setData({
      currentArr
    })
    let space = this.data.space;
    if (Number(currentArr[0].currentIndex) > Number(currentArr[1].currentIndex)) {
      this.data.goods_id = space[currentArr[1].currentIndex + '|' + currentArr[0].currentIndex]
    } else {
      this.data.goods_id = space[currentArr[0].currentIndex + '|' + currentArr[1].currentIndex]
    }

    this.getData();
  },
  // 购买
  purchase() {
    const that = this,
      data = that.data.value,
      integral = parseInt(data.goods_info.integral_limit),
      goods_id = that.data.goods_id,
      key = wx.getStorageSync('key'),
      buynum = that.data.num;
    let integral_limit = parseInt(that.data.integral_limit);
    if (integral_limit > integral) {
      wx.showToast({
        title: '抵扣积分不能大于最多可抵扣积分',
        icon: 'none'
      })
      that.setData({
        integral_limit: integral
      })
      return;
    }
    if (buynum < 1) {
      return wx.showToast({
        title: '参数错误',
        icon: 'none'
      })
    } else if (buynum > data.goods_info.goods_storage) {
      return wx.showToast({
        title: '库存不足！',
        icon: 'none'
      })
    } else {
      const json = {};
      json.cart_id = goods_id + '|' + buynum;
      json.integral_limit = integral_limit;
      common.post(buy_step1_url, json, (res) => {
        if (res.code != 200) {
          wx.showModal({
            title: '提示信息',
            content: res.datas.error,
            showCancel: false
          })
        } else {

          let webViewUrl = `${http}/wap/tmpl/order/buy_step1.html`;
          const key = wx.getStorageSync('keys').key;
          wx.navigateTo({
            url: `../web_view/web_view?webViewUrl=${webViewUrl}&goods_id=${goods_id}&buynum=${buynum}&key=${key}&integral_limit=${integral_limit}&type=r`,
          })
        }
      }, "")
    }
  },
  integral_limit(e) {
    const that = this;
    that.setData({
      integral_limit: e.detail.value
    })
  },
  quantity(e) {
    const that = this;
    that.setData({
      numbers: e.detail.value
    })
  },
  add() {
    const that = this;
    let num = that.data.num;
    that.setData({
      num: parseInt(num) + 1
    })
  },
  minus() {
    const that = this;
    let num = that.data.num;
    if (num <= 1) return;
    that.setData({
      num: num - 1
    })
  },
  onShareAppMessage: function() {
    var that = this;
    var inviter_id = wx.getStorageSync('inviter_id');
    var userName = wx.getStorageSync('nickName');
    return {
      title: '【' + userName + '】分享Share',
      path: '/pages/index/shopping_detail?inviter_id=' + inviter_id + '&goods_id=' + that.data.goods_id,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  onShow() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        _this.setData({
          height: (res.screenHeight - 50) * 2
        })
      },
    })
    this.getData();
  },
  previewImage(url) {
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  },
  getQuan(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id,
      _this = this;
    common.post('/index.php?act=member_voucher&op=voucher_freeex', {
      tid: id
    }, res => {
      if (res.code == 200) {
        wx.showToast({
          title: '领取成功',
        })
        // success:res=>{
        // _this.setData({shoppingtoggle_1:false});
        // }
        // })
      }
    }, '')
  },
  tap() {
    if (this.data.play) {
      this.data.videoContext.pause();
      this.setData({
        cover: true
      })
    } else {
      this.data.videoContext.play();
      this.setData({
        autoplay: false
      })
    }
    this.data.play = !this.data.play;
  },
  ended() {
    this.data.videoContext.stop();

  },
  play() {
    this.setData({
      autoplay: false
    })
  },
  pause() {
    this.setData({
      autoplay: true
    })
  },
  timeupdate() {

  },
  saveVideo() {
    this.setData({
      cover: false
    })
    this.data.play = true;
    this.data.videoContext.play();
  },
  change() {
    // this.data.videoContext.pause();
    // this.data.play = false;
    // this.setData({
    //   autoplay: true,
    // })
  },
  onReady() {
    this.data.videoContext = wx.createVideoContext('myVideo');
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
      confirmColor: '#1E1A19 ',
      success: function(res) {
        if (res.confirm) {
          common.conversion(id, app.globalData.local_invite_id)

          // 浏览接口
          common.browe(id);

          common.post(api.create_order_url, {
            goods_id: id,
            formdata: true
          }, res => {
            if (200 == res.code) {
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
  getWXPayInfo: function(order_sn) {
    wx.showLoading({
      title: '支付中...',
    })
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
          wx.hideLoading();
          wx.showToast({
            title: '购买成功',
            icon: 'success'
          })
          self.setData({
            masking: false
          })
        },
        'fail': function(res) {
          wx.hideLoading();
          self.setData({
            masking: false
          })
        }
      })
    }, '')
  },
  cancleBuy() {
    this.setData({
      masking: false,
      masking1: false,
    })
  },
  textareas(msg) {
    console.log(msg);
    this.setData({
      msg: msg.detail.value
    });
  },
  numberss() {
    if (this.data.numbers === 1) {

    } else {
      this.setData({
        numbers: --this.data.numbers
      });
    }
  },
  numbersss() {
    console.log(this.data.numbers)
    this.setData({
      numbers: ++this.data.numbers
    });
  },
  goto: function(e) {
    // 跳转
    if (!e.currentTarget.dataset.url) return;
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  goToSellerShop() {
    const url = `${http}/wap/tmpl/store.html&store_id=${this.data.idss}`;
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${url}&key=${wx.getStorageSync('keys').key}`
    })
  }
})