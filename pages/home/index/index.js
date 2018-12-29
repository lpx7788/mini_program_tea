import common from '../../../utils/common.js';
const shopping_url = '/index.php?act=index',
  app = getApp(),
  http = common.https,
  page = 4;
// let curpage = 1;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    goods_list1: [],
    goods_list2: [],
    curpage: 1,
    http,
    total: true,
    ReachBottomBloo: false,
    leftH: 0,
    rightH: 0,
    // item: [],
  },
  click: function(e) {
    let id = e.currentTarget.dataset.id;
    const key = wx.getStorageSync('keys').key;
    let inviter_id = wx.getStorageSync('inviter_id');
    if (id) {
      wx.navigateTo({
        url: `shopping_detail?goods_id=${id}&key=${key}&inviter_id=${inviter_id}`,
        // url: `./pages/banner_detail/index?goods_id=${id}&key=${key}&inviter_id=${inviter_id}`,
      })
    }
  },
  linkTo(e) {
    let tyle = e.currentTarget.dataset.type,
      id = e.currentTarget.dataset.id,
      article_id = e.currentTarget.dataset.article_id,

      url = null;
    switch (tyle) {
      case '1':
        url = 'infoList';
        break;
      case '2':
        url = '../home_detal/index?id=' + id;
        break;
      case '3':
        url = 'shopList1';
        break;
      case '4':
        url = 'shopList2';
        break;
      case '5':
        url = '../home_detal/index?id=' + 30;
        // url = 'info_detail?id=' + article_id;
        break;
    }

    // console.log(id,url);
    wx.navigateTo({
      url: url,
    })
  },
  goLine(e) {
    let type = e.currentTarget.dataset.type,
      url = e.currentTarget.dataset.url,
      status = e.currentTarget.dataset.status,
      value = e.currentTarget.dataset.value,
      key = wx.getStorageSync('keys').key;
    if (!url) {
      wx.showToast({
        title: '不存在地址',
        none: 'none'
      })
      return
    }
    if (status === '1') {
      wx.showToast({
        title: value,
        icon: "none"
      })
      return
    }
    // console.log(`../web_view/web_view?webViewUrl=${url}&video_url=${value}&key=${key}`)
    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${url}&video_url=${value}&key=${key}`,
    })
  },
  Jump(e) {
    let webViewUrl;
    const goods_id = e.currentTarget.dataset.goods_id;
    const gc_id = e.currentTarget.dataset.id;
    const gc_name = e.currentTarget.dataset.name;
    const key = wx.getStorageSync('keys').key;
    setHref(key);

    function setHref(key) {
      if (goods_id) {
        webViewUrl = `${http}/tmpl/product_detail.html`
        const userInfo = wx.getStorageSync("userInfo"),
          inviter_id = wx.getStorageSync('inviter_id');
        wx.navigateTo({
          url: `shopping_detail?goods_id=${goods_id}&key=${key}&inviter_id=${inviter_id}`,
        })
      } else {
        webViewUrl = `${http}/wap/tmpl/shopping_list.html`;
        let data = {
          'gc_id': gc_id,
          'key': key,
          'gc_name': gc_name,
        };
        data = JSON.stringify(data)
        wx.navigateTo({
          url: `../web_view/web_view?webViewUrl=${webViewUrl}&gc_id=${gc_id}&key=${key}&gc_name=${encodeURI(gc_name)}`,
        })
      }
    }
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    });
    let id = options.inviter_id || decodeURIComponent(options.scene)
    if (id === 'undefined') {

    } else {
      wx.setStorageSync('inviter_id', id);
    }
  },

  getData() {
    wx.showLoading({
      title: '加载中',
    })
    const that = this,
      goods_list1 = that.data.goods_list1,
      goods_list2 = that.data.goods_list2,
      curpage = that.data.curpage,
      total = that.data.total;
    // curpage > 
    if (!total) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      return
    }
    try {
      common.get(shopping_url, {
        curpage,
        page
      }, (res) => {
        const newArr = that.setHight(goods_list1, goods_list2, res.datas.goods);
        that.setData({
          slide_list: res.datas.slide,
          goods_list: newArr,
          culture: res.datas.article_list_one[0],
          article: res.datas.article_list.map((item) => {
            let t = new Date(Number(item.article_time) * 1000),
              t1 = t.getFullYear(),
              t2 = t.getMonth() + 1,
              t3 = t.getDate();
            t2 = t2 < 10 ? '0' + t2 : t2;
            t3 = t3 < 10 ? '0' + t3 : t3;
            return Object.assign(item, {
              article_times: t1 + '-' + t2 + '-' + t3
            });
          }),
          tea: res.datas.virtual_goods[0]
        })
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }, "")
    } catch (e) {
      // console.log(e)
    }
  },
  setHight(arr1, arr2, list) {
    // height = null, width = null,
    let newHeight = null,
      rh = this.data.rightH,
      lh = this.data.leftH,
      arr = [];
    // console.log(rh, lh)
    let p = list.forEach((item, index) => {
      newHeight = item.info[1] * 330 / item.info[0];
      if (lh <= rh) {
        lh += (newHeight + 158);
        item.index = index;
        arr1.push(item);
        // console.log('--1---')
      } else {
        rh += (newHeight + 158);
        item.index = index;
        arr2.push(item);
        // console.log('--2---')
      }
    })
    this.data.rightH = rh;
    this.data.leftH = lh;
    arr.push({
      arr1
    })
    arr.push({
      arr2
    })
    return arr;
  },
  //上拉加载
  onReachBottom() {
    // this.getData();
  },
  onShareAppMessage(e) {
    var that = this;
    var inviter_id = wx.getStorageSync('inviter_id_1');
    var userName = wx.getStorageSync('nickName');
    return {
      title: '【' + userName + '】分享Share',
      path: '/pages/index/index?inviter_id=' + inviter_id,
      success: (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  },
  onPullDownRefresh() {
    this.setData({
      curpage: 1
    })
    this.getData()
  },
  getNews() {
    common.get('/index.php?act=index&op=getgg&ac_id=1', {}, res => {
      let data = res.datas.article_list;
      this.setData({
        news: data
      })
    }, '')
  },

  checkNew(e) {
    let _this = this,
      id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      news = this.data.news;
    wx.setStorage({
      key: 'news',
      data: {
        datas: JSON.stringify(news[index])
      },
      success: res => {
        wx.navigateTo({
          url: 'demo',
        })
      }
    })
  },
  onShow: function() {
    this.getData()
  },

})