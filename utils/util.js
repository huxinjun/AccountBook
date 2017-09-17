function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * rpx转换为px单位
 */
function rpx2px(rpx) {
  var px=0
  wx.getSystemInfo({
    success: function (res) {
    //   console.log(res)
      px = res.screenWidth / 750 * rpx
    }
  })
  console.log("rpx" + rpx+"=px"+px)
  return px;
}
/**
 * px转换为rpx单位
 */
function px2rpx(px) {
  var rpx = 0
  wx.getSystemInfo({
    success: function (res) {
    //   console.log(res)
      rpx = px / res.screenWidth * 750
    }
  })
  console.log("px" + px + "=rpx" + rpx)
  return rpx;
}

module.exports = {
  formatTime: formatTime,
  rpx2px: rpx2px,
  px2rpx: px2rpx
}
