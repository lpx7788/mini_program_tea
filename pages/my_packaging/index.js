
const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
// import {upload_packaging_image_url} from '../../utils/api';
let http = common.https;

Page({
  data: {
    obj:{},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    sliderList: [],
    explain: '',
    up_img_url:''
  },

  onLoad(options) {
    // wx.showLoading({
    //   title: '加载中',
    // });
    this.getSliderList();
  },
  save(e){
    const t = e.currentTarget.dataset.type,
    obj = this.data.obj,
    value = e.detail.value;
    switch (t) {
      case '1':
        obj.character = value;
    }
    this.setData({
      obj: obj
    })
    // console.log(e.detail.value.character);
  },

  //打电话
  PhoneCall() {
    let id = wx.getStorageSync('keys').userid;
    // let store_id = this.data.store_member_id;
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let webViewUrl = `https://a.mindamedia.com/im/im/index.html&uid=${id}&avatar=${avatarUrl}`;
    // let webViewUrl = `https://a.mindamedia.com/im/im/index.html&uid=${id}&send_id=${store_id}&avatar=${avatarUrl}&pre=pa-`;

    wx.navigateTo({
      url: `../web_view/web_view?webViewUrl=${webViewUrl}`,
    })
  },

  //立即提交
  submitBtn() {
    let obj = this.data.obj;
    obj.formdata = true;
    if(!obj.character){
      return wx.showToast({
        title: '请输入需定制的文字',
        icon: 'none'
      })
    }
    if(!obj.image){
      return wx.showToast({
        title: '请上传图片LOGO',
        icon: 'none'
      })
    }

    common.post(
      api.packaging_url,
      obj,
      res=>{
      console.log(res);
      if(res.code !== 200){
        return wx.showToast({
          title: res.datas.error,
        })
      }
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(()=>{
        wx.navigateBack({})
      },1000);
    },'')

  },
   //轮播图
    getSliderList() {
      const that = this;
      let obj = this.data.obj;
      obj.formdata = true;
      common.post(
        api.pack_slider_url,
        obj,
        res=>{
        if(res.code == 200){
          console.log(res.datas.list);
          that.setData({
            sliderList: res.datas.list,
            explain:res.datas.content
          })
          
        }
      },'')

    },

    //选择图片
    uploader() {

      const that = this,
      url = that.data.up_img_url;
      wx.chooseImage({
        success(res) {
          that.uploadFile(res.tempFilePaths[0], 'img')
        },
      })
    },
    //上传图片或者视屏到服务器
    uploadFile(imgUrl, Type) {
      console.log(imgUrl);
      wx.showLoading({
        title: '上传中',
      })
      const that = this,
        arr = that.data.arr;
       const upload_packaging_image_url = '/index.php?act=index&op=upload'
        wx.uploadFile({
          url: common.ApiUrl + upload_packaging_image_url,
          filePath: imgUrl,
          name: 'file',
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },
          success(res) {
            wx.hideLoading()
            let obj = that.data.obj;
            obj.image = JSON.parse(res.data).datas.file_name;
            that.setData({
              obj: obj
            })

          },
          fail(error) {
            console.log(error)
          }
        })
    },


})