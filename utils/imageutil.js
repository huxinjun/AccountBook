
/**
 * 绘制分组的icon
 */
function drawIcon(canvas, groupName, memberIcons,callback) {
    var util = require('/util.js')
    var urls = ['https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',

        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',

        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
        'https://img6.bdstatic.com/img/image/public/sunlinanian.png',

        'https://img6.bdstatic.com/img/image/public/sunlinanian.png'
    ]
    canvas.clearRect(0, 0, util.rpx2px(500), util.rpx2px(500))
    canvas.setFillStyle('#dedede')
    canvas.fillRect(0, 0, util.rpx2px(500), util.rpx2px(500))
    canvas.draw()

    urls.slice()
    urls.forEach(function (v, i) {
        if (i > 8)
            return

        wx.downloadFile({
            url: v, //仅为示例，并非真实的资源
            success: function (res) {
                // var array = [res.tempFilePath]
                // wx.previewImage({
                //   urls: array,
                // })
                var position = calcPosition(urls.length>9?9:urls.length, i, util.rpx2px(500), util.rpx2px(20))
                canvas.drawImage(res.tempFilePath, position[0], position[1], position[2], position[3])
                canvas.draw(true)
                if (i==(urls.length > 9 ? 8 : urls.length-1)){
                    console.log("draw completed:index="+i)
                    setTimeout(function(){
                        wx.canvasToTempFilePath({
                            canvasId: canvas.canvasId,
                            success: function (res) {
                                console.log("save completed:" + res.tempFilePath)
                                if (callback && callback.success)
                                    callback.success(res.tempFilePath)
                            }
                        })
                    },300)
                }
            },
            fail:function(res){
                if (callback && callback.faild)
                    callback.faild()
            }
        })

    })
    
}

function calcPosition(totalCount, index, size, padding) {
    switch (totalCount) {
        case 0:

            break;
        case 1:
            var picSize = size - padding * 2
            return [padding, padding, picSize, picSize]
            break;
        case 2:
            var picSize = (size - padding * 2) / 2
            switch (index) {
                case 0:
                    return [padding, padding, picSize, picSize]
                    break;
                case 1:
                    return [size / 2, size / 2, picSize, picSize]
                    break;
            }
            break;
        case 3:
            var picSize = (size - padding * 3) / 2
            switch (index) {
                case 0:
                    return [(size - picSize) / 2, padding, picSize, picSize]
                    break;
                case 1:
                    return [padding, padding * 2 + picSize, picSize, picSize]
                    break;
                case 2:
                    return [padding * 2 + picSize, padding * 2 + picSize, picSize, picSize]
                    break;
            }
            break;
        case 4:
            var picSize = (size - padding * 3) / 2
            switch (index) {
                case 0:
                    return [padding, padding, picSize, picSize]
                    break;
                case 1:
                    return [padding * 2 + picSize, padding, picSize, picSize]
                    break;
                case 2:
                    return [padding, padding * 2 + picSize, picSize, picSize]
                    break;
                case 3:
                    return [padding * 2 + picSize, padding * 2 + picSize, picSize, picSize]
                    break;
            }
            break;
        case 5:
            var picSize = (size - padding * 4) / 3
            var line1Top = (size - (picSize * 2 + padding)) / 2
            var line2Top = line1Top + picSize + padding
            switch (index) {
                case 0:
                    return [line1Top, line1Top, picSize, picSize]
                    break;
                case 1:
                    return [line2Top, line1Top, picSize, picSize]
                    break;
                case 2:
                    return [padding, line2Top, picSize, picSize]
                    break;
                case 3:
                    return [padding * 2 + picSize, line2Top, picSize, picSize]
                    break;
                case 4:
                    return [padding * 3 + picSize * 2, line2Top, picSize, picSize]
                    break;
            }
            break;
        case 6:
            var picSize = (size - padding * 4) / 3
            var line1Top = (size - (picSize * 2 + padding)) / 2
            var line2Top = line1Top + picSize + padding
            switch (index) {
                case 0:
                    return [padding, line1Top, picSize, picSize]
                    break;
                case 1:
                    return [padding * 2 + picSize, line1Top, picSize, picSize]
                    break;
                case 2:
                    return [padding * 3 + picSize * 2, line1Top, picSize, picSize]
                    break;
                case 3:
                    return [padding, line2Top, picSize, picSize]
                    break;
                case 4:
                    return [padding * 2 + picSize, line2Top, picSize, picSize]
                    break;
                case 5:
                    return [padding * 3 + picSize * 2, line2Top, picSize, picSize]
                    break;
            }
            break;
        case 7:
            var picSize = (size - padding * 4) / 3
            var line1Top = padding
            var line2Top = padding * 2 + picSize
            var line3Top = padding * 3 + picSize * 2
            switch (index) {
                case 0:
                    return [(size - picSize) / 2, line1Top, picSize, picSize]
                    break;
                case 1:
                    return [padding, line2Top, picSize, picSize]
                    break;
                case 2:
                    return [padding * 2 + picSize, line2Top, picSize, picSize]
                    break;
                case 3:
                    return [padding * 3 + picSize * 2, line2Top, picSize, picSize]
                    break;
                case 4:
                    return [padding, line3Top, picSize, picSize]
                    break;
                case 5:
                    return [padding * 2 + picSize, line3Top, picSize, picSize]
                    break;
                case 6:
                    return [padding * 3 + picSize * 2, line3Top, picSize, picSize]
                    break;
            }
            break;
        case 8:
            var picSize = (size - padding * 4) / 3
            var line1Top = padding
            var line2Top = padding * 2 + picSize
            var line3Top = padding * 3 + picSize * 2
            switch (index) {
                case 0:
                    return [(size - picSize * 2 - padding) / 2, line1Top, picSize, picSize]
                    break;
                case 1:
                    return [(size - picSize * 2 - padding) / 2 + picSize + padding, line1Top, picSize, picSize]
                    break;
                case 2:
                    return [padding, line2Top, picSize, picSize]
                    break;
                case 3:
                    return [padding * 2 + picSize, line2Top, picSize, picSize]
                    break;
                case 4:
                    return [padding * 3 + picSize * 2, line2Top, picSize, picSize]
                    break;
                case 5:
                    return [padding, line3Top, picSize, picSize]
                    break;
                case 6:
                    return [padding * 2 + picSize, line3Top, picSize, picSize]
                    break;
                case 7:
                    return [padding * 3 + picSize * 2, line3Top, picSize, picSize]
                    break;
            }
            break;
        case 9:
            var picSize = (size - padding * 4) / 3
            var line1Top = padding
            var line2Top = padding * 2 + picSize
            var line3Top = padding * 3 + picSize * 2
            switch (index) {
                case 0:
                    return [padding, line1Top, picSize, picSize]
                    break;
                case 1:
                    return [padding * 2 + picSize, line1Top, picSize, picSize]
                    break;
                case 2:
                    return [padding * 3 + picSize * 2, line1Top, picSize, picSize]
                    break;
                case 3:
                    return [padding, line2Top, picSize, picSize]
                    break;
                case 4:
                    return [padding * 2 + picSize, line2Top, picSize, picSize]
                    break;
                case 5:
                    return [padding * 3 + picSize * 2, line2Top, picSize, picSize]
                    break;
                case 6:
                    return [padding, line3Top, picSize, picSize]
                    break;
                case 7:
                    return [padding * 2 + picSize, line3Top, picSize, picSize]
                    break;
                case 8:
                    return [padding * 3 + picSize * 2, line3Top, picSize, picSize]
                    break;
            }
            break;

    }
}


module.exports = {
    drawIcon: drawIcon,
    calcPosition: calcPosition
}
