// pages/bluetooth/index/index.js

//获取应用实例
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bluetoothState: "json",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log("操作系统：" + app.getSystem() + ",微信版本号：" + app.getVersion() + ",平台：" + app.getPlatform())


    //var that = this;


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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 检测是否支持蓝牙
   * Android从微信6.5.7开始支持，iOS从微信6.5.6开始支持
   */
  checkVersion: function () {
    var version = app.getVersion()
    var platform = app.getPlatform()
    if ("android" == platform) {
      if (version < "6.5.7") {
        this.showHintDialog('抱歉，微信版本低于6.5.7无法使用蓝牙模块，请尽快升级。')
      } else {
        this.showHintDialog('支持使用蓝牙模块,使用前请先手动打开蓝牙~')
      }

    } else if ("ios" == app.getPlatform()) {
      if (version < "6.5.6") {
        this.showHintDialog('抱歉，微信版本低于6.5.6无法使用蓝牙模块，请尽快升级。')
      } else {
        this.showHintDialog('支持使用蓝牙模块,使用前请先手动打开蓝牙~')
      }
    }

  },
  /**
   * 弹出提示
   */
  showHintDialog: function (content) {
    wx.showModal({
      title: '提示信息',
      content: content,
    })
  },
  /**
   * 初始化小程序蓝牙模块，生效周期为调用wx.openBluetoothAdapter至调用wx.closeBluetoothAdapter或小程序被销毁为止
   */
  openBluetoothAdapter: function () {
    var that = this
    wx.openBluetoothAdapter({//
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        that.showHintDialog(JSON.stringify(res))
      },
      fail: function (res) {
        that.showHintDialog(JSON.stringify(res))
        console.log("fail:" + JSON.stringify(res))
      }
    })
  },
  /**
   * 获取本机蓝牙适配器状态
   */
  getBluetoothAdapterState: function () {
    var that = this
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        that.showHintDialog(JSON.stringify(res))
      },
      fail: function (res) {
        that.showHintDialog(JSON.stringify(res))
        console.log("fail:" + JSON.stringify(res))
      }
    })
  },
  /**
   * 关闭蓝牙模块，使其进入未初始化状态。调用该方法将断开所有已建立的链接并释放系统资源。建议在使用小程序蓝牙流程后调用，与wx.openBluetoothAdapter成对调用。
   */
  closeBluetoothAdapter: function () {
    var that = this
    wx.closeBluetoothAdapter({//
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        that.showHintDialog(JSON.stringify(res))
      },
      fail: function (res) {
        that.showHintDialog(JSON.stringify(res))
        console.log("fail:" + JSON.stringify(res))
      }
    })
  },
  /**
   * 监听蓝牙适配器状态变化事件
   */
  onBluetoothAdapterStateChange: function () {
    var that = this
    wx.onBluetoothAdapterStateChange(function (res) {
      //更新数据，页面会同步更新
      that.setData({
        bluetoothState: JSON.stringify(res)
      })
      console.log(that.data.bluetoothState)
      console.log(`adapterState changed, now is`, res)
    })
  },
  /**
   * 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索
   */
  startBluetoothDevicesDiscovery: function () {
    var that = this
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        wx.showToast({
          title: '正在搜索...',
        })
      },
      fail: function (res) {
        console.log("fail:" + JSON.stringify(res))
        wx.showToast({
          title: '开启失败',
        })
      },
      services: [],//蓝牙设备主 service 的 uuid 列表，某些蓝牙设备会广播自己的主 service 的 uuid。如果这里传入该数组，那么根据该 uuid 列表，只搜索发出广播包有这个主服务的蓝牙设备，建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备
      allowDuplicatesKey: false,//是否允许重复上报同一设备， 如果允许重复上报，则onDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同
      interval: 0,//上报设备的间隔，默认为0，意思是找到新设备立即上报，否则根据传入的间隔上报

    })
  },
  /**
   * 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索
   */
  stopBluetoothDevicesDiscovery: function () {
    var that = this
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        wx.showToast({
          title: '已停止搜索',
        })
      },
      fail: function (res) {
        console.log("fail:" + JSON.stringify(res))
        wx.showToast({
          title: '停止失败',
        })
      },
    })
  },
  /**
   * 获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
   */
  getBluetoothDevices: function () {
    var that = this

    wx.getBluetoothDevices({
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        that.setData({
          list: res.devices
        })
      },
      fail: function (res) {

        console.log("fail:" + JSON.stringify(res))
        wx.showToast({
          title: '获取失败',
        })
      },
    })
  },
  /**
   * ArrayBuffer转16进度字符串
   */
  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
  /**
   * 监听寻找到新设备的事件
   */
  onBluetoothDeviceFound: function () {
    var that = this
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('new device list has founded')
      //console.dir(devices)
      //console.log(that.ab2hex(devices[0].advertisData))
      that.showHintDialog(JSON.stringify(devices))
    })
  },
  /**
   * 根据 uuid 获取处于已连接状态的设备
  */
  getConnectedBluetoothDevices: function (uuid) {

    wx.getConnectedBluetoothDevices({
      services: uuid,//蓝牙设备主 service 的 uuid 列表
      success: function (res) {
        console.log("success:" + JSON.stringify(res))
        that.showHintDialog(JSON.stringify(res))
      },
      fail: function (res) {
        that.showHintDialog(JSON.stringify(res))
        console.log("fail:" + JSON.stringify(res))
      },
    })
  },
  /**
   * 连接低功耗蓝牙设备
   */
  createBLEConnection: function (item) {
    wx.showLoading({
      title: '正在连接',
    })
    wx.createBLEConnection({
      deviceId: item.deviceId,//蓝牙设备 id
      success: function (res) {

        console.log(JSON.stringify(res))
        if (res.errCode == 0) {
          wx.setStorage({
            key: 'item',
            data: item,
          })
          wx.showToast({
            title: '连接成功',
          })
          wx.navigateTo({
            url: '../connect/connect',
          })

        }
      },
      fail: function (res) {
        that.showHintDialog(JSON.stringify(res))
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  /**
   * 点击了设备
   */
  clickDevice: function (e) {
    console.log(JSON.stringify(e))
    var index = parseInt(e.currentTarget.dataset.index)
    var item = this.data.list[index]
    var content = "要连接到" + item.name + "吗"
    wx.showModal({
      title: '提示信息',
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.createBLEConnection(item)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }





})