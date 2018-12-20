import common from '../../utils/common.js';
import api from '../../utils/api.js';

const app = getApp()

// create_distribution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUploadImg: true,
    canSubmit: true,
    datas: {}
  },

  validate(e) {
    let obj = e.detail.value;

    if (!obj.goods_name) {
      wx.showToast({
        title: '请输入活动内容',
        icon: 'none'
      })
      return false;
    }

    if (!obj.price) {
      wx.showToast({
        title: '请输入价格',
        icon: 'none'
      })
      return false;
    }

    if (!obj.fx_price_one) {
      wx.showToast({
        title: '请输入一级佣金',
        icon: 'none'
      })
      return false;
    }

    // todo
    if (!obj.fx_price_tow) {
      wx.showToast({
        title: '请输入二级佣金',
        icon: 'none'
      })
      return false;
    }

    if (!obj.g_storage) {
      wx.showToast({
        title: '请输入可售库存',
        icon: 'none'
      })
      return false;
    }

    if (!obj.image_path) {
      wx.showToast({
        title: '请上传活动主图',
        icon: 'none'
      })
      return false;
    }

    if ((parseFloat(obj.fx_price_one) + parseFloat(obj.fx_price_tow)) > parseFloat(obj.price)) {
      wx.showToast({
        title: '一级佣金和二级佣金总和不能高于价格',
        icon: 'none'
      })
      return false;
    }

    return true;
  },

  submit: function (e) {
    if (!this.validate(e)) return false;
    if (!this.data.canSubmit) return false;

    this.setData({
      canSubmit: false
    })

    let self = this,
      id = this.data.id;

    if (id) { // 编辑

      let obj = e.detail.value,
        data = {
          goods_id: id,
          goods_name: obj.goods_name,
          goods_image: obj.image_path,
          goods_body: obj.g_body,
          formdata: true
        };

      common.post(api.edit_good_url, data, res => {

        if (res.code == 200) {
          wx.showToast({
            title: '编辑成功',
            icon: 'none'
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500);
        } else {
          // this.setData({
          //   canSubmit: true
          // })

          wx.showToast({
            title: '编辑失败',
            icon: 'none'
          })
        }
      }, '')
    } else { // 新增
      let data = Object.assign(e.detail.value, {
        formdata: true
      });

      common.post(api.add_good_url, data, res => {
        if (res.code == 200) {
          wx.showToast({
            title: '创建成功，等待管理员审核',
            icon: 'none',
            duration: 3000
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 3000);
        } else {
          // this.setData({
          //   canSubmit: true
          // })

          wx.showToast({
            title: '创建失败',
            icon: 'none'
          })
        }
      }, '')
    }


  },

  chooseMainImage: function () {
    var self = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths,
          tempFiles = res.tempFiles;

        self.setData({
          previewMainImage: tempFilePaths[0]
        });

        wx.uploadFile({
          url: common.ApiUrl + api.upload_image_url,
          filePath: tempFilePaths[0],
          name: 'data',
          formData: {
            'key': wx.getStorageSync('keys').sell_key
          },
          success: function (res) {
            var data = JSON.parse(res.data),
              datas = data.datas;

            self.setData({
              image_path: datas.name,
              canUploadImg: false
            })
          }
        })

      }
    })
  },

  chooseImage: function () {
    var self = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths,
          tempFiles = res.tempFiles;

        self.setData({
          previewImage: tempFilePaths[0]
        });

        wx.uploadFile({
          url: common.ApiUrl + api.upload_image_url,
          filePath: tempFilePaths[0],
          name: 'data',
          formData: {
            'key': wx.getStorageSync('keys').sell_key
          },
          success: function (res) {
            var data = JSON.parse(res.data),
              datas = data.datas;

            self.setData({
              g_body: datas.thumb_name
            })
          }
        })

      }
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
        self.initForm(res.datas);

      } else {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    }, '')
  },

  initForm(data) {
    this.setData({
      canUploadImg: false,
      previewMainImage: data.image,
      image_path: data.goods_image,
      goods_body: data.goods_body,
      previewImage: data.goods_body
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;

    if (id && id != 'undefined') {
      this.setData({
        id: id
      })
      this.getDetail(id);
    }

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
})