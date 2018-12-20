const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';

// pages/browse_distribution/browse_distribution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    datas: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isMe: false,
    notVip: false
  },

  shuoming() {
    let fenxiao = this.data.datas.fenxiao;

    wx.showModal({
      title: '分销规则说明',
      content: fenxiao,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  goto: function (e) {
    util.goto(e);
  },

  previewImage(e) {
    let type = e.currentTarget.dataset.type,
      image = '';

    switch (type) {
      case 'head':
        image = this.data.datas.image;
        break;
      case 'body':
        image = this.data.datas.goods_body;
        break;
    }

    wx.previewImage({
      current: image,
      urls: [image]
    })
  },

  getWXPayInfo: function (order_sn) {
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
        'success': function (res) {
          console.log('支付成功', res);

          self.getDetail(self.data.id);

          // 支付成功重新获取分销id
          common.conversion(self.data.id, null, function (inviter_id) {
            self.setData({
              inviter_id: inviter_id
            })
          }, true)

        },
        'fail': function (res) { }
      })
    }, '')
  },

  createOrder: function (e) {
    let vip_id = e.currentTarget.dataset.id;

    let self = this,
      id;

    if (vip_id) {
      id = vip_id;

      // wx.showModal({
      //   title: 'invite_id',
      //   content: app.globalData.local_invite_id || '无',
      // })

      // common.conversion(id, wx.getStorageSync('local_invite_id'))
      common.conversion(id, app.globalData.local_invite_id)

      // 浏览接口
      common.browe(id);

    } else {
      id = this.data.id;

      if (this.data.datas.level == "0") {
        this.getVipList();
        return;
      }

      if (e.currentTarget.dataset.buy == 'disabled') {
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return;
      }

      if (this.data.isMe) {
        wx.showToast({
          title: '不能购买自己的商品',
          icon: 'none'
        })
        return;
      }

    }

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
  },

  getVipList() {
    let self = this;

    self.setData({
      notVip: true
    })

    common.post(api.goods_list_url, {
      formdata: true
    }, res => {
      if (200 == res.code) {
        let data = res.datas,
          datas = Object.assign(self.data.datas, data);

        self.setData({
          datas: datas
        })

      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')

  },

  getDetail(id) {
    let self = this;

    common.post(api.get_goods_detail_url, {
      goods_id: id,
      formdata: true
    }, res => {
      if (200 == res.code) {
        let data = res.datas,
          datas = Object.assign(self.data.datas, data);

        self.setData({
          datas: datas,
          notVip: false
        })

        // todo
        // if (res.datas.level == "0") self.getVipList();
        // if (true) self.getVipList();

      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this,
      goods_id = options.id,
      local_invite_id = app.globalData.local_invite_id,
      goods_invite_id = options.inviter_id,
      // local_invite_id = wx.getStorageSync('local_invite_id'),
      inviter_id = '';

    if (goods_invite_id) {
      inviter_id = goods_invite_id;
      app.globalData.local_invite_id = goods_invite_id;
    } else {
      inviter_id = local_invite_id;
    }
    // wx.showModal({
    //   title: '分享jin来的inviter_id',
    //   content: inviter_id,
    // })

    // 浏览接口
    common.browe(goods_id);

    // 获取inviter_id
    common.conversion(goods_id, inviter_id, function (inviter_id, userid) {
      self.setData({
        inviter_id: inviter_id,
        isMe: wx.getStorageSync('keys').userid == userid
      })
    })

    setTimeout(function () {
      let page = getCurrentPages(),
        pageLen = page.length,
        currentPage = page[pageLen - 1];
      currentPage['']
    }, 1000)
    // 如果是别人分享点进来的调分销接口
    // if (inviter_id) common.conversion(goods_id, inviter_id);

    this.setData({
      id: options.id
    })
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
    let id = this.data.id;

    if (!id || id == 'undefined') {
      wx.showToast({
        title: '缺少项目id',
        icon: 'none'
      })
      return;
    }

    this.getDetail(id);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    let page = getCurrentPages(),
      pageLen = page.length,
      currentPage = page[pageLen - 1],
      goods_id = currentPage.options.id,
      path = `${currentPage.route}?id=${currentPage.options.id}&inviter_id=${currentPage.data.inviter_id}`,
      goods_name = currentPage.data.datas.goods_name,
      title = `【${wx.getStorageSync('nickName')}】分享Share`;

    // wx.showModal({
    //   title: '分享出来的inviter_id',
    //   content: currentPage.data.inviter_id, 
    // })

    // 转发接口
    common.share(currentPage.options.id);

    return {
      title: title,
      path: path
    }

  }
})