//index.js
//获取应用实例
var APP = getApp()
var slider
Page({
    data: {
        windowHeight: 0,
        windowWidth:0,

        account: {

            name: "火锅",


            members: [
                {

                    //account data----------------------------------
                    id: "abc",
                    name:"新军",
                    icon:["/img/head.jpg"],
                    paid_in:88.8,
                    // pay_rule:{
                    //     type: 0,    //0:百分比  1:固定数额
                    //     number:0.2
                    // },
                    // money_for_self: 20.5,

                    //binding data----------------------------------
                    style: {
                        member: "height:140rpx;",
                        memberRule: "height:0;",
                        memberRuleType: "height:0;",

                        memberTrans:"",
                        memberRuleTrans: "",
                        memberRuleTrans: "",
                        tag0: "",
                        tag1: "display:none;",
                        tag2: "display:none;"
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
    /**
     * 添加规则
     */
    addRule:function(index,tp,num){
        var member = this.getSliderData(index)
        member.pay_rule={
            type: tp,
            number: num
        }
        getSliderData(index).style.tag1 = "display:inherit;"
    },
    /**
     * 删除规则
     */
    removeRule: function (index) {
        var member = this.getSliderData(index)
        delete member.pay_rule
        getSliderData(index).style.tag1 = "display:none;"

    },
    /**
     * 是否有特殊规则
     */
    hasRule: function (index) {
        var member = this.getSliderData(index)
        return member.pay_rule!=undefined
    },
    /**
     * 添加自费
     */
    addMoneyForSelf: function (index,num) {
        var member = this.getSliderData(index)
        member.money_for_self=num
        getSliderData(index).style.tag2 = "display:inherit;"
    },
    /**
     * 删除自费
     */
    removeMoneyForSelf: function (index) {
        var member = this.getSliderData(index)
        delete member.money_for_self
        getSliderData(index).style.tag2 = "display:none;"
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
    updateMemberSliderButton:function(index){
        if (this.getSliderData().length == 1) {
          slider.updateLayer(0, [
            { visible: false },
            { visible: false },
            { visible: false }
          ])
          return
        }

        var info=[{},{},{}]
        if(this.hasRule(index)){
          info[2].visible=true
          info[2].text="删除规则"
          info[2].onClick ="removeRule"
        }else{
          info[2].visible = false
        }

        if (this.hasMoneyForSelf(index)) {
          info[1].visible = true
          info[1].text = "删除自费"
          info[1].onClick = "removeMoneyForSelf"
        } else {
          info[1].visible = true
          info[1].text = "添加自费"
          info[1].onClick = "addMoneyForSelf"
        }

        if (index!=this.getSliderData().length-1) {
          info[0].visible = true
          info[0].text = "删除成员"
          info[0].onClick = "removeMember"
        } else {
          info[0].visible = false
        }

        

        slider.updateLayer(index,info)

    },


    /**
     * 获取某个抽屉数据附加的list条目对象
     */
    getSliderData: function (index) {
        if (index == undefined)
            return this.data.account.members
        return this.data.account.members[index]
    },
    /**
     * 刷新抽屉数据
     */
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
                tag0: "",
                tag1: "display:inherit;",
                tag2: "display:none;"
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
    removeMember: function (e) {
      var index=e.target.dataset.index
      console.log("delete:"+index);
      slider.deleteItem(index);
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
                this[0].style.tag1 = "display:none;"
                this[0].style.tag2 = "display:none;"
                
                return
            }
            if(size>=2){
                this.forEach(function(v,i){
                    v.style.tag0 = "display:none;"
                    v.style.tag1 = "display:inherit;"
                })
                return
            }

        }

        var slidersInfo = {
            //page：page对象
            page: this,
            //条目高度
            height: 140,
            windowWidth: this.data.windowWidth,
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
                console.log(res)
                that.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
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
        //拉开时确定要显示的按钮
        var index = e.target.dataset.index
        this.updateMemberSliderButton(index)
        slider.start(e)
        console.log("touchstart:"+index)
    },
    touchend: function (e) {
        slider.end(e)
    },
    touchcancel: function (e) {
        slider.cancel(e)
    },
    outterScroll: function (e) {
        
    },
    innerScroll: function (e) {
        slider.scroll(e)
    }

})







