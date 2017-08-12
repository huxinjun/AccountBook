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

    // console.log(this)
    closeAll.call(this)
    var index = e.target.dataset.index
    

    eventEnd = false;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    startLeft = this.data.list[index].left;
    // console.log(startLeft)

    
}
function move(e) {
    if (eventEnd)
        return
    var index = e.target.dataset.index   

    var currX = e.touches[0].pageX;
    var currY = e.touches[0].pageY;
    var moveX = currX - startX;
    var moveY = currY - startY;

    //获取滑动角度
    var a = angle({ X: startX, Y: startY }, { X: currX, Y: currY });
    console.log(a)
    if (Math.abs(a) > 30){
        eventEnd = true
        end.call(this,e)
        return
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
    this.data.list[index].slider = 'left:' + this.data.list[index].left + 'rpx';
    this.setData({
        list: this.data.list
    })

    


}
function end(e) {
    // console.log(e)
    
    eventEnd = true
    var index = e.target.dataset.index
    var endX = this.data.list[index].left < -100 ? -250 : 0;
    
    this.data.list[index].left=endX
    this.data.list[index].slider = 'left:' + this.data.list[index].left+'rpx';
    this.setData({
        list: this.data.list
    })
}

/**
 * 关闭所有打开的抽屉
 */
function closeAll() {
    console.log('closeAll')
    console.log(this)
    var that=this
    this.data.list.forEach(function(v,i){
        
        that.data.list[i].left = 0
        that.data.list[i].slider = 'left:0';
    })

    console.log(this)
    this.setData({
        list: this.data.list
    })
}



function cancel(e) {
    // console.log(e)
    end.call(this, e)
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
    angle: angle


}