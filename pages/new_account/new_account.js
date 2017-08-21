//index.js
//获取应用实例
var APP = getApp()
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
                    text: {
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
        ]
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
            text: {
                tag0: "个人账单",
                tag1: "AA制",
                tag2: "自费10元"
            }
        })

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
            account: this.data.account
        })
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
    hideRuleTypeRadio: function (e) {
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