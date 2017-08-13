/**
 * 左滑删除
 * Created by xinjun on 2017/8/11 14:10
 */
var startLeft = 0
var startX = 0
var startY = 0
var preX = 0
var eventEnd = false



function start(e) {

    closeAll.call(this)
    var index = e.target.dataset.index


    eventEnd = false;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    startLeft = this.data.list[index].left;
    // console.log(startLeft)


}

/**
 * 移动时触发，checkAngle表示是不是需要检查角度
 */
function move(e, checkAngle) {
    if (eventEnd)
        return
    var index = e.target.dataset.index

    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - startX;
    var moveY = currY - startY;

    if (checkAngle) {
        //获取滑动角度
        var a = angle({ X: startX, Y: startY }, { X: currX, Y: currY });
        console.log(a)
        if (Math.abs(a) > 15) {
            eventEnd = true
            closeAll.call(this)
            return
        }

    }



    var deltaX = currX - this.preX;
    this.preX = currX;


    //已经抽出,还往左滑,忽略后面的事件
    if (this.data.list[index].left <= -250 && deltaX < 0)
        return

    //已经合上,还往右滑,忽略后面的事件
    if (this.data.list[index].left >= 0 && deltaX > 0)
        return


    //基于上一次的位置滑动
    moveX += startLeft;
    // console.log("-------------" + moveX)
    //避免快速滑动时两个move事件x距离太大,抽屉滑过头了
    moveX = moveX < -250 ? -250 : moveX
    moveX = moveX > 0 ? 0 : moveX

    this.data.list[index].left = moveX
    this.data.list[index].itemStyle = 'left:' + this.data.list[index].left + 'rpx';
    this.setData({
        list: this.data.list
    })




}
function end(e) {
    // console.log(e)

    eventEnd = true
    var index = e.target.dataset.index
    var endX = this.data.list[index].left < -100 ? -250 : 0;

    this.data.list[index].left = endX
    this.data.list[index].itemStyle = 'left:' + this.data.list[index].left + 'rpx;transition: left 0.2s ease ';
    this.setData({
        list: this.data.list
    })
}

/**
 * 关闭所有打开的抽屉
 */
function closeAll() {
    // console.log('closeAll')
    var that = this
    this.data.list.forEach(function (v, i) {

        that.data.list[i].left = 0
        that.data.list[i].itemStyle = 'left:0;transition:all 0.2s ease ';
    })

    this.setData({
        list: this.data.list
    })
}



function cancel(e) {
    // console.log(e)
    end.call(this, e)
}


//点击删除按钮事件
function deleteItem(e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var list = this.data.list;

    // this.data.list[index].containerStyle = 'opacity:0;transition:all 0.5s ease';
    // debugger
    // setTimeout(function () {
    //     console.log()
    //     this.data.list[index].containerStyle = 'height:0;transition:all 0.5s ease';
    //     this.setData({
    //         list: list
    //     });
    // }.bind(this), 500)
    // style = "{{item.containerStyle}}"


   
    var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
    })
    animation.opacity(0).step().height(0).step()


    list[index].deleteAnimData = animation.export()
    
    this.setData({
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
    start: start,
    move: move,
    end: end,
    cancel: cancel,
    angle: angle,
    deleteItem: deleteItem


}