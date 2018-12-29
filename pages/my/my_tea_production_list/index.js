
const app = getApp()
import common from '../../../utils/common.js';
import api from '../../../utils/api.js';
import util from '../../../utils/util.js';
let http = common.https;
let ReachBottom = false;

Page({
  data: {
    obj: {},
    curpage: 0,
    totalPage: 1,
    dataList: [],
  },
  onLoad: function (options) {

    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.getData(0)

  },
  //获取列表数据
  getData() {
    const that = this;
    const curpage = that.data.curpage;
    let obj = {
      curpage,
    };
    common.post(
      api.getGardenList_url,
      obj,
      res => {
        let datas = res.datas;
        let dataList = that.data.dataList;
        that.setData({
          dataList: datas,
          dataList: [...dataList, ...res.datas],
          curpage: curpage + 1,
          // totalPage: res.page_total
        })
        wx.hideLoading()
        ReachBottom = false;
        if (res.code !== 200) {
          return wx.showToast({
            title: res.datas.error,
          })
        }

      }, '')

  },

  linkTo(e){

    let id = e.currentTarget.dataset.id,
    key = wx.getStorageSync('keys').key;
    console.log(id);
    wx.navigateTo({
      url: `../my_tea_production/index?goods_id=${id}&key=${key}`,
    })
  },
  //上拉加载
  onReachBottom() {
    const that = this;
    if (ReachBottom) return;
    const page = that.data.curpage;
    if (page > that.data.totalPage) {
      that.setData({
        ReachBottomBloo: true
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    that.getData()
  },
  //下拉刷新
  onPullDownRefresh() {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      curpage: 0
    })
    that.getData(true)
  },
})