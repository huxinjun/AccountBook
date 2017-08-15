//index.js
//获取应用实例
var APP = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},


        list: [
            {
                "value":'A'
            },
            {
                "value": 'B'
            },
            {
                "value": 'C'
            }

        ],
    },

    //点击删除按钮事件
    delete: function (e) {
        //获取列表中要删除项的下标
        var index = e.target.dataset.index;
        var list = this.data.list;
        //移除列表中下标为index的项
        list.splice(index, 1);
        //更新列表的状态
        this.setData({
            list: list
        });
    },


    onPullDownRefresh: function () {
        
        console.log("r");
        for (let i = 0; i < 6; i++) {
            this.data.list.push({
                "value": 'add'
            });
            console.log("push");
        }
        this.setData({
            list: this.data.list
        });
        wx.stopPullDownRefresh();
    },




    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },


    
    onLoad: function () {
        console.log('onLoad')
        var that = this
        
        //调用应用实例的方法获取全局数据
        APP.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
        
    }
})

