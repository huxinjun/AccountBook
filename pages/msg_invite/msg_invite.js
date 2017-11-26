//index.js
//获取应用实例
var slider
var APP = getApp()
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,
        datas:null

    },

    slidersInfo : {
        //N种状态
        layers: [
            {
                name: "状态一",
                //条目高度
                height: 100,
                buttons: [
                    {
                        text: "接受",
                        color: "white",
                        colorBg: "#2ba245",
                        colorShadow: "black",
                        onClick: "acceptInvite",
                        width: 150,
                        visible: true
                    },
                    {
                        text: "拒绝",
                        color: "white",
                        colorBg: "#cdcdcd",
                        colorShadow: "black",
                        onClick: "refuseInvite",
                        width: 150,
                        visible: true
                    }
                ]
            },
            {
                name: "状态二",
                //条目高度
                height: 100,
                buttons: [
                    {
                        text: "删除",
                        color: "white",
                        colorBg: "#f00",
                        colorShadow: "black",
                        onClick: "_delete",
                        width: 150,
                        visible: true
                    }
                ]
            },
            {
                name: "状态三",
                //条目高度
                height: 200
            }
        ]
    },

    getSliderData:function(index){
        if(index==undefined)
            return this.data.datas
        return this.data.datas[index]
    },
    refreshSliderData: function () {
        this.setData({
            datas:this.data.datas
        })
    },



    //点击删除按钮事件
    _delete: function (e) {
        console.log("delete")
        var index = e.target.dataset.index
        slider.updateLayer(index,[
            {
                text:"成功!!!"
            }
        ])
        // this.option(e, "delete")
    },

    acceptInvite: function (e) {
        this.option(e, "accept")
    },
    refuseInvite: function (e) {
        this.option(e, "refuse")
    },

    option: function (e, opt) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/invite/' + opt,

            data: {
                token: wx.getStorageSync("token"),
                msgId: this.data.datas[e.target.dataset.index].id
            },

            success: function (res) {
                var index = e.target.dataset.index
                switch (res.data.status) {
                    case APP.globalData.resultcode.SUCCESS:
                        var item = this.data.datas[index]
                        slider.setLayer(item, 1)
                        if (opt == "accept") {
                            item.state = 11
                            item.stateStr = "已接受"
                        } else if (opt == "refuse"){
                            item.state = 12
                            item.stateStr = "已拒绝"
                        }else{
                            slider.deleteItem(index)
                            return
                        }
                        slider.close(index)
                        break;
                    case APP.globalData.resultcode.INVALID_COMMAND:
                        //已经是好友关系了
                        slider.close(index)
                        break;
                }


            }

        }, this)

    },



    onLoad: function () {
        console.log('onLoad')
        var that = this

        this.slidersInfo.page = this
        slider = require('../../utils/slider.js').init(this.slidersInfo)
        this.initData()
    },

    onShow: function (options) {
        console.log('onShow')
        //切换页面时候需要重新初始化slider,因为require获取的是同一个对象
        slider.init(this.slidersInfo)
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/invite',

            data: {
                token: wx.getStorageSync("token"),
                /**type必须:1帐友邀请,2加入组邀请*/
                type:1
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS) {
                    this.data.datas = res.data.datas
                    res.data.datas.forEach(function (v, i) {
                      
                        switch (v.state) {
                            case 0:
                            case 1:
                                slider.setLayer(i,0)
                                break;
                            case 11:
                                v.stateStr = "已接受"
                                slider.setLayer(i,1)
                                break;
                            case 12:
                                v.stateStr = "已拒绝"
                                slider.setLayer(i,1)
                                break;
                        }

                    })
                    this.refreshSliderData()
                }

            }
        }, this)
    },
})














