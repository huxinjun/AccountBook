//index.js
//获取应用实例
var slider
var APP = getApp()
var dialog = require("../../utils/dialog.js")
Page({
    data: {

        groupInfo: {
            group: {
                name: "",
                desc: ""
            },
            members:[]
        }

    },

    /**
     * 获取分组信息
     */
    pullGroupInfo: function (groupId) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/get',
            data: {
                groupId: "n8Y5qSAmisgEjG_BQdRiiA==",
                token: wx.getStorageSync("token")
                
            },

            success: function (res) {
            }

        }, this)
    },

    /**
     * 新增分组
     */
    addGroup: function (e) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/add',

            data: {
                token: wx.getStorageSync("token"),
                name: this.data.groupInfo.group.name,
                desc: this.data.groupInfo.group.desc
            },

            success: function (res) {
                this.pullGroupInfo(res.data.msg)
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
        if (this.data.nameValid && this.data.descValid)
            this.changeButtonStatus("add_group_info_valid")
        else
            this.changeButtonStatus("add_group_info_invalid")
    },
    /**
     * 显示或隐藏分类条目的小红点
     */
    setDescValid: function (valid) {
        this.setData({
            descValid: valid,
            descPointStyle: valid ? "display:none;" : "display:inherit;"
        })
        if (this.data.nameValid && this.data.descValid)
            this.changeButtonStatus("add_group_info_valid")
        else
            this.changeButtonStatus("add_group_info_invalid")
    },




    onLoad: function (option) {
        console.log('onLoad')
        var that = this
        
        if (!option.groupId) {
            //添加分组
            this.changeButtonStatus("add_group_info_invalid")
        } else{
            //编辑分组
            this.pullGroupInfo(option.groupId)
        }
    },

    /**
     * 改变三个按钮的状态
     */
    changeButtonStatus: function (status) {
        switch (status) {
            case "add_group_info_invalid":
                this.setData({
                    commit_class: "commit_disable",
                    commit_text: "新增分组(红点项必填）",
                    commit_click:"",
                    membersStyle:"display:none;",
                    deleteStyle: "display:none;",
                    quitStyle: "display:none;",
                })
                break;
            case "add_group_info_valid":
                this.setData({
                    commit_class: "commit",
                    commit_text: "新增分组",
                    commit_click: "addGroup",
                    commit_hover_class: "commit_hover",
                    membersStyle: "display:none;",
                    deleteStyle: "display:none;",
                    quitStyle: "display:none;",
                })
                break;
            case "update_admin_member":
                this.setData({
                    commit_class: "commit",
                    commit_text: "提交更改",
                    commit_click: "updateGroup",
                    commit_hover_class: "commit_hover",
                    membersStyle: "",
                    deleteStyle: "",
                    quitStyle: "",
                })
                break;
            case "update_admin":
                this.setData({
                    commit_class: "commit",
                    commit_text: "提交更改",
                    commit_hover_class: "commit_hover",
                    membersStyle: "",
                    deleteStyle: "",
                    quitStyle: "display:none;",
                })
                break;
            case "update_member":
                this.setData({
                    commit_class: "commit",
                    commit_text: "提交更改",
                    commit_hover_class: "commit_hover",
                    membersStyle: "",
                    deleteStyle: "display:none;",
                    quitStyle: "",
                })
                break;

        }
    },

    /**
     * 点击名称条目
     */
    inputName: function (e) {
        var dialogInfo = {
            page: this,
            title: "输入",
            content: "输入分组的名称,最长8位",
            inputType: "text",
            maxLength: 8,
            callback: {
                onConfirm: function (formId, inputValue) {
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
    inputDesc: function (e) {
        var dialogInfo = {
            page: this,
            title: "输入",
            content: "输入分组的描述,相同的描述在分组界面会显示在一起",
            inputType: "text",
            maxLength: 8,
            callback: {
                onConfirm: function (formId, inputValue) {
                    if (inputValue)
                        inputValue = inputValue.replace(/\s+/g, '')
                    this.data.groupInfo.group.desc = inputValue
                    this.setData({
                        groupInfo: this.data.groupInfo
                    })
                    //判断是否不是空的
                    if (inputValue && inputValue != '')
                        this.setDescValid(true)
                    else
                        this.setDescValid(false)
                },
                onCancel: function () { }
            }
        }
        dialog.showDialog(dialogInfo)
    },

    

    /**
     * 更新分组信息
     */
    updateGroup: function (e) {

    },

    /**
     * 添加成员
     */
    addMember: function (e) {

    },

    /**
     * 成员按下,进行动画
     */
    memberTouchDown:function(e){
        if(e.target.dataset.index)
            this.setData({
                memberAnim: "transform:scale(0.9,0.9);"
            })
        else
            this.setData({
                memberAddAnim:"transform:scale(0.9,0.9);"
            })
    },

    /**
     * 添加成员按钮按下,进行动画
     */
    memberTouchUp: function (e) {
        if (e.target.dataset.index)
            this.setData({
                memberAnim: "transform:scale(1,1);"
            })
        else
            this.setData({
                memberAddAnim: "transform:scale(1,1);"
            })
    }
    


})














