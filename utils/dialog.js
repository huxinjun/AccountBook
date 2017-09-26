/**
 * 对话框工具
 */

var Temp = {
    page: this,
    title: "标题",
    content: "提示文字",
    //配置了inputType(只能选text,number,digit,idcard其中一个值)时才会显示输入框
    inputType: "number",
    //输入框最长输入字符个数
    maxLength: 10,
    callback: {
        onConfirm: function (formId,inputValue) {},
        onCancel: function () {}
    }
}

var dialogInfo
var page
/**
 * 弹出一个提醒对话框
 */
function showDialog(dialogInfo) {
    this.dialogInfo = dialogInfo
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
    this.dialogInfo.blurClass = "blur"
    this.dialogInfo.display = "display:flex !important;"

    //animation init
    var transition = "transition: all 0.5s ease;"
    dialogInfo.bgAnim = transition + "background-color:rgba(0, 0, 0, 0);"
    dialogInfo.dialogAnim = transition + "transform: scale(0, 0);"
    this.page.setData({
        dialogInfo: this.dialogInfo
    })

    //animation start
    setTimeout(function () {

        dialogInfo.bgAnim = transition + "background-color:rgba(0, 0, 0, 0.5);"
        dialogInfo.dialogAnim = transition + "transform:scale(1,1);"

        this.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 50)
    
}

/**
 * 提示dialog
 */
function tipDialogSetting() {
    this.dialogInfo.dialogWidth = "width:400rpx;"

    this.dialogInfo.contentDisplay = ""
    this.dialogInfo.inputDisplay = "display:none;"
    this.dialogInfo.membersDisplay = "display:none;"
    
}

/**
 * 带输入的dialog
 */
function inputDialogSetting(){
    var that = this
    this.dialogInfo.dialogWidth = "width:400rpx;"

    this.dialogInfo.contentDisplay = ""
    this.dialogInfo.inputDisplay = ""
    this.dialogInfo.membersDisplay = "display:none;"
    //点击确定
    this.dialogInfo.submitEventName = "formSubmit"
    this.page.formSubmit = function (e) {
        var callback = that.dialogInfo.callback
        if (callback && callback.onConfirm)
            callback.onConfirm.call(that.page, e.detail.formId, that.dialogInfo.inputValue)
        that.dismissDialog();
    }
    //弹出输入法
    setTimeout(function () {
        this.dialogInfo.focus = true
        this.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 500)

    this.dialogInfo.inputEventName = "inputValueChanged"
    this.page.inputValueChanged = function (e) {
        that.dialogInfo.inputValue = e.detail.value
    }
}
/**
 * 选择成员的dialog
 */
function memberChooserDialogSetting() {
    var that = this
    this.dialogInfo.contentDisplay = "display:none;"
    this.dialogInfo.inputDisplay = "display:none;"
    this.dialogInfo.membersDisplay = ""

    
    this.dialogInfo.dialogWidth = "width:600rpx;"
    this.dialogInfo.membersHeight="height:600rpx;"

}


/**
 * 消失
 */
function dismissDialog() {
    this.dialogInfo.blurClass = ""
    this.dialogInfo.focus = false
    //animation start
    var transition = "transition: all 0.5s ease;"
    this.dialogInfo.bgAnim = transition + "background-color:rgba(0, 0, 0, 0);"
    this.dialogInfo.dialogAnim = transition + "transform: scale(0, 0);"

    this.page.setData({
        dialogInfo: this.dialogInfo
    })

    setTimeout(function () {

        this.dialogInfo.display = "display:none !important;"
        this.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 500)

    
}

module.exports = {
    showDialog: showDialog,
    dismissDialog: dismissDialog,
    tipDialogSetting: tipDialogSetting,
    inputDialogSetting: inputDialogSetting,
    memberChooserDialogSetting: memberChooserDialogSetting
}
