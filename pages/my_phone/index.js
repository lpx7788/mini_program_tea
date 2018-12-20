// import util from '../../utils/util.js';
// import api from '../../utils/api.js';
const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
let http = common.https;
var interval = null //倒计时函数

Page({
  data: {
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    mobile: '',
    is_bind: '',
    mobileNum: '', //电话号码
    CodeNum: '', //验证码
  },

  onLoad: function (options) {
    this.getPoneMum();
  },

  //手机号的获取 
  getMobileNum: function (e) {
    this.data.mobileNum = e.detail.value;
  },

  // 验证码的获取
  getCodeNum: function (e) {
    this.data.CodeNum = e.detail.value;
  },


  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false   
        })
      }
    }, 1000)
  },

  //获取用户原有电话
  getPoneMum(resolve) {

    common.post(
      api.get_Mobile,{},
      res=>{
        this.setData({
          mobile: res.datas.phone,
          is_bind: res.datas.is_bind,
        })
    },'')
  },

  //获取验证码
  getPoneCaptcha(resolve) {
    if (!this.data.mobileNum) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this
    common.post(
      api.get_sms_captcha,
      {
        phone: that.data.mobileNum,
        type: 1
      },
      res=>{
        that.setData({
          disabled:true
        })
        wx.showToast({
          title: '验证码已发送',
          duration: 1000
        })
        that.getCode();
        
      if(res.code !== 200){
        that.setData({
          time: '重新发送',
          currentTime:61,
          disabled: false   
        })
        return wx.showToast({
          title: res.datas.error,
        })
      }

    },'')

    
  },

  //提交
  submitBtn() {

    if (!this.data.mobileNum) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.CodeNum) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var that = this
    common.post(
      api.phoneBand_url,
        {
          phone: that.data.mobileNum,
          captcha: that.data.CodeNum,
        },
      res=>{
        if (res.code == 200) {
          wx.showToast({
            title: '提交成功',
            duration: 1000
          })

          setTimeout(function () {
            wx.switchTab({
              url: '../../pages/user_center/user_center'
            })
          }, 2000)

          return;
       
        }

      if(res.code !== 200){
        return wx.showToast({
          title: res.datas.error,
        })
      }
      wx.showToast({
        title: '提交成功',
      })
      // setTimeout(()=>{
      //   wx.navigateBack({})
      // },1000);
    },'')

  }

})