const app = getApp()
import { studentCreditUrl } from '../../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    creditRequirements: null,
    electiveCredits: null,
    major: null,
    optionalCredits: null,
    requiredCredits: null,
    stuNo: null
  },
  /**
   * 点击跳转到绑定页
   */
  toBind() {
    wx.navigateTo({
      url: '../../../mine/bind/bind',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    wx.request({
      url: studentCreditUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.code === 0) {
          wx.hideLoading();
          that.setData({
            creditRequirements: res.data.data.creditRequirements,
            electiveCredits: res.data.data.electiveCredits,
            major: res.data.data.major,
            optionalCredits: res.data.data.optionalCredits,
            requiredCredits: res.data.data.requiredCredits,
            stuNo: res.data.data.stuNo
          })
        } else if (res.data.code === 400) {
          wx.hideLoading();
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