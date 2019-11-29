const app = getApp()
var config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 1,
    scrollLeft: 0,
    // 热点图书列表
    readerHotList: [],
    recommendHotList: [],
    cateHotList: [],
    majorHotList: [],
    // 图书分类法总类列表
    bookCateList: [],
    // 学院列表
    collegeList: []
  },
  // tab 切换
  tabSelect(e) {
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    // 判断当前页已经加载过了，就不再首次加载了
    if (e.currentTarget.dataset.id == 1 && this.data.readerHotList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 2 && this.data.recommendHotList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 3 && this.data.bookCateList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 4 && this.data.collegeList.length != 0) {
      return;
    }
    // 判断是哪种图书热点
    var url = config.hotlUrl;
    // 读者热点-近2年入藏复本总借量
    if (e.currentTarget.dataset.id == 1) {
      var type = 2;
    }
    // 荐购热点-近5年入藏复本总借量
    else if (e.currentTarget.dataset.id == 2) {
      var type = 4;
    }
    // 分类热点，查询图书分类法总类列表
    else if (e.currentTarget.dataset.id == 3) {
      url = config.bookCateUrl;
    }
    // 专业热点，查询学院列表
    else if (e.currentTarget.dataset.id == 4) {
      url = config.collegeUrl;
    }

    // 请求标签所在的列表
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: url,
      data: {
        // sessionId: app.sessionId,
        type: type
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          if (e.currentTarget.dataset.id == 1) {
            that.setData({
              readerHotList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 2) {
            that.setData({
              recommendHotList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 3) {
            that.setData({
              bookCateList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 4) {
            that.setData({
              collegeList: res.data.data.list
            })
          }
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载',
    })
    // 页面加载，请求交大要闻
    wx.request({
      url: config.hotlUrl,
      data: {
        // sessionId: app.sessionId,
        type: 2
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          this.setData({
            readerHotList: res.data.data
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})