//index.js
//获取应用实例
var slider = require('../../utils/slider.js')
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        tab_main_src: '/img/main_press.png',
        tab_me_src: '/img/me.png',
        currTab: 0,

        text_color_home: '#2BA245',
        text_color_me: '#272636',

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
            },
            {
                "value": 'D'
            },
            {
                "value":'E'
            },
            {
                "value": 'F'
            },
            {
                "value": 'G'
            },
            {
                "value": 'H'
            },
            {
                "value": 'I'
            },
            {
                "value": 'J'
            },
            {
                "value": 'K'
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
            this.data.list.push(this.data.list.length);
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
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
        
    },

    onTabMainSelected: function () {
        console.log("选择主页了")
    },
    onTabMeSelected: function () {
        console.log("选择我的了")
        wx.navigateTo({
            url: '/pages/find_friend/find_friend?id=nimade',
        })

    },

    tabMainClick: function () {

        if (this.data.currTab != 0) {
            this.setData({
                tab_main_src: '/img/main_press.png',
                tab_me_src: '/img/me.png',
                text_color_home: '#2BA245',
                text_color_me: '#272636'

            })
            this.data.currTab = 0;
            this.onTabMainSelected();
        }

    },

    tabMeClick: function () {

        if (this.data.currTab != 1) {
            this.setData({
                tab_main_src: '/img/main.png',
                tab_me_src: '/img/me_press.png',
                text_color_home: '#272636',
                text_color_me: '#2BA245'
            })
            this.data.currTab = 1;
            this.onTabMeSelected();
        }

    },

 
    touchstart:function(e){
        slider.start.call(this,e)
    },
    touchmove: function (e) {
        slider.move.call(this, e)
    },
    touchend: function (e) {
        slider.end.call(this, e)
    },
    touchcancel:function(e){
        slider.cancel.call(this, e)
    }

})

