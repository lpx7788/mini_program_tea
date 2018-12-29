
const app = getApp()
import common from '../../../utils/common.js';
import api from '../../../utils/api.js';
import util from '../../../utils/util.js';
let http = common.https;


Page({
  data: {
    chooseSize:false,
    animationData:{},
    wathWeight:'',
    radioChange:'生普',
    radioChange2:'功夫红茶',
    radioChange3:'功夫红茶',
    goods_id:'',
    order_id:'',
    videpURl:'',
    videoImg:'',
    teaDetailList:{},
    obj:{},
    items1: [
      {name: '生普', value: '生普', checked: true},
    ],
    items2: [
      {name: '功夫红茶', value: '功夫红茶', checked: true},
      {name: '生普', value: '生普', checked: false},
      {name: '熟普', value: '熟普', checked: false},
    ],
    items3: [
      {name: '功夫红茶', value: '功夫红茶', checked: true},
    ]

  },

  wathWeight:function(e){
    var val = e.detail.value;
    console.log(val);
    this.setData({
      wathWeight: val
    });
  },

  //单选1
  radioChange: function(e) {
     var val = e.detail.value;
    this.setData({
      radioChange: val
    });
  },

  //单选2
  radioChange2: function(e) {
     var val = e.detail.value;
    this.setData({
      radioChange2: val
    });
  },

  //单选3
  radioChange3: function(e) {
     var val = e.detail.value;
    this.setData({
      radioChange3: val
    });
  },

  //跳转实况
  toLook(){
     wx.navigateTo({
        url: `../my_scene/index`,
       
      })
    // http://www.wish3d.com/Wish3DEarth/LSGlobe/scene.html?guid=7a2b0f99-1d63-4c8d-93bd-46d22c2fec11&IS_PACKAGE=0
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

  onLoad(options) {
    console.log(options);
    var that = this;
    let id = options.goods_id;
    that.setData({
      order_id: id
    })

    that.getDetailList();


  },

  //我的产量详情
  getDetailList() {
    const that = this;
    let obj = this.data.obj;
    obj.formdata = true;
    obj.order_id = this.data.order_id;
    common.post(
      api.getTeaYield_url,
      obj,
      res=>{
      if(res.code == 200){
        this.data.wathWeight = res.datas.sunning;
        // res.datas.goods_video = 'https://tea-garden.oss-cn-shenzhen.aliyuncs.com/video/video_20181110.mp4'
        that.setData({
          teaDetailList: res.datas,
          videpURl: res.datas.goods_video,
          videoImg: res.datas.goods_video +'?x-oss-process=video/snapshot,t_10000,f_jpg,w_345,h_250'
        })
        
      }
    },'')

  },


  //提交
  addTeaDemandSM() {
    var that = this
    if (!this.data.wathWeight) {
      wx.showToast({
        title: '请填购买量',
        icon: 'none',
        duration: 1000
      })
      return;
    }
  
    common.post(
      api.addTeaDemand_url,
        {
          order_id: that.data.order_id,
          sunning: that.data.wathWeight,
          cun: that.data.radioChange,
          xia: that.data.radioChange3,
          qiu: that.data.radioChange2,
        },
      res=>{
      if(res.code == 200){
        wx.showToast({
          title: '提交成功',
        })
      }
      if(res.code !== 200){
        return wx.showToast({
          title: res.datas.error,
        })
      }
     
      setTimeout(()=>{
        that.hideModal();
      },1000);
    },'')

  },

  
})