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







/**
 * 克隆一个对象(所有属性)
 */
function clone(obj, callback) {

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) {
        //基础类型string,number,boolean等等
        return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = this.clone(obj[i], callback);
            if (callback && callback.onCopyed)
                callback.onCopyed(copy, i)
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {

            if (obj.hasOwnProperty(attr)) {

                copy[attr] = this.clone(obj[attr], callback);
                if (callback && callback.onCopyed)
                    callback.onCopyed(copy, attr)
            }
        }

        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}





/**
 * 计算文字宽度(目前只支持数字和小数点)
 * 一个fontSize可以显示:
 * 4.5个小数点
 * 1.7个数字
 * 1.5个英文字母
 * 1个汉字
 */
function calcTextWidth(fontSize,text) {
    var pointCount = 0
    var numCount = 0
    for (var i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) == 46)
            pointCount++
        else
            numCount++
        // console.log("!!!" + text.charAt(i)+"---"+text.charCodeAt(i))
    }
    var width = 40 / 4.5 * pointCount + 40 / 1.6 * numCount
    // console.log("点个数:" + pointCount + "---数字个数:" + numCount + "---计算宽度:" + width)
    return width
}

module.exports = {
  formatTime: formatTime,
  rpx2px: rpx2px,
  px2rpx: px2rpx,

  clone: clone,

  calcTextWidth: calcTextWidth
}
