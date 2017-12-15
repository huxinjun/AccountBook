var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,
        accountId: null,
        visible:"display:none;"
    },


    /**
     * 点击展开或合上成员付款详情的按钮
     */
    onMembersPullDownClick: function (e) {
        console.log("onMembersPullDownClick")

        var account = this.data.account
        account.value.showMemberDetail = !account.value.showMemberDetail

        if (account.value.showMemberDetail) {
            account.style.membersSimpleOpacity = "opacity:0;"
            account.style.membersDetailHeight = "height:" + (account.membersLength * 80) + "rpx;opacity:1;"
            account.style.membersPullDownTrans = "transform: rotate(180deg);"
        } else {
            account.style.membersSimpleOpacity = "opacity:1;"
            account.style.membersDetailHeight = "height:0;opacity:0;"
            account.style.membersPullDownTrans = "transform: rotate(0deg);"
        }

        this.setData({
            account: this.data.account
        })
    },

    /**
     * 点击全文按钮
     */
    onShowAllContentClick: function (e) {
        var account = this.data.account
        account.value.isShowAllContent = !account.value.isShowAllContent

        if (account.value.isShowAllContent) {
            //已经显示全部文字了,点击后显示部分文字
            account.description = account.descriptionSimple
            account.value.allContentBtnText = "展开"
        } else {
            account.description = account.descriptionFull
            account.value.allContentBtnText = "合上"
        }
        this.setData({
            account: this.data.account
        })
    },


    /**
     * 点击删除按钮
     */
    onDeleteClick:function(e){
        var that=this
        var dialogInfo = {
            page: this,
            title: "提示",
            content: "确定要删除这个账单吗?删除后将不可恢复!",
            contentColor:"color:#f00;",
            callback: {
                onConfirm: function () {
                    //请求服务器删除
                    APP.ajax({
                        url: APP.globalData.BaseUrl + '/account/delete',
                        data: {
                            token: wx.getStorageSync("token"),
                            accountId: that.data.accountId
                        },
                        success: function (res) {
                            wx.showToast({
                                title: res.data.msg
                            })
                            wx.navigateBack()
                        }

                    }, this)

                }
            }
        }

        dialog.showDialog(dialogInfo)
    },

    /**
     * 预览头像
     */
    iconPreview: function (e) {

        var imgs = this.data.account.imgs


        wx.previewImage({
            urls: imgs,
            current: imgs[index]
        })
    },

    /**
     * 标记为付款或者收款
     */
    settle: function (accountId, targetId) {
        var account = this.data.account
        var target = account.payResult[0].payTarget.findByAttr("id", targetId)

        var isPay = this.data.userInfo.id == target.paidId
        var ohtherMember = account.originMembers.findByAttr("memberId", isPay ? target.receiptId : target.paidId)
        var content
        if (isPay)
            content = "确定要付款给[" + ohtherMember.memberName + "]" + target.waitPaidMoney + "元吗?此操作不可撤销!"
        else
            content = "确定要向[" + ohtherMember.memberName + "]收取" + target.waitPaidMoney + "元吗?此操作不可撤销!"

        var that = this
        var dialogInfo = {
            page: this,
            title: "提示",
            content: content,
            callback: {
                onConfirm: function () {
                    //请求服务器
                    APP.ajax({
                        url: APP.globalData.BaseUrl + '/account/settle',
                        data: {
                            token: wx.getStorageSync("token"),
                            accountId: accountId,
                            targetId: targetId
                        },
                        success: function (res) {
                            if (res.data.status == 0) {
                                var account = this.data.account
                                var target = account.payResult[0].payTarget.findByAttr("id", targetId)
                                target.waitPaidMoney = 0
                                target.value.showBtn = false
                                this.setData({
                                    account: this.data.account
                                })
                                wx.showToast({
                                    title: res.data.msg
                                })
                            } else {
                                wx.showToast({
                                    image: "/img/error.png",
                                    title: res.data.msg
                                })
                            }

                        }

                    }, this)

                }
            }
        }

        dialog.showDialog(dialogInfo)
    },

    /**
     * 点击付款收款或者完善账单按钮
     */
    onPayClick: function (e) {
        var accountId = e.target.dataset.accountid
        var targetId = e.target.dataset.targetid

        var account = this.data.account
        var target = account.payResult[0].payTarget.findByAttr("id", targetId)

        //是付款或者收款按钮
        if (target.value.canSettle == true) {
            this.settle(accountId, targetId)
            return
        }

        var paidMember = account.members.findByAttr("memberId", target.paidId)
        var receiptMember = account.members.findByAttr("memberId", target.receiptId)
        var memberId
        if (paidMember.isGroup && paidMember.isMember)
            memberId = paidMember.memberId
        else
            memberId = receiptMember.memberId

        console.log("accountId:" + accountId)
        console.log("memberId:" + memberId)
        console.log("targetId:" + targetId)

        wx.navigateTo({
            url: '/pages/account_group/account_group?accountId=' + accountId.encode() + "&memberId=" + memberId.encode() + "&targetId=" + targetId.encode()
        })


    },


    onLoad: function (option) {
        this.setData({
            accountId: option.accountId.decode()
        })

        this.onPullDownRefresh()


    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        if (this.data.userInfo)
            this.initAccount()
        else
            this.initSelfInfo()
    },

    /**
     * 初始化和自己的信息:id,name,icon
     */
    initSelfInfo: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/user/getSelfSimple',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                this.setData({
                    userInfo: res.data
                })
                this.initAccount()
            }

        }, this)
    },


    /**
     * 初始化账目列表数据
     */
    initAccount: function () {
        var that = this
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/get',
            data: {
                token: wx.getStorageSync("token"),
                accountId: this.data.accountId
                
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.FAILD){
                    wx.showToast({
                        title: res.data.msg,
                    })
                    setTimeout(function(){
                        wx.navigateBack()
                    },1000)
                    return
                }
                
                var v=res.data
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
                    v.value.allContentBtnText = "展开"
                } else
                    v.value.showAllContentBtn = false


                v.membersLength = v.members.length
                v.originMembers = util.clone(v.members)
                //子成员处理
                for (var i = 0; i < v.members.length; i++) {
                    var member = v.members[i]
                    if (member.parentMemberId != null) {
                        var parentMember = v.members.findByAttr("memberId", member.parentMemberId)
                        if (!parentMember.members)
                            parentMember.members = []
                        parentMember.members.push(member)
                        v.members.splice(i--, 1)
                    }
                }

                //付款方案中加入需要的用户头像
                if (v.payResult && v.payResult[0]) {

                    var targets = v.payResult[0].payTarget


                    targets.forEach(function (target, index) {
                        target.value = {}
                        target.style = {}
                        var paidMember = v.originMembers.findByAttr("memberId", target.paidId)
                        var receiptMember = v.originMembers.findByAttr("memberId", target.receiptId)
                        target.paidIcon = paidMember.memberIcon
                        target.receiptIcon = receiptMember.memberIcon


                        //处理抵消
                        if (target.offsets) {
                            target.offsets.forEach(function (v, i) {
                                v.value = {}
                                v.style = {}
                                //类型图标
                                v.value.typeIcon = APP.globalData.typeList.findByAttr("id", v.type).icon

                                //名称
                                if (v.name.length > 5)
                                    v.value.name = v.name.substr(0, 5) + "..."
                                else
                                    v.value.name = v.name
                            })
                        }
                        //确定是否显示操作按钮,及显示的文字
                        /**
                         * 显示收款,付款,完善账单按钮逻辑:
                         * 1.如果is_group==false and memberid==当前用户显示,否则不显示
                         * 2.如果is_group==true,那么查看当前用户是否为这个组的成员,如果是显示,否则不显示
                         * 3.如果显示:那么查看该member是收款还是付款
                         *      如果是收款:收款
                         *      如果是付款:付款
                         *      如果是组并且没有完善子账单:完善账单
                         */
                        if (that.data.userInfo.id == paidMember.memberId && target.waitPaidMoney>0) {
                            target.value.showBtn = true
                            target.value.btnText = "付款"
                            target.value.canSettle = true
                            target.style.bg = "background-color: salmon;"
                            return
                        }
                        if (that.data.userInfo.id == receiptMember.memberId && target.waitPaidMoney > 0) {
                            target.value.showBtn = true
                            target.value.btnText = "收款"
                            target.value.canSettle = true
                            target.style.bg = "background-color: SeaGreen;"
                            return
                        }
                        if (paidMember.isGroup && paidMember.isMember && target.paidStatus == 1) {
                            //我在这个组内
                            target.value.showBtn = true
                            target.value.btnText = "完善账单"
                            target.style.bg = "background-color: DarkCyan;"
                            return
                        }
                        if (receiptMember.isGroup && receiptMember.isMember && target.receiptStatus == 1) {
                            //我在这个组内
                            target.value.showBtn = true
                            target.value.btnText = "完善账单"
                            target.style.bg = "background-color: DarkCyan;"
                            return
                        }

                        

                    })

                }
                this.setData({
                    account: res.data,
                    visible: "",
                    style:{
                        deleteVisible: res.data.userId == this.data.userInfo.id ? "display:inherit;" :"display:none;"
                    }
                })

                // console.log(this.data.account)
                wx.stopPullDownRefresh()
            }

        }, this)
    }

})










