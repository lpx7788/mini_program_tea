// pages/rate/rate.js
const app = getApp()
import common from '../../utils/common.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 1000,
    item1: true,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
    title: false,
    curpage: 1,
    page: 1,
    arr: [],
    aValue: '',
    length: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight * 2 - 214
        })
      }
    })
    this.setData({
      key: wx.getStorageInfoSync('keys').key
    })
  },
  valueSet(e) {
    let value = e.detail.value;
    this.setData({
      aValue: value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData();
  },
  getData: function() {
    wx.showLoading({
      title: '加载中。。。',
    })
    let _this = this,
      curpage = _this.data.curpage,
      page = _this.data.page,
      key = _this.data.key,
      aValue = '';
    common.get(api.get_problem, {
      key: key,
      curpage: curpage,
      page: page
    }, (res) => {
      if (res.code !== 200) {
        return wx.showModal({
          title: '服务器异常'
        })
      }
      if (!res.datas.length) {
        return wx.navigateTo({
          url: '../user_center/user_center',
        })
      }
      let data = res.datas[0],
        p_answer = data.answer,
        arr = this.data.arr,
        nums = data.is_radio;
      for (let j in arr) {
        if (arr[j].id == data.id) {
          if (nums === '2') {
            aValue = arr[j].ids || arr[j].ids[0]
          } else {
            for (let k in p_answer) {
              aValue = arr[j].ids;
              if (arr[j].ids.length == 0) {

              } else {
                for (let m in arr[j].ids) {
                  arr[j].ids[m] == p_answer[k].id ? p_answer[k].checked = true : ''
                }
              }
            }
          }
          break;
        }
      }
      _this.setData({
        p_id: data.id,
        p_content: data.question,
        is_radio: data.is_radio,
        p_answer: p_answer,
        aValue: aValue,
        length: res.count
      })
      wx.hideLoading();
    }, '')
  },
  prevQ: function() {
    this.save();
    if (this.data.curpage == 1) {
      return wx.showToast({
        title: '没有上一题',
        icon: 'none'
      })
    }
    this.setData({
      curpage: this.data.curpage - 1
    })
    this.getData();
  },
  nextQ: function() {
    // if(this.data.length == this.data.curpage){
    //   return wx.showToast({
    //     title: '这是最后一题了',
    //     icon: 'none',
    //   })
    // }
    this.save();
    this.setData({
      curpage: this.data.curpage + 1
    })
    this.getData();
  },
  submit: function() {
    let _this = this;
    this.save();
    let arr = this.data.arr;
    console.log(arr)
    for (let i in arr) {
      if (arr[i].ids == '') {
        return wx.showModal({
          title: '第' + (Number(i) + 1) + '小题未做',
          content: '是否前去勾选',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#aaaaaa',
          confirmText: '确定',
          confirmColor: '#1E1A19', 
          success: function(res) {
            if (res.confirm) {
              _this.setData({
                curpage: Number(i) + 1
              })
              _this.getData();
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
    // 全部填写完成进入这里
    this.doNumebr();
    let key = _this.data.key;
    wx.showLoading({
      title: '提交中。。。。',
    })
    common.post(api.post_answer, {
      key: key,
      answer: _this.data.newArr
    }, res => {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showToast({
          title: res,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '提交成功',
          icon: '',
        })
        _this.setData({
          item1: false,
          item5: true
        })
      }
    }, '')
  },
  save: function() {
    // 保存数据
    let arr = this.data.arr,
      p_id = this.data.p_id,
      aValue = this.data.aValue,
      old = false;
    // if (!aValue) {
    //   wx.showToast({
    //     title: '您还未选择答案',
    //     icon: 'none'
    //   })
    //   return 
    // }
    if (arr.length) {
      for (let i in arr) {
        if (arr[i].id == p_id) {
          arr[i].ids = aValue;
          old = true;
          break;
        }
      }
    }
    // debugger
    let arrs = [];
    arrs.push(aValue)
    if (!old) {
      arr.push({
        id: p_id,
        ids: arrs
      })
    }
    this.setData({
      arr,
      value: ''
    })
  },
  radioChange: function(e) {
    if (!e.detail.value.length) {
      this.setData({
        aValue: []
      })
      return
    }
    let is_radio = this.data.is_radio,
      aValue, p_answer = this.data.p_answer;
    if (is_radio == '1') {
      e.detail.value[1] ? aValue = e.detail.value[1] : aValue = e.detail.value[0]
      for (let i in p_answer) {
        p_answer[i].checked = false;
        if (p_answer[i].id == aValue) {
          p_answer[i].checked = true;
        }
      }
      let arr = [];
      arr[0] = aValue;
      this.setData({
        aValue: arr,
        p_answer
      })
    } else {
      this.setData({
        aValue: e.detail.value
      })
    }
  },
  doNumebr: function() {
    let arr = this.data.arr,
      newArr = '';
    for (let i in arr) {
      for (let j in arr[i].ids) {
        newArr += arr[i].ids[j] + '|' + arr[i].id + ','
      }
    }
    newArr = newArr.substring(0, newArr.length - 1);
    this.setData({
      newArr
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})