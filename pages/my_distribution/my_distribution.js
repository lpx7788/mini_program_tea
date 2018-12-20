const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';

// pages/my_distribution/my_distribution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  goto: function (e) {
    if (!e.currentTarget.dataset.url) return;
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
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

  caculate(data) {
    let calc_total_price = parseFloat(data.goods_price) * parseFloat(data.sale_num),
      calc_sub_price = parseFloat(data.fx_price_one) * parseFloat(data.one_rate) + parseFloat(data.fx_price_tow) * parseFloat(data.two_rate),
      calc_final_price = calc_total_price - calc_sub_price;

    this.setData({
      ["datas.calc_total_price"]: calc_total_price,
      ["datas.calc_sub_price"]: calc_sub_price,
      ["datas.calc_final_price"]: calc_final_price,
    })
  },

  getDetail(id) {
    let self = this;

    common.post(api.get_goods_detail_url, {
      goods_id: id,
      formdata: true
    }, res => {
      if (200 == res.code) {
        self.setData({
          datas: res.datas
        })

        // 计算一些东西
        self.caculate(res.datas)

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
        inviter_id = options.inviter_id;

    // 浏览接口
    common.browe(goods_id);

    // 获取inviter_id
    common.conversion(goods_id, inviter_id, function (inviter_id) {
      self.setData({
        inviter_id: inviter_id
      })
    })

    // 如果是别人分享点进来的调分销接口
    // if (inviter_id) common.conversion(goods_id, inviter_id);

    this.setData({
      id: goods_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let page = getCurrentPages(),
      pageLen = page.length,
      currentPage = page[pageLen - 1],
      goods_id = currentPage.options.id,
      path = `/pages/browse_distribution/browse_distribution?id=${currentPage.options.id}&inviter_id=${currentPage.data.inviter_id}`;

    // wx.showModal({
    //   title: '转发时的inviter_id',
    //   content: currentPage.data.inviter_id,
    // })

    // 转发接口
    common.share(currentPage.options.id);

    return {
      title: '分享 Share',
      path: path
    }

  }
})