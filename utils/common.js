import config from './config.js';
import api from './api.js';
const app = getApp(),
  common = {};
common.ApiUrl = config.ApiUrl;
common.domain = config.domain;
common.https = config.https;
common.ajax = obj => {
  let key = '',
    bloo = false;
    key = wx.getStorageSync('keys').key;

  if (key) {
    request(key)
  } else {
    common.getUserInfo(key => {
      request(key)
    })
    return false;
  }

  function request(key) {
    obj = Object.assign({
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    }, obj)
    const slef = obj.slef;

    if (obj.show_loading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }

    wx.request({
      url: common.ApiUrl + obj.url,
      data: Object.assign(obj.data, {
        key
      }),
      method: obj.method.toUpperCase(),
      header: {
        'content-type': obj.data.formdata ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      success(res) {
        if (res.data.code && res.data.code != 200) {

          if (res.data.datas.error == '请登录') {

            common.getUserInfo((key) => {
              if (bloo) {
                request(wx.getStorageSync('keys').sell_key)
              } else {
                request(wx.getStorageSync('keys').key)
              }
            });
            return;
          }

          wx.hideLoading()
          return wx.showModal({
            title: '提示信息',
            content: res.data.datas.error,
            showCancel: false
          })
        }
        if (slef == '') {
          typeof obj.callback == 'function' && obj.callback(res.data);
          return
        }
        typeof slef[obj.callback] == 'function' && slef[obj.callback](res.data);
      },
      fail() {
        console.log(common.ApiUrl + obj.url)
        wx.showModal({
          title: "网络超时",
          content: "请关闭刷新",
          confirmText: "知道了",
          showCancel: !1
        })
      },
      complete() {
        if (obj.show_loading) {
          wx.hideLoading()
        }
      }
    });
  }
}

common.post = (url, data, callback, slef, show_loading) => {
  common.ajax({
    url,
    data,
    method: "post",
    callback,
    slef,
    show_loading
  })
}

common.get = (url, data, callback, slef, show_loading) => {
  common.ajax({
    callback,
    url,
    data,
    method: "get",
    slef,
    show_loading
  })
}

// 获取用户信息
common.getUserInfo = (cb) => {
  const request = (code, res) => {
    console.log(1111);
    console.log(code, res);
    //获取encryptedData iv
    const encryptedData = res.encryptedData,
      iv = res.iv,
      data = {
        'wxapp_code': code,
        'user_info': res.userInfo,
        'client': 'wxapp',
        'invite_id': 0,
        'encryptedData': encryptedData,
        'iv': iv,
        'type': '1'
      };

    setTimeout(() => {
      if (wx.getStorageSync('isLogin') === 'true') {
        return false
      }
      setTimeout(() => {
        wx.setStorageSync('isLogin', 'false')
      }, 3000)
      console.log('===')
      wx.setStorageSync('isLogin', 'true')
      wx.request({
        url: common.ApiUrl + '/index.php?act=login&op=wxapp_login',
        data,
        method: "POST",
        success(res) {
          setTimeout(() => {
            wx.hideLoading();
          }, 500)
          if (res.data.code != 200) return wx.showModal({
            title: '提示信息',
            content: res.data.datas.error,
            showCancel: false
          })
          wx.setStorageSync('keys', {
            key: res.data.datas.key,
            sell_key: res.data.datas.sell.key,
            userid: res.data.datas.userid,
          });
          wx.setStorageSync('inviter_id_1', res.data.datas.userid)

          typeof cb == 'function' && cb(res.data.datas.key, res.data.datas.user_info);
        },
        fail() {
          wx.hideLoading()
        }
      })
    }, 1000)

  }
  // if (wx.getStorageSync('data')) {
  //   wx.login({
  //     success: res => {
  //       const code = res.code;
  //       request(code, wx.getStorageSync('data'))
  //     }
  //   })
  // }
  // wx.showLoading({
  //   title: '登录中',
  // })
  wx.login({
    success: res => {
      console.log(res);
      const code = res.code;
      wx.getUserInfo({
        success(res) {
          console.log('---1--')
          request(code, res)
          wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
          wx.setStorageSync('nickName', res.userInfo.nickName);
        },
        fail() {
          console.log('---22---')
          if (wx.getStorageSync('userBloo')) return;
          wx.setStorageSync('userBloo', true);
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      })
    }
  })
}

common.browe = (id) => {

  common.post(api.browe_url, {
    goods_id: id
  }, (res) => {

  }, '')

}

common.share = (id) => {

  common.post(api.share_url, {
    goods_id: id
  }, (res) => {

  }, '')

}

common.conversion = (goods_id, id, cb, loading) => {

  common.get(api.conversion_url, {
    goods_id: goods_id,
    inviter_id: id
  }, function(res) {
    typeof cb == 'function' && cb(res.datas.share_invite_id, res.datas.store_info.member_id);
  }, '', loading)

}

export default common;