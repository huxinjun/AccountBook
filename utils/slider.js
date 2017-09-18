/**
 * 左滑删除
 * Created by xinjun on 2017/8/11 14:10
 */

/**按下x */
var startX = 0
/**按下y */
var startY = 0
/**上一次move事件的x */
var preX = 0
/**标识事件是否已经中断 */
var eventEnd = false


var slidersInfo
//-----------------------------------------------------------------------------------------------

/**
 * ！！！使用require实例化时务必调用init方法初始化需要的参数
 * 描述信息
 */
function init(slidersInfo) {
    this.slidersInfo = slidersInfo
    var page = this.slidersInfo.page
    var that=this
    page.eventCaptureStart=function(e){
        that.captureStart.call(that,e)
    }
    page.eventCaptureMove = function (e) {
        that.captureMove.call(that,e)
    }
    page.eventCaptureEnd = function (e) {
        that.captureEnd.call(that,e)
    }
    page.eventCaptureCancel =function (e) {
        that.captureCancel.call(that,e)
    }
    page.eventCaptureTap = function (e) {
        var index = e.target.dataset.index
        that.close.call(that,index)
    }
    page.eventStart = function (e) {
        console.log("eventStart")
        //拉开时确定要显示的按钮
        var index = e.target.dataset.index
        if (page.requireSliderUpdate)
            page.requireSliderUpdate(index)

        that.start(e)
    }
    page.eventMove = function (e) {
        console.log("eventMove")
        that.move(e)
    }
    page.eventEnd = function (e) {
        console.log("eventEnd")
        that.end(e)
    }
    page.eventCancel = function (e) {
        console.log("eventCancel")
        that.cancel(e)
    }
    return this
}

/**
 * 获取当前抽屉内容宽度
 * index:item索引
 */
function getSliderWidthByIndex(index) {
    var item = this.slidersInfo.page.getSliderData(index)
    if (!this.hasSlider(index))
        return 0
    var width = 0;
    item.value.layerInfo.buttons.forEach(function (v, i) {
        var visible = v.visible
        visible = visible == undefined ? true : visible
        width += visible ? v.width : 0
    })
    return width;
}

/**
 * 检查配置的信息是否能拉开
 * index:item索引
 */
function hasSlider(index) {
    var item = this.slidersInfo.page.getSliderData(index)
    if (item.value.layerInfo == undefined ||
        item.value.layerInfo.buttons == undefined ||
        item.value.layerInfo.buttons.length == 0) {
        return false
    }
    var result = false
    item.value.layerInfo.buttons.forEach(function (v, i) {
        if (result)
            return
        if (v.visible)
            result = true
    })
    return result
}
/**
 * 配置特有的layer,layerInfo中的属性将会覆盖声明的LayerInfo
 */
function updateLayer(index, newInfo) {
    var item = this.slidersInfo.page.getSliderData(index)

    if (newInfo == undefined) {
        console.log("删除layerInfo属性")
        delete item.value.layerInfo
        return
    }
    //覆盖属性
    item.value.layerInfo.buttons.overide(newInfo)
    //重写更新界面关联的属性
    this.setLayer(index)

}
/**
 * 设置当前要显示的slider
 * index:item索引
 * layerIndex：layer索引
 */
function setLayer(index, layerIndex) {

    var item = this.slidersInfo.page.getSliderData(index)

    if (item.value == undefined)
        item.value = {}
    if (item.style == undefined)
        item.style = {}

    //复制一个layer对象,为的是每个item之后可以更新layer的状态
    if (layerIndex != undefined) {
        item.value.layerInfo = clone(this.slidersInfo.layers[layerIndex])
        item.value.layerIndex = layerIndex
        return
    }

    //配置可拖动视图
    if (!this.hasSlider(index)) {
        console.log("no slider")
        return
    }

    var layer = this.slidersInfo.layers[item.value.layerIndex]

    //更新界面绑定的数据
    var p1 = "width:" + this.getSliderWidthByIndex(index) + "rpx;"
    var p2 = "height:" + layer.height + "rpx;"
    var p3 = "line-height:" + layer.height + "rpx;"
    var p4 = "vertical-align:middle;"
    var p5 = "text-align:center;"
    var p6 = "position:absolute;right:0;top:0;"


    item.style.slider_container_pos = "position:relative;top:0;z-index:1;overflow:hidden;"
    item.style.slider = p1 + p2 + p3 + p4 + p5 + p6


    var that = this

    //处理每一种状态元素的element.style
    this.slidersInfo.layers.forEach(function (outterValue, outterIndex) {

        if (outterValue.buttons == undefined)
            return
        var right = 0

        //使用item自带的layerInfo
        if (outterIndex == item.value.layerIndex)
            outterValue = item.value.layerInfo

        outterValue.buttons.forEach(function (innerValue, innerIndex) {



            var p1 = "height:" + layer.height + "rpx; "
            var p2 = "width:" + innerValue.width + "rpx;"
            var p3 = "color:" + innerValue.color + ";"
            var p4 = "background-color:" + innerValue.colorBg + ";"
            var p5 = "text-shadow:2rpx 2rpx 1rpx " + innerValue.colorShadow + ";"
            var p6 = "position: absolute;"
            var p7 = "top:0;"
            var p8 = "right:" + right + "rpx;"
            var visible = innerValue.visible
            visible = visible == undefined ? true : visible
            right += visible ? innerValue.width : 0;
            //是否显示
            var p9 = outterIndex != item.value.layerIndex ? "display:none;" : "display:" + (visible ? "inherit" : "none") + ";"

            var p10 = "font-size:28rpx;"

            var styleName = "layerStyle_" + outterIndex + "_" + innerIndex
            var tapName = "layerTap_" + outterIndex + "_" + innerIndex
            var textName = "layerText_" + outterIndex + "_" + innerIndex
            var styleValue = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10

            item.style[styleName] = styleValue
            item.value[tapName] = innerValue.onClick
            item.value[textName] = innerValue.text
        })
    })

    //更新界面
    this.slidersInfo.page.refreshSliderData()
}





/**
 * 按下时触发
 */
function start(e) {
    var index = e.target.dataset.index
    var item = this.slidersInfo.page.getSliderData(index)

    if (!this.hasSlider(index)) {
        item.style.sv_main = "width:750rpx;"
        this.slidersInfo.page.refreshSliderData()
        eventEnd = true
        return
    }

    this.closeOther(index)



    this.eventEnd = false;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;


    this.slidersInfo.page.refreshSliderData()


}

/**
 * 移动时触发
 */
function move(e) {
    var index = e.target.dataset.index
    var item = this.slidersInfo.page.getSliderData(index)

    if (!this.hasSlider(index))
        return
    if (this.eventEnd)
        return



    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - this.startX;
    var moveY = currY - this.startY;



    var deltaX = currX - this.preX;
    this.preX = currX;


    // 已经抽出,还往左滑,忽略后面的事件
    if (item.value.slider_container_left <= -250 && deltaX < 0)
        return

    // 已经合上,还往右滑,忽略后面的事件
    if (item.value.slider_container_left >= 0 && deltaX > 0)
        return


    // console.log("-------------" + moveX)
    //避免快速滑动时两个move事件x距离太大,抽屉滑过头了
    // moveX = moveX < -this.getSliderWidthByIndex(index) ? -this.getSliderWidthByIndex(index) : moveX
    // moveX = moveX > 0 ? 0 : moveX


    item.value.slider_container_left = moveX
    item.style.slider_container_left = 'left:' + item.value.slider_container_left + 'rpx;';
    console.log("left:" + moveX);
    this.slidersInfo.page.refreshSliderData()




}

/**
 * 结束时触发
 */
function end(e) {
    var index = e.target.dataset.index
    var item = this.slidersInfo.page.getSliderData(index)

    if (!this.hasSlider(index))
        return

    this.eventEnd = true

    var isOpen = Math.abs(item.value.slider_container_left) > 75 ? true : false



    if (isOpen)
        this.open(index)
    else
        this.close(index)
}

/**
 * 关闭所有打开的抽屉
 */
function closeOther(index) {
    console.log('closeOther')
    var datas = this.slidersInfo.page.getSliderData()

    datas.forEach(function (v, i) {
        if (i == index)
            return
        v.value.isSliderOpen = false
        v.value.slider_container_left = 0
        v.style.slider_container_left = 'left:0;transition:all 0.2s ease;'
        v.style.scroll_left = 0
    })

    this.slidersInfo.page.refreshSliderData()

    setTimeout(function () {
        var datas = this.slidersInfo.page.getSliderData()
        datas.forEach(function (v, i) {
            if (i == index)
                return
            v.style.slider_container_left = 'left:0;'
            v.style.scroll_left = 0
            v.style.slider = "display:none;"
        })

        this.slidersInfo.page.refreshSliderData()
    }.bind(this), 200)
}

/**
 * 关闭某个索引的抽屉
 */
function close(index) {
    var item = this.slidersInfo.page.getSliderData(index)

    item.value.isSliderOpen = false
    item.value.slider_container_left = 0
    item.style.slider_container_left = 'left:0;transition: left 0.2s ease;';
    item.style.scroll_left = 0

    this.slidersInfo.page.refreshSliderData()

    //解决垂直滑动时右下角隐约可见slider的buttons
    setTimeout(function () {
        var item = this.slidersInfo.page.getSliderData(index)
        item.style.slider = "display:none;"
        item.style.slider_container_left = 'left:0;'
        this.slidersInfo.page.refreshSliderData()
    }.bind(this), 200)
}
/**
 * 关闭某个索引的抽屉
 */
function open(index) {
    var item = this.slidersInfo.page.getSliderData(index)

    item.value.isSliderOpen = true
    item.value.slider_container_left = -this.getSliderWidthByIndex(index)
    item.style.slider_container_left = 'left:' + -this.getSliderWidthByIndex(index) + 'rpx;transition: left 0.2s ease;';
    this.slidersInfo.page.refreshSliderData()

    setTimeout(function () {
        var item = this.slidersInfo.page.getSliderData(index)
        item.style.slider_container_left = 'left:' + -this.getSliderWidthByIndex(index) + "rpx;"
        this.slidersInfo.page.refreshSliderData()
    }.bind(this), 200)
}

/**
 * 强制中断本次抽屉事件
 */
function breakOnce() {
    if (this.eventEnd)
        return
    this.eventEnd = true
    console.log("breakOnce")
    this.closeOther()
}



/**
 * 打断时触发
 */
function cancel(e) {
    this.end(e)

}




/**
 * 点击删除按钮事件:transition动画
 */
function deleteItem(index) {
    var item = this.slidersInfo.page.getSliderData(index)

    //先是透明度动画
    item.style.styleBorder = "border:none;"
    item.style.deleteTrans = "opacity:0;transition:opacity 0.2s ease;"

    this.slidersInfo.page.refreshSliderData()
    //继续进行高度动画
    setTimeout(function () {
        item = this.slidersInfo.page.getSliderData(index)
        item.style.deleteTrans = "opacity:0;height:0;transition:height 0.3s ease;"
        this.slidersInfo.page.refreshSliderData()

        //最后删除元素
        setTimeout(function () {
            console.log("setTimeout删除：" + index)
            console.log(this)
            item = this.slidersInfo.page.getSliderData(index)
            item.style.deleteTrans = "display:none;opacity:0;height:0;"
            this.slidersInfo.page.refreshSliderData()

            var datas = this.slidersInfo.page.getSliderData()
            //移除列表中下标为index的项
            datas.remove(index, 1);
            datas.forEach(function (v, i) {
                v.value.slider_container_left = 0
                v.style.slider_container_left = ""
            })
            //更新列表的状态
            this.slidersInfo.page.refreshSliderData()
        }.bind(this), 300)

    }.bind(this), 200)

}







function isHorizontal(startEvent, currEvent) {
    var startX = startEvent.touches[0].pageX;
    var startY = startEvent.touches[0].pageY;
    var currX = currEvent.touches[0].pageX;
    var currY = currEvent.touches[0].pageY;
    //获取滑动角度
    var a = angle({ X: startX, Y: startY }, { X: currX, Y: currY });
    console.log(a)
    if (Math.abs(a) > 30)
        return false;
    return true;
}

/**
 * 计算滑动角度
 * @param {Object} start 起点坐标
 * @param {Object} end 终点坐标
 */
function angle(start, end) {
    var _X = end.X - start.X,
        _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
}

/**
 * 克隆一个对象(所有属性)
 */
function clone(obj) {

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
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {

            if (obj.hasOwnProperty(attr)) {

                copy[attr] = clone(obj[attr]);
            }
        }

        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}







//------------------------------------------------------------------------
var startEvent=null
var calculated=false
//按下时关闭
function captureTap(e) {
    page.captureEventTap(e)
}
function captureStart(e) {
    console.log("捕获阶段：start")
    this.startEvent = e
    this.calculated = false
}
function captureMove(e) {
    if (this.calculated)
        return
    var page = this.slidersInfo.page
    console.log("捕获阶段：move")
    var currEvent = e
    var isHorizontal = this.isHorizontal(this.startEvent, currEvent)
    console.log("!!!!!!!!!!!!!!!" + isHorizontal)
    if (isHorizontal) {
        //一开始没有绑定冒泡时期的catch方法，所以接受不到start的
        page.eventStart(e)
        //水平时让catch事件生效，就可以屏蔽垂直滚动
        page.setData({
            eventStart: "eventStart",
            eventMove: "eventMove",
            eventEnd: "eventEnd",
            eventCancel: "eventCancel",
        })
    } else {
        //垂直滚动了
        this.eventEnd = false
        this.breakOnce()

        page.setData({
            eventStart: "",
            eventMove: "",
            eventEnd: "",
            eventCancel: "",

        })
    }
    this.calculated = true
}
function captureEnd(e) {
    // console.log("捕获阶段：end")
    var page = this.slidersInfo.page
    page.setData({
        eventStart: "",
        eventMove: "",
        eventEnd: "",
        eventCancel: "",

    })
}
function captureCancel(e) {
    // console.log("捕获阶段：cancel")
    var page = this.slidersInfo.page
    page.setData({
        eventStart: "",
        eventMove: "",
        eventEnd: "",
        eventCancel: "",

    })
}




module.exports = {
    init: init,

    captureStart,
    captureMove,
    captureEnd,
    captureCancel,
    captureTap,

    start: start,
    move: move,
    end: end,
    breakOnce: breakOnce,
    close: close,
    closeOther: closeOther,
    open: open,
    cancel: cancel,

    isHorizontal: isHorizontal,
    angle: angle,
    deleteItem: deleteItem,

    updateLayer: updateLayer,
    setLayer: setLayer,
    getSliderWidthByIndex: getSliderWidthByIndex,
    hasSlider: hasSlider,

    clone: clone

}