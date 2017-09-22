//index.js
//获取应用实例
var dialog = require("../../utils/dialog.js")
var APP = getApp()
Page({

    data: {
        firendId:"",
        containerHeight: APP.systemInfo.windowHeight,
        dialog:"display:none;",

        list: [
            {
                "id":0,
                "name":"吃饭",
                "icon":"/img/type/gray_food.png"
            }, 
            {
                "id": 1,
                "name": "租房",
                "icon": "/img/type/gray_housing.png"
            },
            {
                "id": 2,
                "name": "公交",
                "icon": "/img/type/gray_traffic.png"
            },
            {
                "id": 3,
                "name": "打车",
                "icon": "/img/type/gray_car.png"
            },
            {
                "id": 4,
                "name": "信用卡还钱",
                "icon": "/img/type/gray_refund.png"
            },
            {
                "id": 5,
                "name": "请客",
                "icon": "/img/type/gray_gam.png"
            },
            {
                "id": 6,
                "name": "零食",
                "icon": "/img/type/gray_snacks.png"
            },
            {
                "id": 6,
                "name": "购物",
                "icon": "/img/type/gray_shopping.png"
            },
            {
                "id": 7,
                "name": "其他",
                "icon": "/img/type/gray_other.png"
            }

        ],
    },


    testShowDialog:function(e){
        var dialogInfo = {
            page: this,
            title: "标题",
            content: "提示文字",
            inputType: "number",
            maxLength: 3,
            callback: {
                onConfirm: function (formId,inputValue) {
                    console.log("testShowDialog.formId:" + formId)
                    console.log("testShowDialog.inputValue:" + inputValue)
                 },
                onCancel: function () { }
            }
        }

        dialog.showDialog(dialogInfo)

    },

    
    onLoad: function (option) {
        var that = this
        this.setData({
            list:this.data.list
        })

        console.log(option)
        if (option.friendId)
            addFriend(option.friendId)
            
        
    },

    /**
     * 添加好友
     */
    addFriend:function(friendId){
        //查询目标好友昵称
        APP.ajax({
            url: APP.globalData.BaseUrl + "/user/",
            data: {
                groupId: option.groupId,
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS)
                    this.setData({
                        qrImageUrl: APP.getImageUrl(res.data.msg)
                    })
            }


        }, this)


        this.data.firendId = option.friendId
        var dialogInfo = {
            page: this,
            title: "提示",
            content: "确定加",
            callback: {
                onConfirm: function (formId) { },
                onCancel: function () { }
            }
        }

        dialog.showDialog(dialogInfo)
    },



    

    
    /**
     * 邀请用户
     */
    inviteUser: function (e) {
        var that=this
        this.dialogDissmiss()
        wx.login({
            success: function (res) {
                APP.ajax({
                    url: APP.globalData.BaseUrl + "/user/invite",
                    data: {
                        formId: e.detail.formId,
                        token: wx.getStorageSync('token'),
                        code: res.code,
                        openid: that.data.firendId
                    },
                    success: function (res) {

                    }

                }, this)
            }
        })

    },
})

