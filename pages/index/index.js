//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World123',
        xinjun: 'hjuxinjun',
        tab_main_src: '/img/main_press.png',
        tab_me_src: '/img/me.png',
        currTab: 0,

        text_color_home: '#2BA245',
        text_color_me: '#272636',

        userInfo: {},


        list: [1, 2, 3]

    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
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

    }
})
