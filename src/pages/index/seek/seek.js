const app = getApp()
import {
  seekListUrl,
  seekDetailUrl,
  seekDeleteUrl
} from '../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    pageSize: 10,
    totalPage: 0,
    currPage: 0,
    seekList: [],
    seek: {},
    currId:''
  },

  /**
   * 删除
   */
  delete: function () {
    var that = this;
    console.log(that.data.currId)
    var seek = {
      id: that.data.currId
    }
    wx.request({
      url: seekDeleteUrl,
      method: 'POST',
      data: JSON.stringify(seek),
      success(res) { 
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
          })
          that.hideModal();
          console.log("删除成功", res)
          that.getList();
        }
      },
      fail(res) {
        this.hideModal();
        console.log(res)
      }
    })
  },
  showDialogModal(e) {
    console.log(e.target.dataset.id)
    var that = this;
    that.setData({
      modalName: e.currentTarget.dataset.target,
      currId: e.target.dataset.id
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 人性化时间处理 传入时间戳
   * @param {*} timestamp  
   */
  timeFormat(timestamp, format) {
    var t = new Date(timestamp);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  },
  /**
   * 显示详情的模态框
   */
  showModal(e) {
    var that = this;
    wx.request({
      url: seekDetailUrl + '/' + e.currentTarget.dataset.id,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.code == 0) {
          // 格式化时间
          res.data.seek.time = that.timeFormat(Date.parse(res.data.seek.time), 'yyyy-MM-dd HH:mm')
          that.setData({
            seek: res.data.seek
          })
          that.setData({
            // modalName: e.currentTarget.dataset.target
            modalName: e.currentTarget.dataset.target,
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    that.getList();
  },
  /**
   * 显示图片
   * @param {*} event 
   */
  showImg(event) {
    wx.previewImage({
      current: event.target.id, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
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
   * 请求新数据
   */
  getList() {
    var that = this;
    wx.request({
      url: seekListUrl,
      data: {
        sessionId: app.sessionId,
        type: 1
      },
      success(res) {
        if (res.data.code == 0) {
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = new String(res.data.page.list[i].time).slice(11, 16)
            res.data.page.list[i].date = new String(res.data.page.list[i].date).slice(5)
          }
          that.setData({
            seekList: res.data.page.list,
            totalCount: res.data.page.totalCount,
            pageSize: res.data.page.pageSize,
            totalPage: res.data.page.totalPage,
            currPage: res.data.page.currPage,
          })
          console.log("已赋值 seek 列表：", that.data.seekList)
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.currPage === that.data.totalPage) {
      wx.showToast({
        title: '没有更多',
        icon: 'none',
      })
      return;
    }

    console.log("当前页：", that.data.currPage)
    wx.showLoading({
      title: '正在加载',
    })
    var page = that.data.currPage + 1;
    wx.request({
      url: seekListUrl,
      data: {
        page: page,
        limit: that.data.pageSize
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(Date.parse(res.data.page.list[i].time), 'yyyy-MM-dd HH:mm')
          }
          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          var seekList = res.data.page.list;
          var newSeekList = that.data.seekList;

          that.setData({
            seekList: newSeekList.concat(seekList),
            currPage: res.data.page.currPage,
            totalPage: res.data.page.totalPage
          });
          console.log("连接后的seekList：", that.data.seekList)
          console.log("已赋值seek列表：", that.data.seekList)
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【失物招领】最新发布',
      path: 'pages/index/seek/seek', // 路径，传递参数到指定页面。
      success: function (res) { },
      fail: function (res) { }
    }
  }
}) 