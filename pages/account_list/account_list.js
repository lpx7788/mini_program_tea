const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
let http = common.https;
let ReachBottom = false;
Page({
  data: {
    obj: {},
    curpage: 0,
    totalPage: true,
    chooseSize:false,
    money:false,
    member_integral:'',
    available_predeposit:'',
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
      api.money_fee_url,
      obj,
      res => {
        let datas = res.datas.list;
        let dataList = that.data.dataList;
      
        console.log(res.datas.list)
        that.setData({
          dataList: datas,
          dataList: [...dataList, ...res.datas.list],
          curpage: curpage + 1,
          totalPage: res.datas.state,
          member_integral: res.datas.member.member_integral,
          available_predeposit: res.datas.member.available_predeposit
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
  
  // 选择茶品种
  chooseClick:function(e){
    var that = this;
    var animation  = wx.createAnimation({
        duration:500,
        timingFunction:'linear'
      })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      chooseSize:true
    })
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    },200)
  },
  //获取输入框值
  money:function(e){
    var val = e.detail.value;
    console.log(val);
    this.setData({
      money: val
    });
  },
  //提现
  withdrawbtn() {
    if (!this.data.money) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 1000
      })
      return;
    }
   
    var that = this
    common.post(
      api.withdraw_url,
        {
          money: that.data.money,
        },
      res=>{
        wx.showToast({
          title:res.datas,
          duration: 1000
        })

      if(res.code !== 200){
        return wx.showToast({
          title: res.datas.error,
        })
        
      }
  

    },'')
    setTimeout(()=>{
      that.hideModal();
    },1000);

  },
  // 隐藏框
  hideModal:function(e){
    var that = this;
    var animation = wx.createAnimation({
      duration:1000,
      timingFunction:'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData:animation.export()
      
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },

  //上拉加载
  onReachBottom() {
    const that = this;
    if (ReachBottom) return;
    const page = that.data.curpage;
     console.log(that.data.totalPage);
    if (that.data.totalPage==false) {
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