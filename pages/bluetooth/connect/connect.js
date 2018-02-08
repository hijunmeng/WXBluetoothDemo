// pages/bluetooth/connect/connect.js
//获取应用实例
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {

    item: {},//当前连接蓝牙设备信息
    receiveData: "",//接收到数据
    inputData: "123456",//输入数据
    statusDesc: "已连接",//设备连接状态
    services: [],//设备服务列表
    characteristics: [],//蓝牙设备特征值
    currentService: {},//当前服务
    currentCharacteristic: {},//当前特征值
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    that = this
    wx.getStorage({
      key: 'item',
      success: function (res) {
        that.setData({
          item: res.data
        })
        console.log(JSON.stringify(res))
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 页面返回时不回调此生命周期
   */
  onHide: function () {
    console.log("onHide")

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
    //断开连接
    that.closeBLEConnection()
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
   * 断开蓝牙连接
   */
  closeBLEConnection: function () {
    wx.closeBLEConnection({
      deviceId: that.data.item.deviceId,
      success: function (res) {
        wx.showToast({
          title: '已断开连接',
        })
        console.log(JSON.stringify(res))
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
      }
    })
  },
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性

tips: 并行调用多次读写接口存在读写失败的可能性
   */
  writeBLECharacteristicValue: function (sendData) {

    let buffer = new ArrayBuffer(sendData.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < sendData.length; i++) {
      console.log(sendData.charAt(i).charCodeAt())
      dataView.setUint8(i, sendData.charAt(i).charCodeAt())

    }
    wx.writeBLECharacteristicValue({
      deviceId: that.data.item.deviceId,
      serviceId: that.data.currentService.uuid,
      characteristicId: that.data.currentCharacteristic.uuid,
      value: buffer,
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.showToast({
          title: '发送成功',
        })
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
        wx.showToast({
          title: '发送失败',
        })
      }
    })
  },
  /**
   * 发送数据
   */
  sendData: function (e) {
    console.log("输入框内容：" + that.data.inputData)
    that.writeBLECharacteristicValue(that.data.inputData)
  },
  /**
   * 监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等
   */
  onBLEConnectionStateChange: function () {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      that.setData({
        statusDesc: `device ${res.deviceId} state has changed, connected: ${res.connected}`
      })
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
  },
  /**
   * 获取蓝牙设备所有 service（服务）
   */
  getBLEDeviceServices: function () {
    wx.getBLEDeviceServices({
      deviceId: that.data.item.deviceId,// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      success: function (res) {
        wx.showToast({
          title: '获取成功',
        })
        console.log(JSON.stringify(res))
        that.setData({
          services: res.services
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取失败',
        })
        console.log(JSON.stringify(res))
      }
    })
  },
  /**
   * 点击服务项
   */
  clickService: function (e) {
    console.log(JSON.stringify(e))
    var index = parseInt(e.currentTarget.dataset.index)
    var item = this.data.services[index]
    that.setData({
      currentService: item
    })
    var content = "要获取服务 " + item.uuid + " 的特征值吗"
    wx.showModal({
      title: '提示信息',
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.getBLEDeviceCharacteristics(item)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 获取蓝牙设备某个服务中的所有 characteristic（特征值）
   */
  getBLEDeviceCharacteristics: function (service) {
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.item.deviceId,
      serviceId: service.uuid,
      success: function (res) {
        console.log(JSON.stringify(res))
        that.setData({
          characteristics: res.characteristics
        })
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
        wx.showToast({
          title: '获取失败',
        })
      }
    })
  },
  /**
   * 点击特征值
   */
  clickCharacteristic: function (e) {
    console.log(JSON.stringify(e))
    var index = parseInt(e.currentTarget.dataset.index)
    var item = this.data.characteristics[index]
    that.setData({
      currentCharacteristic: item
    })
  },
  /**
   * ArrayBuffer转16进度字符串示例
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
   * 发送框数据
   */
  bindKeyInput: function (e) {
    this.setData({
      inputData: e.detail.value
    })
  },
  /**
   * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性

另外，必须先启用notify才能监听到设备 characteristicValueChange 事件
   */
  notifyBLECharacteristicValueChange: function () {

    wx.notifyBLECharacteristicValueChange({
      deviceId: that.data.item.deviceId,
      serviceId: that.data.currentService.uuid,
      characteristicId: that.data.currentCharacteristic.uuid,
      state: true,
      success: function (res) {
        console.log(JSON.stringify(res))
        that.onBLECharacteristicValueChange()
        wx.showToast({
          title: '启用成功',
        })
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
        wx.showToast({
          title: '启用失败',
        })
      },
    })
  },
  /**
   * 点击启用notify
   */
  clickNotify: function (e) {
    that.notifyBLECharacteristicValueChange();
  },
  /**
   * 监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
   */
  onBLECharacteristicValueChange: function () {
    wx.onBLECharacteristicValueChange(function (res) {
      console.log("onBLECharacteristicValueChange:"+JSON.stringify(res))
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
      console.log(that.ab2hex(res.value))
      that.setData({
        receiveData:that.ab2hex(res.value)
      })
    })
  },
  /**
   * ArrayBuffer转16进度字符串示例
   */
  ab2hex: function(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
  return hexArr.join('');
  }



})