var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight
    },


    /**
     * 点击展开或合上成员付款详情的按钮
     */
    onMembersPullDownClick: function (e) {
        console.log("onMembersPullDownClick")

        var index = e.target.dataset.index
        var account = this.data.accounts[index]
        account.value.showMemberDetail = !account.value.showMemberDetail

        if (account.value.showMemberDetail) {
            account.style.membersSimpleOpacity = "opacity:0;"
            account.style.membersDetailHeight = "height:" + (account.members.length * 60) + "rpx;"
            account.style.membersPullDownTrans = "transform: rotate(180deg);"
        } else {
            account.style.membersSimpleOpacity = "opacity:1;"
            account.style.membersDetailHeight = "height:0;"
            account.style.membersPullDownTrans = "transform: rotate(0deg);"
        }

        this.setData({
            accounts: this.data.accounts
        })
    },

    /**
     * 点击全文按钮
     */
    onShowAllContentClick: function (e) {
        var index = e.target.dataset.index
        var account = this.data.accounts[index]
        account.value.isShowAllContent = !account.value.isShowAllContent

        if (account.value.isShowAllContent){
            //已经显示全部文字了,点击后显示部分文字
            account.description = account.descriptionSimple
            account.value.allContentBtnText = "展开"
        }else{
            account.description = account.descriptionFull
            account.value.allContentBtnText = "合上"
        }
        this.setData({
            accounts: this.data.accounts
        })
    },


    onLoad: function (option) {

        var that = this

        this.initAccounts()

    },

    /**
     * 初始化账目列表数据
     */
    initAccounts: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/get',
            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                res.data.accounts.forEach(function (v, i) {
                    v.style = {}
                    v.value = {
                        //成员详情是否显示标记
                        showMemberDetail: false
                    }

                    //类型图标处理
                    v.icon = APP.globalData.typeList.findByAttr("id", v.type).icon

                    //描述内容处理
                    var maxLength = 40
                    if (v.description.length > maxLength) {
                        v.value.showAllContentBtn = true
                        v.descriptionFull = v.description
                        v.descriptionSimple = v.descriptionFull.substr(0, maxLength) + "..."
                        v.description = v.descriptionSimple
                        v.value.isShowAllContent = false
                        v.value.allContentBtnText="展开"
                    } else
                        v.value.showAllContentBtn = false


                    //付款方案中加入需要的用户头像
                    if (v.payResult && v.payResult[0]) {
                        v.payResult[0].payTarget.forEach(function (target, index) {
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










