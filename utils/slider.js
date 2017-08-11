var startLeft = 0
var startX = 0
var startY = 0
var preX = 0
var eventEnd = false



function start(e) {

    // console.log(e)
    if (this.data.slideAnimData == undefined) {
        this.data.left = 0
        this.data.slideAnimData = null
    }

    eventEnd = false;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    startLeft = this.data.left;
}
function move(e) {
    if (eventEnd)
        return

    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - startX;
    var moveY = currY - startY;

    if (moveY > 50)
        end.call(this);


    var deltaX = currX - this.preX;
    // console.log(moveX + "--------" + deltaX)
    this.preX = currX;
    //已经抽出,还往左滑,忽略后面的事件
    if (this.data.left <= -250 && deltaX < 0) {
        startX = currX + 250;
        return
    }
    //已经合上,还往右滑,忽略后面的事件
    if (this.data.left >= 0 && deltaX > 0) {
        startX = currX;
        return
    }

    //基于上一次的位置滑动
    moveX += startLeft;
    //避免快速滑动时两个move事件x距离太大,抽屉滑过头了
    moveX = moveX < -250 ? -250 : moveX
    moveX = moveX > 0 ? 0 : moveX
    this.setData({
        left: moveX
    })


}
function end(e) {
    // console.log(e)
    eventEnd = true
    var endX = this.data.left < -100 ? -250 : 0;
    var moveX = endX == 0 ? -this.data.left : endX - this.data.left

    var res = wx.getSystemInfoSync()
    var a = res.windowWidth / 720;

    moveX *= a;
    // console.log("px:rpx:" + a + "---------------moveX:" + moveX + "------------endX:" + endX + "------------left:" + this.data.left)
    var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
    })

    animation.translate(moveX).step()

    this.setData({
        slideAnimData: animation.export()
    })



}
function cancel(e) {
    // console.log(e)
    end.call(this, e)
}


module.exports = {
    start: start,
    move: move,
    end: end,
    cancel: cancel,


}