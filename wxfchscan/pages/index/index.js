//index.js
//获取应用实例
const app = getApp();
var loginURL = app.globalData.baseUrl + '/verifyFlowInterfaceController/checkInfo.do';
var FCHCodeURL = app.globalData.baseUrl + '/verifyFlowInterfaceController/getFlow.do';
var amapFile = require('../../utils/amap-wx.js');
//var bmap = require('../../utils/bmap-wx.js');
var wxMarkerData = [];
// 引入SDK核心类
//var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

Page({
  data: {
    showModalStatus: false,
   // name: '',
    password: '',
    storeName: '',
    position:'',
    position2:'',

    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {}

  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    });
    // console.log(e.detail.value);
  },
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    });
    // console.log(e.detail.value)
  },
  storeInput(e) {
    this.setData({
      storeName: e.detail.value
    });
  },

  onLoad: function (e) {
    console.log("执行弹窗前:", app.globalData.flag);
    var that = this;
    var flag = wx.getStorageSync('flag');
    var userLocation=wx.getStorageSync('userLocation');
    console.log(userLocation.length);
    var myAmapFun = new amapFile.AMapWX({
      key: '752c1acbe8200aeac722478dd69a7278'
    });
      //高德地图获取位置信息
      myAmapFun.getRegeo({
        success: function (data) {
          //成功回调
          console.log("高德：",data);
          that.setData({position:data[0].latitude})
          that.setData({position:data[0].longitude})
          that.setData({position:data[0].name})
          console.log("高德：",data[0].latitude,data[0].longitude,data[0].name);
        },
        fail: function (info) {
          //失败回调
          console.log(info);
        }
      });

    console.log("缓存中flag:", flag);

    

    //百度地图API
    // var BMap = new bmap.BMapWX({
    //   ak: 'ksWpHyewwlGLO5vK6pCuEBnt2Bmuze76'
    // });
    // var fail = function (data) {
    //   console.log(data)
    // };
    // var success = function (data) {
    //   console.log("baidu_success_data",data);
    //   var id=0;
    //   wxMarkerData = data.wxMarkerData;
    //   that.setData({
    //     markers: wxMarkerData
    //   });
    //   that.setData({
    //     latitude: wxMarkerData[0].latitude
    //   });
    //   that.setData({
    //     longitude: wxMarkerData[0].longitude
    //   });
    //   //that.showSearchInfo(wxMarkerData, id);
    //   that.setData({position2:wxMarkerData[0].address})
    //   console.log("baidu:",wxMarkerData[0].address);
    // }
    // // // 发起regeocoding检索请求 
    // BMap.regeocoding({
    //   fail: fail,
    //   success: success,
    // });

    //  var qqmapsdk = new QQMapWX({
    //     key: '5THBZ-LHJW4-QAOUQ-X46AH-ID52F-VVBN4' // QQMAP开发密钥（key）必填
    //   });
    //   // //1、获取当前位置坐标
    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function (res) {
    //       //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    //       qqmapsdk.reverseGeocoder({
    //         location: {
    //           latitude: res.latitude,
    //           longitude: res.longitude
    //         },
    //         success: function (addressRes) {
    //           console.log(addressRes);
    //           var address = addressRes.result.formatted_addresses.recommend;
    //           that.setData({
    //             position:address,

    //           })
    //           console.log("QQMAPaddress:",address)
    //         }
    //       })
    //     }
    //   })



    //app.globalData.flag=true;
    //判断缓存中flag是否为ture,ture不弹窗，
    if (flag) {
      //console.log(e); 
     
      
    } else {
      var currentStatu = "open";
      that.util(currentStatu);
      //app.globalData.flag=false;
      console.log("执行弹窗后：", app.globalData.flag);
    }

  },
  //执行登录验证
  login: function (e) {
    var that = this;
    //console.log(e.currentTarget.dataset.statu);
    console.log("flag:", app.globalData.flag);
    //console.log("name",that.data.name,"+password",that.data.password)
    if (that.data.name.length == 0 || that.data.password.length == 0) {
      // console.log("name",that.data.name,"+password",that.data.password)
      wx.showToast({
        title: '用户名或密码错误',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: loginURL,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userName: that.data.name,
          passWord: that.data.password,

        },
        success: function (res) {
          console.log("TS服务器返回登录信息：", res.data);
          if (res.data.returnCode == 0) {

            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            //var currentStatu = e.currentTarget.dataset.statu;
            var currentStatu = "close";
            that.util(currentStatu);

            //console.log("currentStatu",currentStatu);
            app.globalData.flag = true;
            console.log("登录完成后flag：", app.globalData.flag);
            //var loginInfo=res.data;
            wx.setStorageSync('logininfo', res.data);
            //console.log(loginInfo);
            var loginInfo = "{" + "\"userName\"" + ":" + JSON.stringify(that.data.name) + "," + "\"" + "passWord" + "\"" + ":" + JSON.stringify(that.data.password) + "}";
            var loginBackInfo = JSON.stringify(res.data);
            var loginUserInfo = JSON.parse(loginBackInfo.slice(0, loginBackInfo.length - 1) + "," + loginInfo.slice(1, loginInfo.length));
            console.log(loginUserInfo);
            wx.setStorageSync('loginUserInfo', loginUserInfo);
            wx.setStorageSync('flag', app.globalData.flag);


          } else {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none',
              duration: 2000
            });
          }
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }

  },
  //扫描防窜货二维码
  scanFCHCode: function () {
    var that = this;
    var loginUserInfo = wx.getStorageSync('loginUserInfo');
    //console.log(loginUserInfo.returnCode);
    if (loginUserInfo.returnCode == 0) {

      wx.scanCode({
        success: function (res) {
          console.log(res);
          var queryCode = res.result;
          wx.request({
            url: FCHCodeURL,
            data: {
              queryCode: queryCode,
              userName: loginUserInfo.userName,
              storeName:that.data.storeName,
              latitude:that.data.latitude,
              longitude:that.data.longitude,
              position:that.data.position
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data);
              if(res.data.returnCode==0){
                that.setData({
                  rgcData: {
                     queryCode: '条    码: '+ '\t'+queryCode,
                     productName:'产品名称: '+ '\t'+res.data.returnData.productName,
                     inWarehouse: '售达方: '+ '\t'+res.data.returnData.inWarehouse, 
                     toCompanyname: '送达方: '+ '\t'+res.data.returnData.toCompanyname,
                     billNo: '发货单号: '+ '\t'+res.data.returnData.billNo, 
                     storeDateApp:'发货时间: '+ '\t'+res.data.returnData.storeDateApp,
                     }
                })
              }
              // success
            },
            fail: function () {
              // fail
            },
            complete: function (res) {
              console.log(res.data);
              // complete
            }
          })
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })

    } else {
      var currentStatu = "open";
      that.util(currentStatu);
      //app.globalData.flag=false;
      console.log("执行弹窗后：", app.globalData.flag);

    };

  },

  // makertap: function (e) {
  //   var that = this;
  //   var id = e.markerId;
  //   that.showSearchInfo(wxMarkerData, id);
  //   console.log(wxMarkerData);
  //   console.log(id);
  // },

  // showSearchInfo: function (data, i) {
  //   var that = this;
  //   that.setData({
  //     rgcData: {
  //       address: '地址：' + data[i].address + '\n',
  //       desc: '描述：' + data[i].desc + '\n',
  //       business: '商圈：' + data[i].business
  //     }
  //   });
  //   console.log("baidu:", that.data);
  // },

  //弹窗
  util: function (currentStatu) {
    var that = this;
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
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
        that.setData({
          showModalStatus: false
        });
      }
    }.bind(that), 200)

    // 显示
    if (currentStatu == "open") {
      that.setData({
        showModalStatus: true
      });
    }
  }
})
