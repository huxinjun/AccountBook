var APP = getApp()
var slider = require('../../utils/slider.js')
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {

        containerHeight: APP.systemInfo.windowHeight,

        tip1: "请输入固定比例(此成员将只付款总金额的百分比值,范围1-99)",
        tip2: "请输入固定数额(此成员将只按此金额付款)",
        tip3: "请输入自费数额(其他成员将不会为这笔数额买单哦！)",

        
        rule_tyles: [
            { name: '百分比付款', value: 0 },
            { name: '固定值付款', value: 1 }
        ],

        account: null
    },


    slidersInfo: {
        //N种状态
        layers: [
            {
                name: "members slider buttons",
                //条目高度
                height: 140,
                buttons: [
                    {
                        text: "",
                        color: "white",
                        colorBg: "#f00",
                        colorShadow: "black",
                        onClick: "",
                        width: 150,
                        visible: false

                    },
                    {
                        text: "",
                        color: "white",
                        colorBg: "#2BA245",
                        colorShadow: "black",
                        onClick: "",
                        width: 150,
                        visible: false
                    },
                    {
                        text: "",
                        color: "white",
                        colorBg: "#FFD700",
                        colorShadow: "black",
                        onClick: "",
                        width: 150,
                        visible: false
                    }
                ]
            }
        ]
    },

    /**
     * 获取某个抽屉数据附加的list条目对象
     */
    getSliderData: function (index) {
        if (index == -1)
            return this.data.descSliderInfo
        if (index == undefined)
            return this.data.account.members
        return this.data.account.members[index]
    },
    /**
     * 刷新抽屉数据
     */
    refreshSliderData: function () {
        this.setData({
            descSliderInfo: this.data.descSliderInfo,
            account: this.data.account
        })
    },





    /**
     * 添加成员
     */
    addMember: function (member) {
        /**
         * 不把其他元素的动画取消,会导致顶部元素动画时,打开编辑框的条目也在进行height动画
         */
        this.data.account.members.forEach(function (v, i) {
            v.style.memberTrans = ""
            v.style.memberRuleTrans = ""
            v.style.memberRuleTypeTrans = ""
        })
        member.value = {
            tag1: "AA制",
            tag2: "自费10元",
            ruleType: 2,
            paidIn: "￥0.00"
        }
        member.style = {
            member: "height:0;opacity:0;",
            memberRule: "height:0;opacity:0;",
            tag1: "display:inherit;",
            tag2: "display:none;"
        }

        this.data.account.members.addToHead(member)
        slider.setLayer(0, 0)
        this.refreshSliderData()

        setTimeout(function () {
            var memberInArray = this.data.account.members.findByAttr("memberId", member.memberId)

            memberInArray.style.member = "height:140rpx;opacity:1;"
            memberInArray.style.memberTrans = "transition:all 0.5s ease;"

            this.setData({
                scrollToView: "members_title",
                account: this.data.account

            })

            //动画完毕一定要删除memberTrans,不然删除元素的时候回闪
            setTimeout(function () {
                var memberInArray = this.data.account.members.findByAttr("memberId", member.memberId)
                memberInArray.style.member = "height:140rpx;"
                memberInArray.style.memberTrans = ""
                this.setData({
                    account: this.data.account
                })

            }.bind(this), 500)

        }.bind(this), 50)

    },

    /**
     * 移除成员
     */
    removeMember: function (e) {
        var index = e.target.dataset.index
        var id = this.getSliderData(index).memberId
        this.removeMemberById(id)
    },
    /**
     * 移除成员
     */
    removeMemberById: function (id) {
        //已添加成员和全部可选成员保持同步
        var item=this.data.members.findByAttr("memberId", id)
        if(item){
            item.value.isSelected = false
            item.style.selectVisible = "transform: scale(0, 0);"
        }
        slider.deleteItem("memberId", id);
    },

    /**
     * 删除规则
     */
    removeRule: function (e) {
        var index = e.target.dataset.index
        var member = this.getSliderData(index)
        member.ruleType=0
        delete member.ruleNum
        slider.close(index)
        this.refreshTags()

    },
    /**
     * 是否有特殊规则
     */
    hasRule: function (index) {
        var member = this.getSliderData(index)
        return member.ruleType && member.ruleType != 0
    },

    /**
     * 删除自费
     */
    removeMoneyForSelf: function (e) {
        var index = e.target.dataset.index
        var member = this.getSliderData(index)
        delete member.moneyForSelf
        slider.close(index)
        this.refreshTags()
    },
    /**
     * 是否有自费
     */
    hasMoneyForSelf: function (index) {
        var member = this.getSliderData(index)
        return member.moneyForSelf != undefined && member.moneyForSelf > 0
    },

    /**
     * 根据索引配置抽屉需要显示的按钮
     */
    updateMemberSliderButton: function (index) {
        if (this.getSliderData().length == 1) {
            slider.updateLayer(0, [
                { visible: false },
                { visible: false },
                { visible: false }
            ])
            return
        }

        var info = [{}, {}, {}]
        if (this.hasRule(index)) {
            info[2].visible = true
            info[2].text = "删除规则"
            info[2].onClick = "removeRule"
        } else {
            info[2].visible = false
        }

        if (this.hasMoneyForSelf(index)) {
            info[1].visible = true
            info[1].text = "删除自费"
            info[1].onClick = "removeMoneyForSelf"
        } else {
            info[1].visible = true
            info[1].text = "添加自费"
            info[1].onClick = "showRulePaySelf"
        }


        info[0].visible = true
        info[0].text = "删除成员"
        info[0].onClick = "removeMember"

        slider.updateLayer(index, info)

    },


    /**
     * 根据现有的规则和自费刷新要显示的tag
     */
    refreshTags: function () {
        var datas = this.getSliderData()
        var that = this
        if (datas.length > 1) {
            datas.forEach(function (v, i) {

                v.style.tag1 = "display:inherit;"
                if (that.hasRule(i)) {
                    //0:百分比  1:固定数额
                    if (v.ruleType == 1)
                        v.value.tag1 = "付款" + v.ruleNum + "%"
                    else
                        v.value.tag1 = "付款" + v.ruleNum + "元"

                } else
                    v.value.tag1 = "AA制"

                if (that.hasMoneyForSelf(i)) {
                    v.style.tag2 = "display:inherit;"
                    v.value.tag2 = "自费" + v.moneyForSelf + "元"

                } else {
                    v.style.tag2 = "display:none;"
                    v.value.tag2 = ""
                }

            })
        } else {
            
            datas[0].style.tag1 = "display:none;"
            datas[0].style.tag2 = "display:none;"
        }
        this.refreshSliderData()
    },


    /**
     * 刷新规则或自费input的placeholder文案
     */
    refreshRuleInputPlaceHolder: function (index) {
        var item = this.getSliderData(index)
        if (item.value.isShowRule)
            item.value.rule_input_placeholder = this.data["tip" + item.value.ruleType]
        else
            item.value.rule_input_placeholder = this.data.tip3
        delete item.value.rule_input
        this.refreshSliderData()
    },






    /**
     * 显示特殊规则编辑框
     */
    showRule: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        //已经打开了就关闭
        if (item.value.isShowRule) {
            this.hideRule(e)
            return
        }

        item.style.member = "height:410rpx;opacity:1;"
        item.style.memberRule = "height:270rpx;opacity:1;"
        item.style.memberRuleType = "height:60rpx;opacity:1;"

        item.style.memberTrans = "transition:all 0.5s ease;"
        item.style.memberRuleTrans = "transition:all 0.5s ease;"
        item.style.memberRuleTypeTrans = "transition:all 0.5s ease;"



        item.value.isShowRule = true

        this.setData({
            scrollToView: "members",
            account: this.data.account
        })
        slider.close(index)

        this.refreshRuleInputPlaceHolder(index)
    },
    /**
     * 隐藏规则编辑框
     */
    hideRule: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        item.style.member = "height:140rpx;opacity:1;"
        item.style.memberRule = "height:0;opacity:0;"

        item.style.memberTrans = "transition:all 0.5s ease;"
        item.style.memberRuleTrans = "transition:all 0.5s ease;"

        item.value.isShowRule = false
        item.value.isShowMoneyForSelf = false
        this.refreshSliderData()

    },
    /**
     * 自费编辑框
     */
    showRulePaySelf: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        //已经打开了就关闭
        if (item.value.isShowMoneyForSelf) {
            this.hideRule(e)
            return
        }
        item.style.member = "height:350rpx;opacity:1;"
        item.style.memberRule = "height:210rpx;opacity:1;"
        item.style.memberRuleType = "height:0;opacity:0;"

        item.style.memberTrans = "transition:all 0.5s ease;"
        item.style.memberRuleTrans = "transition:all 0.5s ease;"
        item.style.memberRuleTypeTrans = "transition:all 0.5s ease;"


        item.value.isShowRule = false
        item.value.isShowMoneyForSelf = true

        this.refreshRuleInputPlaceHolder(index)
        slider.close(index)
    },




    /**
     * 条目的规则中的付款类型变化了
     */
    radioChange: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        // console.log(e)
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
        item.value.ruleType = parseInt(e.detail.value) + 1
        item.value.rule_input_placeholder = this.data["tip" + item.value.ruleType]
        this.refreshSliderData()
    },

    /**
     * 规则或者自费的数额发生变化
     */
    ruleInputValueChanged: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)

        item.value.rule_input = parseFloat(e.detail.value)

        // console.log("输入的规则或自费数字：" + item.value.rule_input)
    },


    /**
     * 点击成员付款
     */
    onMemberPaidinClick: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        console.log("onMemberPaidinClick")
        console.log(item)
        if (slider.isSliderOpen(index)) {
            slider.close(index)
            return
        }



        var dialogInfo = {
            page: this,
            title: "输入",
            content: "请输入成员支付数额",
            inputType: "digit",
            maxLength: 10,
            callback: {
                onConfirm: function (value) {
                    console.log("成员付款数额:"+value)
                    if (value=="" || isNaN(value)) {
                        wx.showToast({
                            image: "/img/error.png",
                            title: '请输入数字',
                        })
                        return false
                    }

                    var item = this.getSliderData(index)
                    var oldItemPaidIn = item.paidIn
                    item.paidIn = parseFloat(value)
                    item.paidIn = item.paidIn < 0 ? 0 : item.paidIn
                    //检查输入值得有效性:各成员总支付不可以超过账单支出
                    if (this.calcAllPaidIn() > parseFloat(this.data.account.paidIn)) {
                        wx.showToast({
                            image: "/img/error.png",
                            title: '各成员支出额的和不能超过组的支出额',
                        })
                        //恢复为旧值
                        item.paidIn = oldItemPaidIn
                        return false
                    }
                    
                    item.value.paidIn = "￥" + item.paidIn
                    if (item.paidIn>0)
                        item.style.paidIn_color ="color:red;"
                    else
                        item.style.paidIn_color = "color:#20B2AA;"


                    this.refreshSliderData()
                }
            }
        }

        dialog.showDialog(dialogInfo)

    },

    /**
     * 计算总共支出
     */
    calcAllPaidIn: function () {
        //计算总支出
        var total = 0
        this.data.account.members.forEach(function (v, i) {
            total += parseFloat(v.paidIn)
        })
        
        return total
    },

    /**
     * 抽屉拉开了
     */
    onSliderOpen: function (index) {
        console.log("打开了：" + index)
        if (index == -1) {
            this.getSliderData(-1).value.inputDisable = true
            this.refreshSliderData()
        }
    },

    /**
     * 抽屉合上了
     */
    onSliderClose: function (index) {
        console.log("关闭了：" + index)
        if (index == -1) {
            this.getSliderData(-1).value.inputDisable = false
            this.refreshSliderData()
            this.hideImageDeteleButtons()
        }
    },



    /**
     * 保存规则或者自费
     */
    saveRule: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        var inputValue = item.value.rule_input
        if (inputValue == undefined || isNaN(inputValue)) {
            wx.showToast({
                image: "/img/error.png",
                title: '请输入数字！',
            })
            this.refreshRuleInputPlaceHolder(index)
            return
        }
        

        


        if (item.value.isShowRule) {
            item.ruleType = item.value.ruleType
            
            switch (item.ruleType) {
                case 1:
                    //检查输入的有效性
                    if (inputValue.isvalue < 1 || inputValue > 99) {
                        wx.showToast({
                            image: "/img/error.png",
                            title: '请输入1-99之间的数字！',
                        })
                        this.refreshRuleInputPlaceHolder(index)
                        return
                    }

                    item.ruleNum = inputValue
                    break;
                case 2:
                    if (!this.isRuleInputValid(inputValue))
                        return
                    item.ruleNum = inputValue
                    break;
            }

        } else {
            if (!this.isRuleInputValid(inputValue))
                return
            item.moneyForSelf = inputValue
        }
        delete item.value.rule_input
        this.hideRule(e)
        this.refreshTags()

    },

    /**
     * 检查自费或者规则输入的数字是否有效
     */
    isRuleInputValid(value){
        var total = parseFloat(this.data.account.paidIn)
        //输入的规则或是自费不能大于总支出
        if (value > total) {
            wx.showToast({
                image: "/img/error.png",
                title: '不能超出总支出！',
            })
            this.refreshRuleInputPlaceHolder(index)
            return false
        }
        return true
    },






    /**
     * 预览头像
     */
    iconPreview: function (e) {
        var index = e.target.dataset.index
        var imgs = this.data.account.imgs

        wx.previewImage({
            urls: imgs,
            current: imgs[index]
        })
    },

    








    onLoad: function (option) {
        var that = this
        
        this.slidersInfo.page = this
        slider.init(this.slidersInfo)


        this.data.accountId = option.accountId.decode()
        this.data.memberId = option.memberId.decode()
        this.data.targetId = option.targetId.decode()

        this.initAccount()

        
        
    },

    onShow: function (options) {
        //切换页面时候需要重新初始化slider,因为require获取的是同一个对象
        slider.init(this.slidersInfo)
    },



    /**
     * 当slider捕获到事件时会请求page为其刷新slider中的
     * 描述信息,以显示不同的按钮点击产生不同的事件
     */
    requireSliderUpdate: function (index) {
        this.updateMemberSliderButton(index)
    },

    /**
     * 查询账单的基础信息
     */
    initAccount: function () {
        var that=this
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/get',
            data: {
                token: wx.getStorageSync("token"),
                accountId: this.data.accountId
            },

            success: function (res) {
                var account = res.data
                account.value={}
                account.style={}
                account.value.typeIcon = APP.globalData.typeList.findByAttr("id", account.type).icon
                account.description = account.description ? account.description.substr(0, 16)+"...":null
                var originMembers = account.members
                account.members=[]

                //计算完善账单的总支出
                //1.计算当前member需要付钱还是需要收钱:(paidIn-shouldPay)>0时收款
                //  如果需要付钱:各成员支付最大值为组的shouldPay
                //  如果需要收钱:各成员支付最大值为组的paidIn
                var currGroupMember = originMembers.findByAttr("memberId", this.data.memberId)
                var target = account.payResult[0].payTarget.findByAttr("id", this.data.targetId)
                if(target.paidId==this.data.memberId)
                    account.paidIn = String(target.money)
                else
                    account.paidIn = String(currGroupMember.paidIn)


                this.setData({
                    account: account
                })

                //查找组内的成员
                this.initMembers()
                

                
                

            }
        },this)

    },


    /**
     * 查询账单的基础信息
     */
    initMembers: function (groupId) {
        var that = this
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/getMembers',
            data: {
                token: wx.getStorageSync("token"),
                groupId: this.data.memberId
            },

            success: function (res) {
                var members=res.data.members
                members.forEach(function (v, i) {
                    v.value = {}
                    v.style = {}
                    v.paidIn = "0.00"
                    that.addMember(v)
                })
                this.data.account.members.onSizeChanged = function (size) {
                    that.refreshTags()
                }
                this.refreshTags()

            }
        }, this)


        
    },

    /**
     * 上传到服务器
     */
    uploadAccount: function (e) {
        //检查输入值得有效性:各成员总支付必须与组的应付或实付相等
        if (this.calcAllPaidIn() != parseFloat(this.data.account.paidIn)) {
            wx.showToast({
                image: "/img/error.png",
                title: '各成员支出额的和需与组支付额相等!',
            })
            return false
        }



        var clone = util.clone(this.data.account, {
            onCopyed: function (obj, attr) {
                //服务器内部图片都是以XzBB结尾
                if (obj[attr] && typeof obj[attr] == 'string' && obj[attr].endsWith("XzBB"))
                    obj[attr] = APP.getImageUri(obj[attr])
            }
        })
        clone.members.forEach(function (v, i) {
            delete v.value
            delete v.style
        })

        var membersJson = JSON.stringify(clone.members)
        console.log(membersJson)

        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/updateInnerAccount',
            data: {
                token: wx.getStorageSync("token"),
                accountId: this.data.accountId,
                memberId: this.data.memberId,
                targetId: this.data.targetId,
                membersJson: membersJson
            },
            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS) {
                    setTimeout(function () {
                        wx.navigateBack()
                    }, 1000)
                }
                wx.showToast({
                    title: res.data.msg
                })
            }

        }, this)

    }
})










