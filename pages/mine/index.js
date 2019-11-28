const app = getApp()
var config = require("../../config.js")

Page({
  data: {
    avatarUrl: null,
    nickName: null,
    isRegister: false,
  },
  onLoad: function() {
    this.userInfo = app.getGlobalUserInfo();
    console.log(this.isRegister)
    // 检查是否已注册
    this.checkRegister();
  },

  // 检查是否已注册
  checkRegister: function() {
    var that = this;
    wx.request({
      url: config.registerUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          console.log("是否已注册：" + res.data.meta.msg)
          // 获取用户数据
          wx.request({
            url: config.queryUrl,
            data: {
              sessionId: app.sessionId,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {

              console.log(res.data)
              that.setData({
                nickName: res.data.data.nickname,
                avatarUrl: res.data.data.avatarUrl
              })
            }
          })
          that.setData({
            isRegister: true
          })
        } else if (res.data.meta.status === 400) {
          console.log("是否已注册：" + res.data.meta.msg)
        }
      }
    })
    console.log(that.isRegister)
  },

  onShow() {
    this.getTabBar().init();
  },
  menuCard: function(e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  // 获取用户信息事件
  onGotUserInfo: function(e) {
    var that = this;
    console.log(e.detail.userInfo)
    // 成功获取 userInfo 后给此页面赋值
    this.userInfo = e.detail.userInfo;
    that.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    })
    console.log(this.userInfo)
    // 保存用户
    wx.request({
      url: config.addUrl,
      method: 'post',
      data: {
        sessionId: app.sessionId,
        avatarUrl: e.detail.userInfo.avatarUrl,
        city: e.detail.userInfo.city,
        country: e.detail.userInfo.country,
        gender: e.detail.userInfo.gender,
        language: e.detail.userInfo.language,
        nickName: e.detail.userInfo.nickName,
        province: e.detail.userInfo.province
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.meta.status === 200) {
          console.log("保存用户：" + res.data.meta.msg)
          that.setData({
            isRegister: true,
          })
        } else if (res.data.meta.status === 400) {
          console.log("保存用户：" + res.data.meta.msg)
        }
      }
    })
  },
})