var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
var isLoading = false
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,

        banner: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509096167729&di=82f605348e2b14d2c6103619d9ec751b&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F50da81cb39dbb6fda2d331e50324ab18962b376d.jpg"
    },

    onAccountItemClick:function(e){
        console.log("onAccountItemClick")

        var index = e.target.dataset.index
        var account = this.data.accounts[index]

        if(index!=undefined){
            wx.navigateTo({
                url: '/pages/account/account?accountId=' + account.id.encode()
            })
        }
    },


    /**
     * 点击展开或合上成员付款详情的按钮
     */
    onMembersPullDownClick: function (e) {
        console.log("onMembersPullDownClick")

        var index = e.target.dataset.index
        var account = this.data.accounts[index]

        if (index == undefined)
            return

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

        if (account.value.isShowAllContent) {
            //已经显示全部文字了,点击后显示部分文字
            account.description = account.descriptionSimple
            account.value.allContentBtnText = "展开"
        } else {
            account.description = account.descriptionFull
            account.value.allContentBtnText = "合上"
        }
        this.setData({
            accounts: this.data.accounts
        })
    },

    /**
     * 预览头像
     */
    iconPreview: function (e) {
        var accountid = e.target.dataset.accountid
        var index = e.target.dataset.index

        var imgs = this.data.accounts.findByAttr("id", accountid).imgs


        wx.previewImage({
            urls: imgs,
            current: imgs[index]
        })
    },


    /**
     * 点击付款收款或者完善账单按钮
     */
    onPayClick: function (e) {
        var accountId = e.target.dataset.accountid
        var targetId = e.target.dataset.targetid

        var account = this.data.accounts.findByAttr("id", accountId)
        var target = account.payResult[0].payTarget.findByAttr("id", targetId)

        //是付款或者收款按钮
        if (target.value.canSettle == true) {
            APP.ajax({
                url: APP.globalData.BaseUrl + '/account/settle',
                data: {
                    token: wx.getStorageSync("token"),
                    accountId: accountId,
                    targetId: targetId
                },
                success: function (res) {
                    if (res.data.status == 0) {
                        var account = this.data.accounts.findByAttr("id", accountId)
                        var target = account.payResult[0].payTarget.findByAttr("id", targetId)
                        target.value.showBtn = false
                        this.setData({
                            accounts: this.data.accounts
                        })
                    }
                    wx.showToast({
                        title: res.data.msg
                    })

                }

            }, this)
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

        var that = this

        // option.userId ="oCBrx0FreB-L8pIQM5_RYDGoWOJJ"
        this.setData({
            userId: option.userId
        })
    },

    onShow: function (option) {
        this.onPullDownRefresh()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        this.data.accounts = []
        this.initSummaryInfo()
        if (this.data.userInfo)
            this.getAccounts()
        else
            this.initSelfInfo()
    },

    /**
     * 到底部,加载更多
     */
    onReachBottom: function () {
        if (isLoading)
            return

        if (!this.data.hasNextPage)
            return

        isLoading = true

        this.getAccounts(this.data.nextPageIndex)

    },
    onPageScroll: function () {
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
                this.getAccounts()
            }

        }, this)
    },

    /**
     * 初始化账户统计信息
     */
    initSummaryInfo: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/getSummaryInfo',
            data: {
                token: wx.getStorageSync("token"),
                userId: this.data.userId ? this.data.userId : ""
            },
            success: function (res) {
                var that = this
                var summaryInfos = res.data.infos

                if (this.data.userId) {


                    //两个人的账单统计信息处理
                    summaryInfos.forEach(function (v, i) {

                        v.style = {}
                        v.value = {}
                        switch (v.name) {
                            case "wait_paid":

                                if (v.number >= 0) {
                                    that.data.isNeedPaid = true
                                    that.setData({
                                        needPaidNumber: v.number
                                    })
                                }
                                else {
                                    that.data.isNeedPaid = false
                                    v.number = Math.abs(v.number)
                                    that.setData({
                                        needPaidNumber: v.number
                                    })
                                }
                                v.style.visible = "display:none;"
                                break;
                            case "month_paidin":
                                v.value.name = "月支出"
                                v.value.unit = "元"
                                break;
                            case "paidin":
                                v.value.name = "总支出"
                                v.value.unit = "元"
                                break;
                        }
                    })


                } else {
                    if (summaryInfos)
                        //单人
                        summaryInfos.forEach(function (v, i) {

                            v.style = {}
                            v.value = {}
                            switch (v.name) {
                                case "wait_paid":
                                    v.value.name = "待付"
                                    v.value.unit = "元"
                                    v.style.color = "color:Crimson;"
                                    break;
                                case "wait_receipt":
                                    v.value.name = "待收"
                                    v.value.unit = "元"
                                    v.style.color = "color:SeaGreen;"
                                    break;
                                case "month_paidin":
                                    v.value.name = "月支出"
                                    v.value.unit = "元"
                                    break;
                                case "wait_edit":
                                    v.value.name = "待完善账单"
                                    v.value.unit = "笔"
                                    break;
                            }
                        })

                }

                this.setData({
                    summaryInfos: summaryInfos
                })
            }

        }, this)
    },


    /**
     * 初始化账目列表数据
     */
    getAccounts: function (pageIndex) {
        var that = this
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/getAll',
            data: {
                token: wx.getStorageSync("token"),
                userId: this.data.userId ? this.data.userId : "",
                pageIndex: pageIndex != undefined ? pageIndex : 0,
                pageSize: 3
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
                            if (that.data.userInfo.id == paidMember.memberId && target.waitPaidMoney > 0) {
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

                })

                
                if (this.data.accounts == undefined)
                    this.data.accounts = []
                this.data.accounts.appendAll(res.data.accounts)

                this.setData({
                    accounts: this.data.accounts
                })

                console.log(this.data.accounts)
                wx.stopPullDownRefresh()

                this.data.hasNextPage = res.data.hasNextPage
                this.data.nextPageIndex = res.data.hasNextPage ? res.data.pageIndex + 1 : 99999
                isLoading = false
            }

        }, this)
    }

})










