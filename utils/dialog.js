var util = require("util.js")
/**
 * 对话框工具
 */
//通用提示
var tempTip = {
    page: this,
    title: "标题",
    content: "提示文字",
    contentColor: "#f00",
    isTipDialog:true,//没有取消按钮
    callback: {
        onConfirm: function () {},
        onCancel: function () {}
    }
}
//通用输入
var tempInput = {
    page: this,
    title: "标题",
    content: "提示文字",
    contentColor: "#f00",
    //配置了inputType(只能选text,number,digit,idcard其中一个值)时才会显示输入框
    inputType: "number",
    //输入框最长输入字符个数
    maxLength: 10,
    callback: {
        //表单id,输入内容
        onConfirm: function (inputValue) { },
        onCancel: function () { }
    }
}
//成员选择,只适用账单页面
var tempSelectMember = {
    page: this,
    title: "标题",
    singleChoose:true,//是否单选
    members: [],
    callback: {
        onConfirm: function (selectedMembers) { },
        onCancel: function () { }
    }
}
//**************************************************************************** */



















var dialogInfo
var page
/**
 * 弹出一个提醒对话框
 */
function showDialog(dialogInfo) {
    this.dialogInfo = dialogInfo
    this.dialogInfo.style={}
    this.dialogInfo.value = {}


    this.page = dialogInfo.page
    //page是关键字,不删除会有很多warning
    delete dialogInfo.page
    var that = this
    //点击取消
    this.page.dissmiss = function (e) {
        var callback = that.dialogInfo.callback
        if (callback && callback.onCancel)
            callback.onCancel.call(that.page)
        that.dismissDialog();
    }

    //根据属性配置为不同的dialog
    if (dialogInfo.hasOwnProperty("inputType"))
        this.inputDialogSetting()
    else if (dialogInfo.hasOwnProperty("members"))
        this.memberChooserDialogSetting()
    else
        this.tipDialogSetting()

    //内容模糊
    this.dialogInfo.value.blurClass = "blur"
    this.dialogInfo.style.display = "display:flex !important;"

    //animation init
    var transition = "transition:all 0.5s ease;"
    dialogInfo.style.bgAnim = transition + "background-color:rgba(0, 0, 0, 0);"
    dialogInfo.style.dialogAnim = transition + "transform: scale(0, 0);"
    this.page.setData({
        dialogInfo: this.dialogInfo
    })

    //animation start
    setTimeout(function () {

        dialogInfo.style.bgAnim = transition + "background-color:rgba(0, 0, 0, 0.5);"
        dialogInfo.style.dialogAnim = transition + "transform:scale(1,1);"

        this.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 50)
    
}


/**
 * 消失
 */
function dismissDialog(completed) {
    this.dialogInfo.value.blurClass = ""
    this.dialogInfo.value.focus = false
    //animation start
    var transition = "transition: all 0.5s ease;"
    this.dialogInfo.style.bgAnim = transition + "background-color:rgba(0, 0, 0, 0);"
    this.dialogInfo.style.dialogAnim = transition + "transform: scale(0, 0);"

    this.page.setData({
        dialogInfo: this.dialogInfo
    })

    setTimeout(function () {

        this.dialogInfo.style.display = "display:none !important;"
        this.page.setData({
            dialogInfo: this.dialogInfo
        })
        if (completed)
            completed()
    }.bind(this), 500)


}





















/**
 * 提示dialog
 */
function tipDialogSetting() {
    this.dialogInfo.style.dialogWidth = "width:400rpx;"

    this.dialogInfo.style.contentDisplay = ""
    this.dialogInfo.style.inputDisplay = "display:none;"
    this.dialogInfo.style.membersDisplay = "display:none;"


    var that = this
    //点击确定
    this.page.ok = function (e) {
        var callback = that.dialogInfo.callback
        if (callback && callback.onConfirm){
            callback.onConfirm.call(that.page)
            that.dismissDialog();
        }
    }

    if (this.dialogInfo.isTipDialog){
        this.dialogInfo.style.cancelDisplay="display:none;"
        this.page.ok = function (e) {
            if (that.dialogInfo.callback)
                callback.onConfirm.call(that.page)
            that.dismissDialog();
        }
    }else
        this.dialogInfo.style.cancelDisplay = ""
    
}











/**
 * 带输入的dialog
 */
function inputDialogSetting(){
    var that = this
    this.dialogInfo.style.dialogWidth = "width:400rpx;"

    this.dialogInfo.inputValue=""
    this.dialogInfo.style.contentDisplay = ""
    this.dialogInfo.style.inputDisplay = ""
    this.dialogInfo.style.membersDisplay = "display:none;"
    //点击确定
    this.page.ok = function (e) {
        var callback = that.dialogInfo.callback
        //回调中没有完成输入操作时会主动返回false,不返回则认为是完成
        var completed = true
        if (callback && callback.onConfirm)
            completed=callback.onConfirm.call(that.page,that.dialogInfo.inputValue)
        //false时是回调中主动返回的,undefined则是回调中未返回任何东西,那么默认需要关闭
        if (completed == true || completed==undefined)
            that.dismissDialog();
    }
    //弹出输入法
    setTimeout(function () {
        this.dialogInfo.value.focus = true
        this.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 500)

    this.page.inputValueChanged = function (e) {
        that.dialogInfo.inputValue = e.detail.value
    }
}













var originMembers //记录最初的对象,点击取消后需要使用
/**
 * 选择成员的dialog
 */
function memberChooserDialogSetting() {
    var that = this

    //成员对象副本(未修改前)
    this.originMembers = util.clone(this.dialogInfo.members)

    this.dialogInfo.style.contentDisplay = "display:none;"
    this.dialogInfo.style.inputDisplay = "display:none;"
    this.dialogInfo.style.membersDisplay = ""

    
    this.dialogInfo.style.dialogWidth = "width:600rpx;"
    this.dialogInfo.style.membersHeight="height:600rpx;"

    var transition = "transition: all 0.2s ease;"
    //初始化
    this.dialogInfo.members.forEach(function(v,i){
        if (!v.style)
            v.style = {
                selectVisible: transition + "transform: scale(0, 0);"
            }
        if (!v.value)
            v.value = {
                isSelected:false
            }
        v.style.groupFlagVisible = v.isGroup ? "" : "display:none;"
    })

    //点击成员
    this.page.selectMember=function(e){
        var index = e.target.dataset.index
        var item = that.dialogInfo.members[index]

        if (that.dialogInfo.singleChoose){
            that.dialogInfo.members.forEach(function (v, i) {
                if (index==i){
                    v.value.isSelected = true
                    v.style.selectVisible = transition + "transform: scale(1, 1);"
                }else{
                    v.value.isSelected = false
                    v.style.selectVisible = transition + "transform: scale(0, 0);"
                }
            })
        }else{
            item.value.isSelected = !item.value.isSelected
            item.style.selectVisible = transition + (item.value.isSelected ? "transform: scale(1, 1);" : "transform: scale(0, 0);")
        }

        

        that.page.setData({
            dialogInfo: that.dialogInfo
        })
    }


    //点击确定,动画后执行成功回调
    this.page.ok = function () {
        that.dismissDialog(function(){
            var callback = that.dialogInfo.callback

            if (callback && callback.onConfirm)
                callback.onConfirm.call(that.page)
        });
    }


    this.page.dissmiss = function (e) {
        var callback = that.dialogInfo.callback
        if (callback && callback.onCancel)
            callback.onCancel.call(that.page)
        setTimeout(function(){
            //恢复数据为打开dialog之前的状态
            that.dialogInfo.members.forEach(function (v, i) {
                var originItem = that.originMembers[i]
                if (originItem.value)
                    v.value.isSelected = originItem.value.isSelected
                else
                    delete v.value
                if (originItem.style)
                    v.style.selectVisible = originItem.style.selectVisible
                else
                    delete v.style

            })
        },500)
        
        that.dismissDialog();
    }

}














module.exports = {
    showDialog: showDialog,
    dismissDialog: dismissDialog,
    tipDialogSetting: tipDialogSetting,
    inputDialogSetting: inputDialogSetting,
    memberChooserDialogSetting: memberChooserDialogSetting
}
