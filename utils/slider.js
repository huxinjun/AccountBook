/**
 * 左滑删除
 * Created by xinjun on 2017/8/11 14:10
 */
/**按下时item的left */
var startLeft = 0
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
        width += visible?v.width:0
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
    var result=false
    item.value.layerInfo.buttons.forEach(function (v, i) {
      if(result)
        return
      if(v.visible)
        result=true
    })
    return result
}
/**
 * 配置特有的layer,layerInfo中的属性将会覆盖声明的LayerInfo
 */
function updateLayer(index, newInfo) {
    var item = this.slidersInfo.page.getSliderData(index)

    if (newInfo==undefined){
        console.log("删除layerInfo属性")
        delete item.value.layerInfo
        return
    }
    //覆盖属性
    item.value.layerInfo.buttons.overide(newInfo)
    //重写更新界面关联的属性
    this.setLayer(index)
    //更新界面
    this.slidersInfo.page.refreshSliderData()
}
/**
 * 设置当前要显示的slider
 * index:item索引
 * layerIndex：layer索引
 */
function setLayer(index, layerIndex) {

    var item = this.slidersInfo.page.getSliderData(index)

    if(item.value==undefined)
        item.value={}
    if (item.style == undefined)
        item.style = {}

    //复制一个layer对象,为的是每个item之后可以更新layer的状态
    if (layerIndex!=undefined){
        item.value.layerInfo = clone(this.slidersInfo.layers[layerIndex])
        item.value.layerIndex = layerIndex
    }

    //配置可拖动视图
    if (!this.hasSlider(index)) {
        //没有配置任何状态层，不需要拉开
        return
    }
    //更新界面绑定的数据
    var p1 = "width:" + this.getSliderWidthByIndex(index) + "rpx;"
    var p2 = "height:" + this.slidersInfo.height + "rpx;"
    var p3 = "line-height:" + this.slidersInfo.height + "rpx;"
    var p4 = "vertical-align:middle;"
    var p5 = "text-align:center;"

    
    var p6 = "position:absolute;top:0;"
    var left = 750 - this.getSliderWidthByIndex(index)
    var p7 = "left:" + left + "rpx;"


    item.style.sv = "width:750rpx;position:relative;"
    item.style.sv_main = "z-index:1;position: relative;"
    //ph:placeholder占位
    item.style.sv_ph = p1 + p2+"position:absolute;left:750rpx;top:0;opacity:0;"
    item.style.sv_slider = p1 + p2 + p3 + p4 + p5 + p6
    item.style.sv_slider_left = p7
    item.value.sv_slider_left=left

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

            

            var p1 = "height:" + that.slidersInfo.height + "rpx; "
            var p2 = "width:" + innerValue.width + "rpx;"
            var p3 = "color:" + innerValue.color + ";"
            var p4 = "background-color:" + innerValue.colorBg + ";"
            var p5 = "text-shadow:2rpx 2rpx 1rpx " + innerValue.colorShadow + ";"
            var p6 = "position: absolute;"
            var p7 = "top:0;"
            var p8 = "right:" + right + "rpx;"
            var visible = innerValue.visible
            visible=visible==undefined?true:visible
            right += visible?innerValue.width:0;
            //是否显示
            var p9 = outterIndex != item.value.layerIndex ? "display:none;" : "display:" + (visible?"inherit":"none") +";"

            var p10 = "border-top:" + innerValue.borderTop +";"
            var p11 = "font-size:28rpx;"

            var styleName = "layerStyle_" + outterIndex + "_" + innerIndex
            var tapName = "layerTap_" + outterIndex + "_" + innerIndex
            var textName = "layerText_" + outterIndex + "_" + innerIndex
            var styleValue = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11

            item.style[styleName] = styleValue
            item.value[tapName] = innerValue.onClick
            item.value[textName] = innerValue.text
        })
    })
}





/**
 * 按下时触发
 */
function start(e) {
    var index = e.target.dataset.index
    var item = this.slidersInfo.page.getSliderData(index)

    if (!this.hasSlider(index))
        return
    this.closeAll()

    // console.log(e)

    this.eventEnd = false;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;

    this.startLeft = item.value.left;
    // console.log(startLeft)


}

function scroll(e){
    var index = e.target.dataset.index
    var scrollLeft = e.detail.scrollLeft
    var item = this.slidersInfo.page.getSliderData(index)

    var currLeft = item.value.sv_slider_left + scrollLeft 
    console.log( "sv_slider_left--------" + item.value.sv_slider_left) 
  console.log(scrollLeft+"--------"+currLeft)    
    
    var leftStr = "left:" + currLeft + "rpx;"
    item.style.sv_slider_left = leftStr
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

    var isOpen = item.value.left < -this.getSliderWidthByIndex(index) / 3 ? true : false;

    // console.log(item.value.left)

    if (isOpen)
        this.open(index)
    else
        this.close(index)
}

/**
 * 关闭所有打开的抽屉
 */
function closeAll() {
    // console.log('closeAll')
    var datas = this.slidersInfo.page.getSliderData()
    var that = this
    datas.forEach(function (v, i) {
        v.value.left = 0
        v.style.left = 'left:0;transition:all 0.2s ease ';
    })

    this.slidersInfo.page.refreshSliderData()
}

/**
 * 关闭某个索引的抽屉
 */
function close(index) {
    var item = this.slidersInfo.page.getSliderData(index)

    item.value.left = 0
    item.style.left = 'left:0rpx;transition: left 0.2s ease ';
    this.slidersInfo.page.refreshSliderData()
}
/**
 * 关闭某个索引的抽屉
 */
function open(index) {
    var item = this.slidersInfo.page.getSliderData(index)

    item.value.left = -this.getSliderWidthByIndex(index)
    item.style.left = 'left:' + -this.getSliderWidthByIndex(index) + 'rpx;transition: left 0.2s ease ';
    this.slidersInfo.page.refreshSliderData()
}

/**
 * 强制中断本次抽屉事件
 */
function breakOnce() {
    if (this.eventEnd)
        return
    this.eventEnd = true
    this.closeAll()
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
                v.value.left = 0
                v.style.left = ""
            })
            //更新列表的状态
            this.slidersInfo.page.refreshSliderData()
        }.bind(this), 300)

    }.bind(this), 200)

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
    if (null == obj || "object" != typeof obj){
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




module.exports = {
    init: init,

    start: start,
    scroll: scroll,
    end: end,
    breakOnce: breakOnce,
    close: close,
    closeAll: closeAll,
    open: open,
    cancel: cancel,
    angle: angle,
    deleteItem: deleteItem,

    updateLayer: updateLayer,
    setLayer: setLayer,
    getSliderWidthByIndex: getSliderWidthByIndex,
    hasSlider: hasSlider,

    clone:clone

}