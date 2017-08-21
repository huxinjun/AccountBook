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
function getSliderWidthByIndex(layerIndex) {

    if (!this.hasSlider(layerIndex))
        return 0
    var width = 0;
    this.slidersInfo.layers[layerIndex].buttons.forEach(function (v, i) {
        width += v.width
    })
    return width;
}
/**
 * 获取数组数据中配置的layer索引
 * index:item索引
 */
function getLayerIndexByIndex(index) {
    return this.slidersInfo.page.data.datas[index].layerIndex
}

/**
 * 检查配置的信息是否能拉开
 * index:item索引
 */
function hasSlider(layerIndex) {

    if (this.slidersInfo.layers == undefined ||
        this.slidersInfo.layers.length == 0 ||
        this.slidersInfo.layers[layerIndex].buttons == undefined ||
        this.slidersInfo.layers[layerIndex].buttons.length == 0) {

        return false
    }
    return true
}

/**
 * 设置当前要显示的slider
 * index:item索引
 * layerIndex：layer索引
 */
function setLayer(item, layerIndex) {
    item.layerIndex = layerIndex
    //配置可拖动视图
    if (!this.hasSlider(layerIndex)) {
        //没有配置任何状态层，不需要拉开
        item.styleWidth = "width:750rpx;"
        return
    }
    item.styleWidth = "width:752rpx;"
    //更新界面绑定的数据
    var p1 = "width:" + this.getSliderWidthByIndex(layerIndex) + "rpx;"
    var p2 = "height:" + this.slidersInfo.height + "rpx;"
    var p3 = "line-height:" + this.slidersInfo.height + "rpx;"
    var p4 = "vertical-align:middle;"
    var p5 = "text-align:center;"


    item.sliderStyle = p1 + p2 + p3 + p4 + p5


    var that = this

    //处理每一种状态元素的element.style
    this.slidersInfo.layers.forEach(function (outterValue, outterIndex) {

        if (outterValue.buttons == undefined)
            return
        var right = 0

        outterValue.buttons.forEach(function (innerValue, innerIndex) {

            var p1 = "height:" + that.slidersInfo.height + "rpx; "
            var p2 = "width:" + innerValue.width + "rpx;"
            var p3 = "color:" + innerValue.color + ";"
            var p4 = "background-color:" + innerValue.colorBg + ";"
            var p5 = "text-shadow:2rpx 2rpx 1rpx " + innerValue.colorShadow + ";"
            var p6 = "position: absolute;"
            var p7 = "top:0;"
            var p8 = "right:" + right + "rpx;"
            right += innerValue.width;
            //是否显示
            var p9 = outterIndex != layerIndex ? "display:none;" : "display:inherit;"
            var p10 = "border-top:" + innerValue.borderTop

            var styleName = "layerStyle_" + outterIndex + "_" + innerIndex
            var tapName = "layerTap_" + outterIndex + "_" + innerIndex
            var styleValue = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10

            item[styleName] = styleValue
            item[tapName] = innerValue.onClick
        })
    })




}

/**
 * 按下时触发
 */
function start(e) {
    var index = e.target.dataset.index
    if (!this.hasSlider(this.getLayerIndexByIndex(index)))
        return
    this.closeAll()

    // console.log(e)

    this.eventEnd = false;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.startLeft = this.slidersInfo.page.data.datas[index].left;
    // console.log(startLeft)


}

/**
 * 移动时触发
 */
function move(e, checkAngle) {
    var index = e.target.dataset.index

    if (!this.hasSlider(this.getLayerIndexByIndex(index)))
        return
    if (this.eventEnd)
        return



    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - this.startX;
    var moveY = currY - this.startY;


    if (this.slidersInfo.checkAngle) {
        //获取滑动角度
        var a = angle({ X: this.startX, Y: this.startY }, { X: currX, Y: currY });
        console.log(a)
        if (Math.abs(a) > 15) {
            this.eventEnd = true
            this.closeAll()
            return
        }

    }



    var deltaX = currX - this.preX;
    this.preX = currX;


    //已经抽出,还往左滑,忽略后面的事件
    if (this.slidersInfo.page.data.datas[index].left <= -250 && deltaX < 0)
        return

    //已经合上,还往右滑,忽略后面的事件
    if (this.slidersInfo.page.data.datas[index].left >= 0 && deltaX > 0)
        return


    //基于上一次的位置滑动
    moveX += this.startLeft;
    // console.log("-------------" + moveX)
    //避免快速滑动时两个move事件x距离太大,抽屉滑过头了
    moveX = moveX < -this.getSliderWidthByIndex(this.getLayerIndexByIndex(index)) ? -this.getSliderWidthByIndex(this.getLayerIndexByIndex(index)) : moveX
    moveX = moveX > 0 ? 0 : moveX

    this.slidersInfo.page.data.datas[index].left = moveX
    this.slidersInfo.page.data.datas[index].styleLeft = 'left:' + this.slidersInfo.page.data.datas[index].left + 'rpx';
    this.slidersInfo.page.setData({
        datas: this.slidersInfo.page.data.datas
    })




}

/**
 * 结束时触发
 */
function end(e) {
    var index = e.target.dataset.index

    if (!this.hasSlider(this.getLayerIndexByIndex(index)))
        return

    this.eventEnd = true

    var isOpen = this.slidersInfo.page.data.datas[index].left < -this.getSliderWidthByIndex(this.getLayerIndexByIndex(index)) / 3 ? true : false;

    console.log(this.slidersInfo.page.data.datas[index].left)

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
    var that = this
    this.slidersInfo.page.data.datas.forEach(function (v, i) {
        that.slidersInfo.page.data.datas[i].left = 0
        that.slidersInfo.page.data.datas[i].styleLeft = 'left:0;transition:all 0.2s ease ';
    })

    this.slidersInfo.page.setData({
        datas: this.slidersInfo.page.data.datas
    })
}

/**
 * 关闭某个索引的抽屉
 */
function close(index) {
    this.slidersInfo.page.data.datas[index].left = 0
    this.slidersInfo.page.data.datas[index].styleLeft = 'left:0rpx;transition: left 0.2s ease ';
    this.slidersInfo.page.setData({
        datas: this.slidersInfo.page.data.datas
    })
}
/**
 * 关闭某个索引的抽屉
 */
function open(index) {
    this.slidersInfo.page.data.datas[index].left = -this.getSliderWidthByIndex
    this.slidersInfo.page.data.datas[index].styleLeft = 'left:' + -this.getSliderWidthByIndex(this.getLayerIndexByIndex(index)) + 'rpx;transition: left 0.2s ease ';
    this.slidersInfo.page.setData({
        datas: this.slidersInfo.page.data.datas
    })
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
 * 点击删除按钮事件
 */
function deleteItem(index) {
    var datas = this.slidersInfo.page.data.datas;

    datas[index].styleBorder = "border:none;"
    var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
    })

    animation.opacity(0).step().height(0).step()


    datas[index].deleteAnimData = animation.export()


    this.slidersInfo.page.setData({
        datas: datas
    });

    // setTimeout(function () {
    //     datas[index].deleteAnimData=null
    //     this.slidersInfo.page.setData({
    //         datas: datas
    //     });
    // }.bind(this), 550)
    /**
     * 删除数据：有一个bug没法解决，暂时不删除dom中的元素了
     * bug:删除index的数据，更新dom后，界面上该index下一个元素有本次的动画style,导致下一个（即将成为本item）item
     * 的opacity和height都是0,看不见了
     */
    // setTimeout(function () {
    //     console.log("setTimeout删除："+index)
    //     console.log(this)

    //     //移除列表中下标为index的项
    //     datas.splice(index, 1);

    //     //更新列表的状态
    //     this.slidersInfo.page.setData({
    //         datas: datas
    //     });
    // }.bind(this), 800)
}

/**
 * 点击删除按钮事件:transition动画
 */
function deleteItem2(index) {
    var datas = this.slidersInfo.page.data.datas;

    //先是透明度动画
    datas[index].styleBorder = "border:none;"
    datas[index].deleteTrans = "alpha:1;transition:all 0.2s ease;"

    this.slidersInfo.page.setData({
        datas: datas
    });
    //继续进行高度动画
    setTimeout(function () {
        datas[index].deleteTrans = "height:0;transition:all 0.3s ease;"
        this.slidersInfo.page.setData({
            datas: datas
        });
        //最后删除元素
        setTimeout(function () {
            console.log("setTimeout删除：" + index)
            console.log(this)

            //移除列表中下标为index的项
            datas.remove(index, 1);

            //更新列表的状态
            this.slidersInfo.page.setData({
                datas: datas
            });
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




module.exports = {
    init: init,

    start: start,
    move: move,
    end: end,
    breakOnce: breakOnce,
    close: close,
    closeAll: closeAll,
    open: open,
    cancel: cancel,
    angle: angle,
    deleteItem: deleteItem,
    deleteItem2: deleteItem2,

    setLayer: setLayer,
    getSliderWidthByIndex: getSliderWidthByIndex,
    getLayerIndexByIndex: getLayerIndexByIndex,
    hasSlider: hasSlider

}