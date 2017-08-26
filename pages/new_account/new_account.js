//index.js
//获取应用实例
var APP = getApp()
var slider
Page({
    data: {
        containerHeight: 0,

        account: {

            name: "火锅",


            members: [
                {

                    style: {
                        member: "height:140rpx;",
                        memberRule: "height:0;",
                        memberRuleType: "height:0;",

                        memberTrans:"",
                        memberRuleTrans: "",
                        memberRuleTrans: "",
                        tag0: "",
                        tag1: "",
                        tag2: ""
                    },
                    value: {
                        tag0: "个人账单",
                        tag1: "AA制",
                        tag2: "自费10元"
                    }

                }
            ]
        },
        items: [
            { name: '百分比付款', value: '0' },
            { name: '固定值付款', value: '1', checked: 'true' }
        ],


        
    },


    getSliderData: function (index) {
        if (index == undefined)
            return this.data.account.members
        return this.data.account.members[index]
    },
    refreshSliderData: function () {
        this.setData({
            account: this.data.account
        })
    },

    /**
     * 添加成员
     */
    addMember: function () {
        /**
         * 不把其他元素的动画取消,会导致顶部元素动画时,打开编辑框的条目也在进行height动画
         */
        this.data.account.members.forEach(function(v,i){
            v.style.memberTrans=""
            v.style.memberRuleTrans=""
            v.style.memberRuleTypeTrans=""
        })

        this.data.account.members.addToHead({
            style: {
                member: "height:0;opacity:0;",
                memberRule: "height:0;opacity:0;",
            },
            value: {
                tag0: "个人账单",
                tag1: "AA制",
                tag2: "自费10元"
            }
        })
        slider.setLayer(0,0)
        this.setData({
            account: this.data.account
        })
        setTimeout(function () {

            this.data.account.members[0].style.member = "height:140rpx;opacity:1;"
            this.data.account.members[0].style.memberTrans = "transition:all 0.5s ease;"
            this.setData({
                scrollToView: "members_title",
                account: this.data.account

            })
            
        }.bind(this), 50)



    },
    /**
     * 移除成员
     */
    removeMember: function () {

    },

    /**
     * 显示特殊规则编辑框
     */
    showRule: function (e) {
        var index = e.target.dataset.index
        var members = this.data.account.members
        members[index].style.member = "height:410rpx;opacity:1;"
        members[index].style.memberRule = "height:270rpx;opacity:1;"
        members[index].style.memberRuleType = "height:60rpx;opacity:1;"

        members[index].style.memberTrans = "transition:all 0.5s ease;"
        members[index].style.memberRuleTrans = "transition:all 0.5s ease;"
        members[index].style.memberRuleTypeTrans = "transition:all 0.5s ease;"

        this.setData({
            scrollToView: "members",
            account: this.data.account
        })
        slider.close(index)
    },
    /**
     * 隐藏规则编辑框
     */
    hideRule: function (e) {
        var index = e.target.dataset.index
        var members = this.data.account.members
        members[index].style.member = "height:140rpx;opacity:1;"
        members[index].style.memberRule = "height:0;opacity:0;"

        members[index].style.memberTrans = "transition:all 0.5s ease;"
        members[index].style.memberRuleTrans = "transition:all 0.5s ease;"
        this.setData({
            account: this.data.account
        })

    },
    /**
     * 自费编辑框
     */
    showRulePaySelf: function (e) {
        var index = e.target.dataset.index
        var members = this.data.account.members
        members[index].style.member = "height:350rpx;opacity:1;"
        members[index].style.memberRule = "height:210rpx;opacity:1;"
        members[index].style.memberRuleType = "height:0;opacity:0;"

        members[index].style.memberTrans = "transition:all 0.5s ease;"
        members[index].style.memberRuleTrans = "transition:all 0.5s ease;"
        members[index].style.memberRuleTypeTrans = "transition:all 0.5s ease;"
        this.setData({
            account: this.data.account
        })
        slider.close(index)
    },








    onLoad: function () {
        this.caclContainerHeight()
        this.data.account.members.onSizeChanged=function(size){
            if(size==1){
                this[0].style.tag0="display:inherit;"
                return
            }
            if(size>=2){
                this.forEach(function(v,i){
                    v.style.tag0 = "display:none;"
                })
                return
            }

        }

        var slidersInfo = {
            //page：page对象
            page: this,
            //checkAngle：是否要检查水平滑动的角度，默认大于15度将认为抽屉时间中断
            checkAngle: false,
            //条目高度
            height: 140,

            //N种状态
            layers: [
                {
                    name: "状态一",
                    buttons: [
                        {
                            text: "成员",
                            color: "white",
                            colorBg: "#2ba245",
                            colorShadow: "black",
                            onClick: "acceptInvite",
                            width: 150
                        },
                        {
                            text: "自费",
                            color: "white",
                            colorBg: "#cdcdcd",
                            colorShadow: "black",
                            onClick: "refuseInvite",
                            width: 150
                        },
                        {
                            text: "规则",
                            color: "white",
                            colorBg: "#cdcdcd",
                            colorShadow: "black",
                            onClick: "refuseInvite",
                            width: 150
                        }
                    ]
                }
            ]
        }

        slider = require('../../utils/slider.js').init(slidersInfo)
        slider.setLayer(0, 0)
        slider.updateLayer(0,[
            {
                text: "添加规则",
                onClick:"showRule",
                visible:true
            },
            {
                text:"添加自费",
                onClick: "showRulePaySelf",
                visible: true
            },
            {
                
                visible: false
            }
        ])

    },

    caclContainerHeight: function () {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    containerHeight: res.windowHeight
                })
            }
        })
    },

    longtap: function (e) {
        console.log(e)
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },



    touchstart: function (e) {
        var a = this
        // debugger
        slider.start(e)
    },
    touchmove: function (e) {
        slider.move(e)
    },
    touchend: function (e) {
        slider.end(e)
    },
    touchcancel: function (e) {
        slider.cancel(e)
    },
    outterScroll: function (e) {
        //   console.log(e)
        slider.breakOnce();
    },
    innerScroll: function (e) {
        //   console.log(e)
    }

})







// id: "abc",
//     name:"新军",
//         icon:"/img/head.jpg",
//             paid_in:88.8,
//                 pay_rule:{
//     type: 0,
//         number:0.2
// },
// money_for_self: 20.5,