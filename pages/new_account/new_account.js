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

        descSliderInfo: {
            index: -1
        },

        //附加图片
        images: [],

        //所有可以选择的成员(相关的分组和自己的帐友集合)
        members: [],

        account: {

            name: "火锅",

            description: "",

            icons: [],

            date: "",

            members: [],

            paidIn:"0.00"
        },
        rule_tyles: [
            { name: '百分比付款', value: 0 },
            { name: '固定值付款', value: 1 }
        ],

        style: {
            picsContainerHeight: "",
            picsPaddingBottom: ""
        }


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
                        text: "删除",
                        color: "white",
                        colorBg: "#2BA245",
                        colorShadow: "black",
                        onClick: "showImageDeteleButtons",
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
     * 账目名称输入改变
     */
    nameInputValueChanged: function (e) {
        this.data.account.name = e.detail.value
    },

    /**
     * 备注输入改变
     */
    descInputValueChanged:function(e){
        this.data.account.description = e.detail.value
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
        member.paidIn = 0
        member.value = {
            tag0: "个人账单",
            tag1: "AA制",
            tag2: "自费10元",
            ruleType: 2,
            paidIn: "￥0.00"
        }
        member.style = {
            member: "height:0;opacity:0;",
            memberRule: "height:0;opacity:0;",
            tag0: "",
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
        var id = this.getSliderData(index).id
        this.removeMemberById(id)
    },
    /**
     * 移除成员
     */
    removeMemberById: function (id) {
        //已添加成员和全部可选成员保持同步
        var item = this.data.account.members.findByAttr("memberId", id)
        slider.deleteItem("id", id);
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

                v.style.tag0 = "display:none;"
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
            //如果剩一个成员,只有当这个成员是自己时才显示个人账单tag
            if (datas[0].memberId == this.data.userInfo.id)
                datas[0].style.tag0 = "display:inherit;"
            else
                datas[0].style.tag0 = "display:none;"
            
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
                    item.paidIn = parseFloat(value).toFixed(2)
                    item.paidIn = item.paidIn < 0 ? 0 : item.paidIn
                    
                    item.value.paidIn = "￥" + item.paidIn
                    if (item.paidIn>0)
                        item.style.paidIn_color ="color:red;"
                    else
                        item.style.paidIn_color = "color:#20B2AA;"

                    //计算总支出
                    var total=0
                    this.data.account.members.forEach(function(v,i){
                        total += parseFloat(v.paidIn)
                    })    
                    this.data.account.paidIn = total.toFixed(2)
                    this.refreshSliderData()
                }
            }
        }

        dialog.showDialog(dialogInfo)

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
                that.data.account.addr_name = res.name
                that.data.account.addr = res.address
                that.data.account.addr_lat = res.latitude
                that.data.account.addr_lon = res.longitude
                that.refreshSliderData()
            },
        })
    },


    /**
     * 选择图片
     */
    chooseImage: function (e) {

        var that = this
        var index = e.target.dataset.index
        if (slider.isSliderOpen(index)) {
            slider.close(index)
            return
        }
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    that.data.images.append({
                        wx_path: res.tempFilePaths[i]
                    })
                    that.uploadImage(res.tempFilePaths[i])
                }
                
            }
        })
    },

    /**
     * 上传图片
     */
    uploadImage: function (filePath) {
        var that = this
        
        var item = that.data.images.findByAttr("wx_path", filePath)
        item.remote_file = "",
        item.progress = 0,
        item.style = {
            deleteVisible: "display:none;",
            maskVisible: ""
        },
        item.value = {
            progressImageSrc: "/img/loading.gif",
            progressText: "",
            retryClick: ""
        }
        that.setData({
            images: that.data.images
        })

        var callback = wx.uploadFile({
            url: APP.globalData.BaseUrl + '/image/upload?token=' + wx.getStorageSync("token"),
            filePath: filePath,
            name: 'image',
            success: function (res) {
                console.log("success")
                console.log(res)
                var data = JSON.parse(res.data)
                if (data.status == APP.globalData.resultcode.INVALID_TOKEN){
                    APP.reLogin({
                        context: that,
                        success: function () {
                            that.uploadImage(filePath)
                        }
                    });
                }




                var item = that.data.images.findByAttr("wx_path", filePath)
                item.remote_file = data.msg
                item.style.maskVisible = "display:none;"
                item.value.isUploaded=true
                that.data.account.icons.push(data.msg)
                that.setData({
                    images: that.data.images
                })
            },
            fail: function (res) {
                console.log("fail")
                console.log(res)
                var item = that.data.images.findByAttr("wx_path", filePath)
                item.style.maskVisible = ""
                item.value = {
                    progressImageSrc: "/img/retry.png",
                    progressText: "重试",
                    retryClick: "onImageUploadRetryClick",
                    isUploaded:true
                }
                that.setData({
                    images: that.data.images
                })
            }
        })
        //没网时callback为undifned
        if(callback)
            callback.onProgressUpdate((res) => {
                var item = that.data.images.findByAttr("wx_path", filePath)
                item.progress = item.progress == 0 && res.progress == 100 ? 0 : res.progress
                item.value.progressText = item.progress == 0 ? "" : item.progress
                console.log("上传图片(" + filePath + "):" + item.progress)
                
                that.setData({
                    images: that.data.images
                })
            })
    },


    /**
     * 点击图片右上角的删除
     */
    onImageDeleteClick: function (e) {
        var index = e.target.dataset.index
        var item = this.data.images[index]
        this.deleteImageFromServer(item.remote_file, function (res) {
            this.data.images.removeObject("remote_file", item.remote_file);
            this.setData({
                images: this.data.images
            })
        })
        
    },

    /**
     * 从服务器删除某个图片
     */
    deleteImageFromServer: function (remote_file, success){
        APP.ajax({
            url: APP.globalData.BaseUrl + '/image/delete/' + remote_file,
            success: success
        }, this)
    },

    /**
     * 点击图片上传的重试
     */
    onImageUploadRetryClick: function (e) {
        var index = e.target.dataset.index
        var item=this.data.images[index]
        this.uploadImage(item.wx_path)
    },

    /**
     * 显示右上角删除图片的红叉
     */
    showImageDeteleButtons:function(){
        for (var i = 0; i < this.data.images.length; i++)
            if (this.data.images[i].value.isUploaded)
                this.data.images[i].style.deleteVisible=""
        
        this.setData({
            images:this.data.images
        })
        slider.updateLayer(this.data.descSliderInfo.index, [
            {
                text: "取消删除",
                onClick: "hideImageDeteleButtons"
            }
        ])
    },
    /**
     * 隐藏右上角删除图片的红叉
     */
    hideImageDeteleButtons: function () {
        for (var i = 0; i < this.data.images.length; i++)
            this.data.images[i].style.deleteVisible = "display:none;"
        
        this.setData({
            images: this.data.images
        })
        slider.updateLayer(this.data.descSliderInfo.index, [
            {
                text: "删除",
                onClick: "showImageDeteleButtons"
            }
        ])
    },



    /**
     * 弹出选择成员的dialog
     */
    showSelectMembersDialog: function (e) {
        //类型为请客,收入时不许添加成员
        if (this.data.account.type == 6 || this.data.account.type == 10) {
            var typeStr = (this.data.account.type == 6 ? "请客" : "收入")
            wx.showToast({
                image: "/img/error.png",
                title: "类型是[" + typeStr + "]时不能有其他成员!",
            })
            return
        }

        var dialogInfo = {
            page: this,
            title: "选择成员",
            singleChoose: this.data.account.type == 9 ? true : false,//借款只允许选择一个其他成员
            members: this.data.members,
            callback: {
                onConfirm: function () {
                    var that = this
                    var members = this.data.members

                    var needAddMbs = []
                    var neenDelMbs = []
                    members.forEach(function (outterValue, i) {
                        //去掉已经添加的
                        var isAdded = false
                        that.data.account.members.forEach(function (innerValue, i) {
                            if (isAdded)
                                return
                            if (innerValue.memberId == outterValue.memberId)
                                isAdded = true

                        })
                        if (outterValue.value && outterValue.value.isSelected) {
                            //已选未添加,添加
                            if (!isAdded)
                                needAddMbs.push(outterValue)
                        } else {
                            //未选已添加,删除
                            if (isAdded) {
                                neenDelMbs.push(outterValue)
                            }

                        }
                    })
                    neenDelMbs.forEach(function (v, i) {
                        that.removeMemberById(v.memberId)
                    })
                    setTimeout(function () {
                        needAddMbs.forEach(function (v, i) {
                            that.addMember(util.clone(v))
                        })
                    }, neenDelMbs.length > 0 ? 600 : 0)



                }
            }
        }

        dialog.showDialog(dialogInfo)
    },








    onLoad: function (option) {
        var that = this
        this.data.account.members.onSizeChanged = function (size) {
            that.refreshTags()
        }
        this.data.images.onSizeChanged = function (size) {
            if (size == 0) {
                that.data.style.picsContainerHeight = ""
                that.data.style.picsPaddingBottom = ""

                slider.close(that.data.descSliderInfo.index)
                slider.updateLayer(that.data.descSliderInfo.index, [
                    {
                        visible:false,
                        text: "删除",
                        onClick: "showImageDeteleButtons"
                    }
                ])

            } else {
                var row = Math.ceil(size / 3)
                var height = 158 * row + row * 20
                that.data.style.picsContainerHeight = "height:" + height + "rpx;"
                that.data.style.picsPaddingBottom = "padding-bottom: 20rpx;"

                slider.updateLayer(that.data.descSliderInfo.index, [
                    {
                        visible: true
                    }
                ])
            }

            that.setData({
                style: that.data.style
            })
        }




        this.initAccount(option)

        this.slidersInfo.page = this
        slider.init(this.slidersInfo)

        slider.setLayer(this.data.descSliderInfo.index, 1)

        this.getTodayDate()

        this.initSelfInfo()

        this.initMembersData()
    },

    onShow: function (options) {
        //切换页面时候需要重新初始化slider,因为require获取的是同一个对象
        slider.init(this.slidersInfo)
    },

    onUnload: function () {
        //退出时如果没有记录这笔账单,那么检查是否添加了图片,有的话删除图片
        for (var i = 0; i < this.data.images.length; i++)
            if (this.data.images[i].value.isUploaded)
                this.deleteImageFromServer(this.data.images[i].remote_file)

            
    },



    /**
     * 当slider捕获到事件时会请求page为其刷新slider中的
     * 描述信息,以显示不同的按钮点击产生不同的事件
     */
    requireSliderUpdate: function (index) {
        this.updateMemberSliderButton(index)
    },





    /**
     * 根据传递的参数初始化account信息
     */
    initAccount: function (option) {
        console.log(option)
        this.data.account.value = {}

        this.data.account.type = parseInt(option.type)
        this.data.account.name = option.name
        this.data.account.value.typeIcon = option.typeIcon

        this.refreshSliderData()
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
                this.data.userInfo = res.data
                var member={
                    memberId:res.data.id,
                    memberName: res.data.name,
                    memberIcon: res.data.icon
                }
                this.addMember(member)
            }

        }, this)
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
                this.setData({
                    members: res.data.members
                })
            }

        }, this)
    },

    /**
     * 上传到服务器
     */
    uploadAccount: function (e) {
        var clone = util.clone(this.data.account, {
            onCopyed: function (obj, attr) {
                //服务器内部图片都是以XzBB结尾
                if (obj[attr] && typeof obj[attr] == 'string' && obj[attr].endsWith("XzBB"))
                    obj[attr] = APP.getImageUri(obj[attr])
            }
        })
        delete clone.style
        delete clone.value
        clone.members.forEach(function(v,i){
            delete v.value
            delete v.style
        })


        clone.user_id = this.data.userInfo.id
        clone.book_id = 0
        clone.icons = JSON.stringify(clone.icons).replace(/\[|\]|\"|\\/g,"")
        var str = JSON.stringify(clone)
        console.log(str)

        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/add?token=' + wx.getStorageSync("token"),
            method:"POST",
            data: {
                content:str
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                wx.showToast({
                    title:res.data.msg
                })
            }

        }, this)

    }
})










