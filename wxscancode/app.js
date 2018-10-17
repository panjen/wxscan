App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              console.log("appuserinfo: ",that.globalData.userInfo);
            },
            fail: function () {
              wx.redirectTo({
                url: '../../pages/login/login',
              })
            }
          })
        } else {
          //未授权, 跳转登录页面
          wx.redirectTo({
            url: '../../pages/login/login',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://172.17.19.90:8080',
    imageUrl: 'XXXXXXXX'
  }
})