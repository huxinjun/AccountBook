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
        onConfirm: function (formId) { },
        onCancel: function () { }
    }
}

var dialogInfo
/**
 * 弹出一个提醒对话框
 */
function showDialog(dialogInfo) {
    this.dialogInfo = dialogInfo
    var that = this
    //点击取消
    this.dialogInfo.page.dissmiss = function (e) {
        var callback = that.dialogInfo.callback
        if (callback && callback.onCancel)
            callback.onCancel()
        that.dismissDialog();
    }
    //点击确定
    this.dialogInfo.submitEventName = "formSubmit"
    this.dialogInfo.page.formSubmit = function (e) {
        var callback=that.dialogInfo.callback
        if (callback && callback.onConfirm)
            callback.onConfirm(e.detail.formId, that.dialogInfo.inputValue)
        that.dismissDialog();
    }
    //内容模糊
    this.dialogInfo.blurClass = "blur"
    this.dialogInfo.display = "display:flex !important;"
    //是否需要输入
    var isInputDialog = dialogInfo.inputType == 'text' || dialogInfo.inputType == 'number'
        || dialogInfo.inputType == 'digit' || dialogInfo.inputType == 'idcard'
    if (isInputDialog)
        dialogInfo.inputDisplay = "display:inhert;"
    else
        dialogInfo.inputDisplay = "display:none;"

    //animation start
    var transition = "transition: all 0.5s ease;"
    dialogInfo.bgAnim = transition + "background-color:rgba(0, 0, 0, 0);"
    dialogInfo.dialogAnim = transition + "transform: scale(0, 0);"


    this.dialogInfo.page.setData({
        dialogInfo: this.dialogInfo
    })

    setTimeout(function () {

        dialogInfo.bgAnim = transition + "background-color:rgba(0, 0, 0, 0.5);"
        dialogInfo.dialogAnim = transition + "transform:scale(1,1);"

        this.dialogInfo.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 50)

    if (isInputDialog){
        setTimeout(function () {
            this.dialogInfo.focus = true
            this.dialogInfo.page.setData({
                dialogInfo: this.dialogInfo
            })
        }.bind(this), 500)
        
        this.dialogInfo.inputEventName ="inputValueChanged"
        this.dialogInfo.page.inputValueChanged = function (e) {
            that.dialogInfo.inputValue=e.detail.value
        }
    }
    
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

    this.dialogInfo.page.setData({
        dialogInfo: this.dialogInfo
    })

    setTimeout(function () {

        this.dialogInfo.display = "display:none !important;"
        this.dialogInfo.page.setData({
            dialogInfo: this.dialogInfo
        })
    }.bind(this), 500)
}

module.exports = {
    showDialog: showDialog,
    dismissDialog: dismissDialog
}
