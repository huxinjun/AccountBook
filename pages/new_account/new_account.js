var APP = getApp()
var slider = require('../../utils/slider.js')
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {

        containerHeight: APP.systemInfo.windowHeight,

        tip0: "请输入固定比例(此成员将只付款总金额的百分比值,范围0-100)",
        tip1: "请输入固定数额(此成员将只按此金额付款)",
        tip2: "请输入自费数额(其他成员将不会为这笔数额买单哦！)",

        descSliderInfo: {
            index: -1
        },

        images: [],

        //所有可以选择的成员(相关的分组和自己的帐友集合)
        members: [
            {
                id:"1",
                name: "主卧的服务器法国人",
                icon: "http://192.168.10.205:8080/AccountBook/image/get/c0ea1500-9b8f-47f1-b68f-f2dd43a960b6",
                isGroup: true
            },
            {
                id: "2",
                name: "啊哈哈",
                icon: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3688856313,2337624274&fm=173&s=518B9D554C5160DE1801C06A0300D07B&w=218&h=146&img.JPG",
                isGroup: false
            },
            {
                id: "3",
                name: "大笑",
                icon: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3514131192,3730652926&fm=173&s=9810EE17695457C85DDC056C0300B072&w=218&h=146&img.JPEG",
                isGroup: false
            },
            {
                id: "4",
                name: "多撒多",
                icon: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1570290885,475601001&fm=173&s=E3A31364CCAB128E300C6DA30300F0E2&w=218&h=146&img.JPEG",
                isGroup: false
            },
            {
                id: "5",
                name: "和奴役",
                icon: "https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3735426824,2443786566&fm=173&s=E7D05A945481F8E85E0549E003007032&w=218&h=146&img.JPG",
                isGroup: false
            }
        ],

        account: {

            name: "火锅",

            description: "",

            icons: [],

            date: "",

            address_info: {},


            members: [
                {

                    //account data----------------------------------
                    id: "abc",
                    name: "新军",
                    icon:"/img/head.jpg",
                    paid_in: 88.8,
                    // pay_rule:{
                    //     type: 0,    //0:百分比  1:固定数额
                    //     num:0.2
                    // },
                    // money_for_self: 20.5,

                    //binding data----------------------------------
                    style: {
                        member: "height:140rpx;",
                        memberRule: "height:0;",
                        memberRuleType: "height:0;",

                        memberTrans: "",
                        memberRuleTrans: "",
                        memberRuleTrans: "",
                        tag0: "",
                        tag1: "display:none;",
                        tag2: "display:none;"
                    },
                    value: {
                        tag0: "个人账单",
                        tag1: "AA制",
                        tag2: "自费10元",
                        rule_type: 1,
                        paidin_input: "￥0.00"
                    }

                }
            ]
        },
        rule_tyles: [
            { name: '百分比付款', value: 0 },
            { name: '固定值付款', value: 1 }
        ],



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
            },
            {
                name: "desc slider buttons",
                //条目高度
                height: 100,
                buttons: [
                    {
                        text: "清空",
                        color: "white",
                        colorBg: "#f00",
                        colorShadow: "black",
                        onClick: "",
                        width: 150,
                        visible: true

                    },
                    {
                        text: "删除",
                        color: "white",
                        colorBg: "#2BA245",
                        colorShadow: "black",
                        onClick: "",
                        width: 150,
                        visible: true
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
        member.style = {
            member: "height:0;opacity:0;",
            memberRule: "height:0;opacity:0;",
            tag0: "",
            tag1: "display:inherit;",
            tag2: "display:none;"
        }
        member.value = {
            tag0: "个人账单",
            tag1: "AA制",
            tag2: "自费10元",
            rule_type: 1,
            paidin_input: "￥0.00"
        }
        this.data.account.members.addToHead(member)
        slider.setLayer(0, 0)
        this.setData({
            account: this.data.account
        })
        setTimeout(function () {
            var memberInArray=this.data.account.members.findByAttr("id",member.id)

            memberInArray.style.member = "height:140rpx;opacity:1;"
            memberInArray.style.memberTrans = "transition:all 0.5s ease;"

            this.setData({
                scrollToView: "members_title",
                account: this.data.account

            })

            //动画完毕一定要删除memberTrans,不然删除元素的时候回闪
            setTimeout(function () {
                var memberInArray = this.data.account.members.findByAttr("id", member.id)
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
        var id = this.getSliderData(index).id
        this.removeMemberById(id)
    },
    /**
     * 移除成员
     */
    removeMemberById: function (id) {
        //已添加成员和全部可选成员保持同步
        var item = this.data.members.findByAttr("id", id)
        delete item.value
        delete item.style
        slider.deleteItem("id",id);
    },

    /**
     * 删除规则
     */
    removeRule: function (e) {
        var index = e.target.dataset.index
        var member = this.getSliderData(index)
        delete member.pay_rule
        slider.close(index)
        this.refreshTags()

    },
    /**
     * 是否有特殊规则
     */
    hasRule: function (index) {
        var member = this.getSliderData(index)
        return member.pay_rule != undefined
    },

    /**
     * 删除自费
     */
    removeMoneyForSelf: function (e) {
        var index = e.target.dataset.index
        var member = this.getSliderData(index)
        delete member.money_for_self
        slider.close(index)
        this.refreshTags()
    },
    /**
     * 是否有自费
     */
    hasMoneyForSelf: function (index) {
        var member = this.getSliderData(index)
        return member.money_for_self != undefined
    },

    /**
     * 根据索引配置抽屉需要显示的按钮
     */
    updateMemberSliderButton: function (index) {
        if (index == this.data.descSliderInfo.index) {
            slider.updateLayer(this.data.descSliderInfo.index, [])
            return
        }
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

        if (index != this.getSliderData().length - 1) {
            info[0].visible = true
            info[0].text = "删除成员"
            info[0].onClick = "removeMember"
        } else {
            info[0].visible = false
        }



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

                v.style.tag0 = "display:none;"
                v.style.tag1 = "display:inherit;"
                if (that.hasRule(i)) {
                    //0:百分比  1:固定数额
                    if (v.pay_rule.type == 0)
                        v.value.tag1 = "付款" + v.pay_rule.num + "%"
                    else
                        v.value.tag1 = "付款" + v.pay_rule.num + "元"

                } else
                    v.value.tag1 = "AA制"

                if (that.hasMoneyForSelf(i)) {
                    v.style.tag2 = "display:inherit;"
                    v.value.tag2 = "自费" + v.money_for_self + "元"

                } else {
                    v.style.tag2 = "display:none;"
                    v.value.tag2 = ""
                }

            })
        } else {
            datas[0].style.tag0 = "display:inherit;"
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
            item.value.rule_input_placeholder = this.data["tip" + item.value.rule_type]
        else
            item.value.rule_input_placeholder = this.data.tip2
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
        item.value.rule_type = parseInt(e.detail.value)
        item.value.rule_input_placeholder = this.data["tip" + e.detail.value]
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
     * 成员支付数额发生变化
     */
    paidinInputValueChanged: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)

        var value = e.detail.value
        value = value.replace('￥', '')


        item.value.paidin_input = parseFloat(value)
        item.paid_in = item.value.paidin_input
        // console.log("输入的成员支付数字：" + item.value.paidin_input)

        var newValue = '￥' + value
        item.value.paidin_input = newValue
        this.refreshSliderData()
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
                title: '请输入数字！',
            })
            this.refreshRuleInputPlaceHolder(index)
            return
        }


        if (item.value.isShowRule) {
            var ruleType = item.value.rule_type
            item.pay_rule = {
                type: ruleType
            }
            // console.log("saveRule" + ruleType)
            switch (ruleType) {
                case 0:
                    //检查输入的有效性
                    if (inputValue.isvalue < 0 || inputValue > 100) {
                        wx.showToast({
                            title: '请输入0-100之间的数额！',
                        })
                        this.refreshRuleInputPlaceHolder(index)
                        return
                    }

                    item.pay_rule.num = inputValue
                    break;
                case 1:
                    item.pay_rule.num = inputValue
                    break;
            }

        } else {
            item.money_for_self = inputValue
        }
        delete item.value.rule_input
        this.hideRule(e)
        this.refreshTags()

    },

    /**
     * 保存成员支付数额
     */
    savePaidIn: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        var inputValue = item.value.paidin_input
        if (inputValue == undefined || isNaN(inputValue)) {
            wx.showToast({
                title: '请输入数字！',
            })
            item.value.paidin_input = "￥"
            return
        }
    },

    /**
     * 成员支付数额获取到焦点
     */
    paidInFocus: function (e) {
        var index = e.target.dataset.index
        var item = this.getSliderData(index)
        if (item.value.isSliderOpen)
            slider.close(index)

        item.value.paidin_input = "￥"
        this.refreshSliderData()
    },

    /**
     * 成员支付数额失去焦点
     */
    paidInBlur: function (e) {

        var index = e.target.dataset.index
        var item = this.getSliderData(index)


        if (item.value.paidin_input == "￥")
            item.value.paidin_input = "￥0.00"
        this.refreshSliderData()
    },


    /**
     * 选择时间
     */
    bindDateChange: function (e) {
        console.log(e)
        this.data.account.date = e.detail.value
        this.refreshSliderData()
    },

    /**
     * 获取今天的日期字符串
     */
    getTodayDate: function () {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        this.data.account.date = year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day)
        this.setData({
            today: this.data.account.date,
            account: this.data.account
        })
    },

    /**
     * 选择位置
     */
    chooseLocation: function (e) {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                // console.log(res)
                that.data.account.address_info = res
                that.refreshSliderData()
            },
        })
    },


    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var that = this
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    var outterValue = res.tempFilePaths[i]
                    var exists = false
                    for (var j = 0; j < that.data.images.length; j++) {
                        var innerValue = that.data.images[i]
                        if (innerValue.wx_path == outterValue) {
                            console.log("重复图片")
                            exists = true
                            break
                        }
                    }
                    if (!exists) {
                        that.data.images.push({
                            wx_path: outterValue,
                            remote_name: "",
                            progress: 0
                        })
                        that.uploadImage(outterValue)
                    }
                }
                that.setData({
                    images: that.data.images
                })
            }
        })
    },

    /**
     * 上传图片
     */
    uploadImage: function (filePath) {
        var that = this
        var callback = wx.uploadFile({
            url: APP.globalData.BaseUrl + '/image/upload',
            filePath: filePath,
            name: 'image',
            success: function (res) {
                var data = JSON.parse(res.data)
                that.data.images.forEach(function (v, i) {
                    if (v.wx_path == filePath)
                        v.remote_name = data.msg
                })
                that.data.account.icons.push(data.msg)
            }
        })
        callback.onProgressUpdate((res) => {
            that.data.images.forEach(function (v, i) {
                if (v.wx_path == filePath)
                    v.progress = res.progress
            })
        })
    },

    /**
     * 初始化和自己相关的分组和帐友,待会儿需要选择成员
     */
    initMembersData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/getAllMembers',
            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
            }

        }, this)
    },

    /**
     * 弹出选择成员的dialog
     */
    showSelectMembersDialog: function (e) {
        var dialogInfo = {
            page: this,
            title: "选择成员",
            // singleChoose:true,
            members: this.data.members,
            callback: {
                onConfirm: function () {
                    var that = this
                    var members=this.data.members

                    var needAddMbs = []
                    var neenDelMbs = []
                    members.forEach(function(outterValue,i){
                        //去掉已经添加的
                        var isAdded=false
                        that.data.account.members.forEach(function (innerValue,i){
                            if (isAdded)
                                return
                            if (innerValue.id == outterValue.id)
                                isAdded=true

                        })
                        if (outterValue.value && outterValue.value.isSelected){
                            //已选未添加,添加
                            if(!isAdded)
                                needAddMbs.push(outterValue)
                        }else{
                            //未选已添加,删除
                            if (isAdded){
                                neenDelMbs.push(outterValue)
                            }
                            
                        }
                    })
                    neenDelMbs.forEach(function (v, i) {
                        that.removeMemberById(v.id)
                    })
                    setTimeout(function(){
                        needAddMbs.forEach(function (v, i) {
                            that.addMember(util.clone(v))
                        })
                    },neenDelMbs.length>0?600:0)
                    
                    

                }
            }
        }

        dialog.showDialog(dialogInfo)
    },








    onLoad: function () {
        var that = this
        this.data.account.members.onSizeChanged = function (size) {
            that.refreshTags()
        }

        this.slidersInfo.page = this
        slider.init(this.slidersInfo)
        slider.setLayer(0, 0)
        slider.setLayer(this.data.descSliderInfo.index, 1)

        this.getTodayDate()
        // this.initMembersData()
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
     * 上传到服务器
     */
    uploadAccount: function (e) {
        var clone = slider.clone(this.data.account)
        delete clone.rule_tyles
        clone.members.forEach(function (v, i) {
            delete v.style
            delete v.value
        })
        console.log(clone)

    }
})










