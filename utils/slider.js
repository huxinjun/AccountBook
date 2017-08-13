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
/**抽屉内容大小 */
var sliderWidth=0
/**page对象 */
var page
/**是否检查手势水平角度 */
var checkAngle

//-----------------------------------------------------------------------------------------------

/**
 * ！！！使用require实例化时务必调用init方法初始化需要的参数
 * page：page对象
 * sliderWidth：抽屉内容的大小，不要超出父容器宽度
 * checkAngle：是否要检查水平滑动的角度，默认大于15度将认为抽屉时间中断
 */
function init(page, sliderWidth,checkAngle) {
    this.page=page
    this.sliderWidth = sliderWidth
    this.checkAngle = checkAngle

    return this
}

/**
 * 按下时触发
 */
function start(e) {

    this.closeAll()
    var index = e.target.dataset.index


    this.eventEnd = false;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.startLeft = this.page.data.list[index].left;
    // console.log(startLeft)


}

/**
 * 移动时触发
 */
function move(e, checkAngle) {
    if (this.eventEnd)
        return
        
    var index = e.target.dataset.index

    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - this.startX;
    var moveY = currY - this.startY;

    if (checkAngle) {
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
    if (this.page.data.list[index].left <= -250 && deltaX < 0)
        return

    //已经合上,还往右滑,忽略后面的事件
    if (this.page.data.list[index].left >= 0 && deltaX > 0)
        return


    //基于上一次的位置滑动
    moveX += this.startLeft;
    // console.log("-------------" + moveX)
    //避免快速滑动时两个move事件x距离太大,抽屉滑过头了
    moveX = moveX < -this.sliderWidth ? -this.sliderWidth : moveX
    moveX = moveX > 0 ? 0 : moveX
    
    this.page.data.list[index].left = moveX
    this.page.data.list[index].itemStyle = 'left:' + this.page.data.list[index].left + 'rpx';
    this.page.setData({
        list: this.page.data.list
    })




}

/**
 * 结束时触发
 */
function end(e) {
    // console.log(e)

    this.eventEnd = true
    var index = e.target.dataset.index
    var endX = this.page.data.list[index].left < -this.sliderWidth / 3 ? -this.sliderWidth : 0;

    this.page.data.list[index].left = endX
    this.page.data.list[index].itemStyle = 'left:' + (this.page.data.list[index].left+3) + 'rpx;transition: left 0.2s ease ';
    this.page.setData({
        list: this.page.data.list
    })
}

/**
 * 关闭所有打开的抽屉
 */
function closeAll() {
    // console.log('closeAll')
    var that=this
    this.page.data.list.forEach(function (v, i) {

        that.page.data.list[i].left = 0
        that.page.data.list[i].itemStyle = 'left:0;transition:all 0.2s ease ';
    })

    this.page.setData({
        list: this.page.data.list
    })
}

/**
 * 关闭某个索引的抽屉
 */
function close(index) {
    this.page.data.list[index].itemStyle = 'left:0rpx;transition: left 0.2s ease ';
    this.page.setData({
        list: this.page.data.list
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
function deleteItem(e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var list = this.page.data.list;

    var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
    })
    animation.opacity(0).step().height(0).step()


    list[index].deleteAnimData = animation.export()
    
    page.setData({
        list: list
    });
    /**
     * 删除数据：有一个bug没法解决，暂时不删除dom中的元素了
     * bug:删除index的数据，更新dom后，界面上该index下一个元素有本次的动画style,导致下一个（即将成为本item）item
     * 的opacity和height都是0,看不见了
     */
    // setTimeout(function () {
    //     console.log("setTimeout删除："+index)
    //     console.log(this)
        
    //     //移除列表中下标为index的项
    //     list.splice(index, 1);
    //     this.data.list[index].containerStyle = 'transition:all 0.5s ease !important';
    //     //更新列表的状态
    //     this.setData({
    //         list: list
    //     });
        

    // }.bind(this), 700)
    
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
    close:close,
    closeAll:closeAll,
    cancel: cancel,
    angle: angle,
    deleteItem: deleteItem


}