//app.js
App({
  
  onLaunch: function () {
    var that =this;
    //console.log(flag);
    //that.flag=true;
   // console.log(that.flag);
    that.globalData.flag=false;
    //wx.setStorageSync('flag', that.globalData.flag);
    console.log("app.flag",that.globalData.flag)
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //console.log("logs",logs)

  },
  globalData: {
    userInfo: null,
    flag:"",
    baseUrl:"http://ts.jahwa.com.cn"
  }
})