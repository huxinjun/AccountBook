var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,
        //苹果手机textArea有自带的padding,导致内容和上面的标题等左对不齐,只能通过特殊方法margin来适配
        iphone:""
    },

    onLoad: function (option) {
        
        var that=this
        var isiphone = APP.globalData.isiphone
        console.log("是否iphone:" + isiphone)
        if (isiphone)
            that.setData({
                iphone: "iphone"
            })

        this.initAccounts()
        
    },

    /**
     * 初始化账目列表数据
     */     
    initAccounts:function(){
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/get',
            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                res.data.accounts.forEach(function(v,i){
                    v.icon=APP.globalData.typeList.findByAttr("id",v.type).icon

                    if (v.payResult && v.payResult[0]){
                        v.payResult[0].payTarget.forEach(function(target,index){
                            target.paidIcon = v.members.findByAttr("memberId", target.paidId).memberIcon
                            target.receiptIcon = v.members.findByAttr("memberId", target.receiptId).memberIcon
                        })
                    }
                })
                this.setData({
                    accounts: res.data.accounts
                })

                console.log(res.data.accounts)
            }

        }, this)
    }

})










