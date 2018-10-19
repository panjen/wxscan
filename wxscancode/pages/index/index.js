const app = getApp();
var API_URL = app.globalData.baseUrl + '/wXLoginController?decodeUserInfo';
var API_SCAN_URL=app.globalData.baseUrl + '/wXScanCodeController?scanCodeInfo'
Page({
  data:{
    showModalStatus: false,
    result:null
  },
  onLoad: function () {},
  login: function (e) {
    var that=this; 
  
    wx.login({
      success: function (r) {
        var code = r.code; //登录凭证
        //console.log(code)
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              // console.log({
              //   encryptedData: res.encryptedData,
              //   iv: res.iv,
              //   code: code
              // });
            
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: API_URL, //自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code
                },

                success: function (data) {
                  console.log(data.data.status); //服务器返回的状态
                  //console.log(data.data.userInfo.city);
                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    app.globalData.userInfo = userInfo_;
                    console.log(userInfo_);
                    wx.setStorageSync("openid", data.data); //保存服务器返回的数据,以便后期需求的使用
                    console.log("openid", data.data.userInfo.openId);
                    
                    //扫码开始
                    wx.scanCode({
                      success: function (res) {
                        // success
                        wx.request({
                          url: API_SCAN_URL,
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: {result:res.result,
                                 openid:data.data.userInfo.openId
                          },
                          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                          // header: {}, // 设置请求的 header
                          success: function(data){
                            console.log(data.data);
                            that.show=data.data;
                            that.setData({
                              result: that.show
                            });
                           var currentStatu = e.currentTarget.dataset.statu;
                           that.util(currentStatu);
                          },
                          fail: function() {
                            // fail
                          },
                          complete: function() {
                            // complete
                          }
                        })


                        console.log(res.result + "   success");
                        that.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
                        
                        
                        
                         
                        
                        wx.showToast({
                          title: '扫描成功',
                          icon: 'success',
                          duration: 2000
                        });
                        
                      },
                      fail: function () {
                        
                        // fail
                      },
                      complete: function () {
                        // var currentStatu = e.currentTarget.dataset.statu;
                        // that.util(currentStatu);
                        // complete
                        
                      }
                    })
                  } else {
                    console.log('解密失败');
                    //console.log(res.encryptedData);
                    //console.log(res.iv);
                    // console.log(code);
                  }

                },
                fail: function () {
                  //console.log(code,res.code);
                  console.log('系统错误')
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },

   powerDrawer: function (ee) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          // latitude,
          // longitude,
          // scale: 28
          
        })
      }
    });
     var currentStatu = ee.currentTarget.dataset.statu;
     this.util(currentStatu)
   },
  util: function(currentStatu){
    var that=this;
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });
    
    // 第2步：这个动画实例赋给当前的动画实例
    that.animation = animation;
 
    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();
 
    // 第4步：导出动画对象赋给数据对象储存
    that.setData({
      animationData: animation.export()
    })
    
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      that.setData({
        animationData: animation
      })
      
      //关闭
      if (currentStatu == "close") {
        that.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(that), 200)
  
    // 显示
    if (currentStatu == "open") {
      that.setData(
        {
          showModalStatus: true
        }
      );
    }
  }


})