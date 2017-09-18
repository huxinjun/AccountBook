/**
 * 对话框工具
 */

var Temp={
    page:this,
    title:"标题",
    content:"提示文字",
    //配置了inputType(只能选text,number,digit,idcard其中一个值)时才会显示输入框
    inputType:"number",  
    //输入框最长输入字符个数
    maxLength:10,
    callback:{
        onConfirm:function(formId){},
        onCancel: function(){}
    }
}

var dialogInfo
/**
 * 弹出一个提醒对话框
 */
function showDialog(dialogInfo) {
    this.dialogInfo = dialogInfo
    var that=this
    this.dialogInfo.page.dissmiss=function(){
        that.dismissDialog();
    }
    this.dialogInfo.display = "display:flex !important;"
    if (dialogInfo.inputType == 'text' || dialogInfo.inputType == 'number'
        || dialogInfo.inputType == 'digit' || dialogInfo.inputType == 'idcard')
        dialogInfo.inputDisplay ="display:inhert;"
    else
        dialogInfo.inputDisplay = "display:none;"

    this.dialogInfo.page.setData({
        dialogInfo: this.dialogInfo
    })
}


function dismissDialog() {
    this.dialogInfo.display = "display:none !important;"
    this.dialogInfo.page.setData({
        dialogInfo: this.dialogInfo
    })
}

module.exports = {
    showDialog: showDialog,
    dismissDialog: dismissDialog
}
