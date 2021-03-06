//获取应用实例
var APP = getApp()
var dialog = require("../../utils/dialog.js")
Page({
    data: {
        groupInfo: {
            group: {
                name: "",
                category: ""
            },
            users:[]
        },
        //opt:1.new,2.edit
        opt:""

    },

    /**
     * 获取分组信息
     */
    pullGroupInfo: function (groupId) {
        
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/get',
            data: {
                groupId: groupId,
                token: wx.getStorageSync("token")
                
            },

            success: function (res) {
                if(res.data.group==null){
                    wx.showToast({
                        title: '不存在的组',
                    })
                    setTimeout(function () {
                        wx.navigateBack()
                    }, 1000)
                    return
                }
                this.setData({
                    groupInfo:res.data,
                    userInfo:this.data.userInfo
                })
                console.log(res.data.isAdmin + "............." + res.data.isMember)
                if (res.data.isAdmin && res.data.isMember)
                    this.changeButtonStatus("update_admin_member")
                else if (res.data.isAdmin)
                    this.changeButtonStatus("update_admin")
                else if (res.data.isMember)
                    this.changeButtonStatus("update_member")

                this.setMemberVisible(true)
                this.setNameValid(true)
                this.setCategoryValid(true)
            }

        }, this)
    },

    /**
     * 新增分组
     */
    addGroup: function (e) {
        console.log("addGroup")
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/add',

            data: {
                token: wx.getStorageSync("token"),
                name: this.data.groupInfo.group.name,
                category: this.data.groupInfo.group.category
            },

            success: function (res) {
                this.pullGroupInfo(res.data.msg)
            }

        }, this)
    },

    /**
     * 更新分组信息
     */
    updateGroup: function (e) {
        console.log("updateGroup")
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/update',

            data: {
                token: wx.getStorageSync("token"),
                groupId: this.data.groupInfo.group.id,
                name: this.data.groupInfo.group.name,
                category: this.data.groupInfo.group.category
            },

            success: function (res) {
                this.pullGroupInfo(this.data.groupInfo.group.id)
            }

        }, this)
    },


    /**
     * 添加成员
     */
    addMember: function (e) {
        wx.navigateTo({
            url: '/pages/qr_image/qr_image?title=扫码进组&groupId=' + this.data.groupInfo.group.id.encode(),
        })
    },

    /**
     * 退出分组
     */
    quitGroup: function (e) {
        console.log("quitGroup")
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/quit',

            data: {
                token: wx.getStorageSync("token"),
                groupId: this.data.groupInfo.group.id
            },

            success: function (res) {
                wx.showToast({
                    title: res.data.msg
                })
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)
            }

        }, this)
    },

    /**
     * 解散并删除
     */
    deleteGroup: function (e) {
        console.log("deleteGroup")
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/delete',

            data: {
                token: wx.getStorageSync("token"),
                groupId: this.data.groupInfo.group.id
            },

            success: function (res) {
                wx.showToast({
                    title: res.data.msg
                })
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)
            }

        }, this)
    },


    /**
     * 管理员自己入组
     */
    selfJoinGroup:function(e){
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/join',

            data: {
                token: wx.getStorageSync("token"),
                groupId: this.data.groupInfo.group.id
            },

            success: function (res) {
                wx.showToast({
                    title: res.data.msg
                })
                this.pullGroupInfo(this.data.groupInfo.group.id)
            }

        }, this)
    },














    /**
     * 显示或隐藏名称条目的小红点
     */
    setNameValid: function (valid) {
        this.setData({
            nameValid: valid,
            namePointStyle: valid ? "display:none;" : "display:inherit;"
        })
        var isAddGroup=this.data.groupInfo.group.id==undefined
        var isAllValid = this.data.nameValid && this.data.categoryValid
        this.commitEnable(isAllValid, isAddGroup ? "addGroup" :"updateGroup")

        if (isAddGroup)
            if (isAllValid)
                this.changeButtonStatus("add_group_info_valid")
            else
                this.changeButtonStatus("add_group_info_invalid")

    },
    /**
     * 显示或隐藏分类条目的小红点
     */
    setCategoryValid: function (valid) {
        this.setData({
            categoryValid: valid,
            categoryPointStyle: valid ? "display:none;" : "display:inherit;"
        })
        var isAddGroup = this.data.groupInfo.group.id == undefined
        var isAllValid = this.data.nameValid && this.data.categoryValid
        this.commitEnable(isAllValid, isAddGroup ? "addGroup" : "updateGroup")

        if (isAddGroup)
            if (isAllValid)
                this.changeButtonStatus("add_group_info_valid")
            else
                this.changeButtonStatus("add_group_info_invalid")
    },

    /**
     * 设置是否显示成员
     * 添加分组时不显示
     */
    setMemberVisible: function (visible) {
        this.setData({
            membersStyle: visible ? "" : "display:none;"
        })
    },




    onLoad: function (option) {
        console.log(option)
        var that = this
        this.setMemberVisible(false)

        var groupId = option.groupId
        
        if (!groupId) {
            this.data.opt='new'
            //添加分组
            this.changeButtonStatus("add_group_info_invalid")
            this.commitEnable(false)
        } else{
            this.data.opt = 'edit'
            //编辑分组
            //获取分组信息
            this.data.groupId = groupId.decode()
            this.pullGroupInfo(this.data.groupId)
        }

        this.setData({
            opt: this.data.opt
        })
    },


    /**
     * 提交按钮的开启关闭和对应的点击事件
     */
    commitEnable: function (enable,funcName) {
        console.log("commitEnable:" + enable + "-----------" + funcName)
        this.setData({
            commit_class: enable ?"commit":"commit_disable",
            commit_click: enable ? funcName:"",
            commit_hover_class: enable ?"commit_hover":""
        })
    },

    /**
     * 改变提交的状态
     */
    changeButtonStatus: function (status) {
        switch (status) {
            case "add_group_info_invalid":
                this.setData({
                    commit_text: "新增分组(红点项必填）"
                })
                break;
            case "add_group_info_valid":
                this.setData({
                    commit_text: "新增分组"
                })
                break;
            case "update_admin_member":
            case "update_admin":
            case "update_member":
                this.setData({
                    commit_text: "提交更改"
                })
                break;

        }
    },

    /**
     * 点击名称条目
     */
    inputName: function (e) {
        //只有当前用户是管理员,并且正在编辑分组时才可以打开输入弹窗
        if (this.data.opt == 'edit')
            if (!(this.data.groupInfo && this.data.groupInfo.isAdmin))
                return
        var dialogInfo = {
            page: this,
            title: "输入",
            content: "输入分组的名称,最长8位",
            inputType: "text",
            maxLength: 8,
            callback: {
                onConfirm: function (inputValue) {
                    if (inputValue)
                        inputValue = inputValue.replace(/\s+/g, '')
                    this.data.groupInfo.group.name = inputValue
                    this.setData({
                        groupInfo: this.data.groupInfo
                    })
                    //判断是否不是空的
                    if (inputValue && inputValue != '')
                        this.setNameValid(true)
                    else
                        this.setNameValid(false)
                },
                onCancel: function () { }
            }
        }
        dialog.showDialog(dialogInfo)

    },

    /**
     * 点击描述条目
     */
    inputCategory: function (e) {
        //只有当前用户是管理员,并且正在编辑分组时才可以打开输入弹窗
        if (this.data.opt == 'edit')
            if (!(this.data.groupInfo && this.data.groupInfo.isAdmin))
                return
        var dialogInfo = {
            page: this,
            title: "输入",
            content: "输入分组的描述,相同的描述在分组界面会显示在一起",
            inputType: "text",
            maxLength: 20,
            callback: {
                onConfirm: function (inputValue) {
                    if (inputValue)
                        inputValue = inputValue.replace(/\s+/g, '')
                    this.data.groupInfo.group.category = inputValue
                    this.setData({
                        groupInfo: this.data.groupInfo
                    })
                    //判断是否不是空的
                    if (inputValue && inputValue != '')
                        this.setCategoryValid(true)
                    else
                        this.setCategoryValid(false)
                },
                onCancel: function () { }
            }
        }
        dialog.showDialog(dialogInfo)
    },


    /**
     * 成员按下,进行动画
     */
    memberTouchDown:function(e){
        var index = e.target.dataset.index
        console.log(index)
        if (index!=undefined){
            var member = this.data.groupInfo.users[index]
            member.memberAnim = "transform:scale(0.9,0.9);"
            this.setData({
                groupInfo:this.data.groupInfo
            })
        }else
            this.setData({
                memberAddAnim:"transform:scale(0.9,0.9);"
            })
    },

    /**
     * 添加成员按钮按下,进行动画
     */
    memberTouchUp: function (e) {
        var index = e.target.dataset.index

        if (index != undefined) {
            var member = this.data.groupInfo.users[index]
            member.memberAnim = "transform:scale(1,1);"
            this.setData({
                groupInfo: this.data.groupInfo
            })
        } else
            this.setData({
                memberAddAnim: "transform:scale(1,1);"
            })
    },

    /**
     * 预览头像
     */
    iconPreview:function(e){
        var page=this
        if (!page.data.groupInfo.group.icon)
            return
        wx.previewImage({
            urls: [
                page.data.groupInfo.group.icon
            ],
        })
    }
    


})














