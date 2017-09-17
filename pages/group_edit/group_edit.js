//index.js
//获取应用实例
var slider
var imageutil = require('../../utils/imageutil.js')
var APP = getApp()
Page({
    data: {
        list: [
            {
                "id": 0,
                "name": "吃饭",
                "icon": "/img/type/gray_food.png"
            },
            {
                "id": 1,
                "name": "租房",
                "icon": "/img/type/gray_housing.png"
            },
            {
                "id": 2,
                "name": "公交",
                "icon": "/img/type/gray_traffic.png"
            },
            {
                "id": 0,
                "name": "吃饭",
                "icon": "/img/type/gray_food.png"
            },
            {
                "id": 1,
                "name": "租房",
                "icon": "/img/type/gray_housing.png"
            },
            {
                "id": 2,
                "name": "公交",
                "icon": "/img/type/gray_traffic.png"
            }
        ]

    },



    onLoad: function (option) {
        console.log('onLoad')
        var that = this
        // if(option.isAddGroup)
        //   this.changeButtonStatus("add_group_info_invalid")
        // else
        this.changeButtonStatus("add_group_info_invalid")

        const canvas = wx.createCanvasContext('canvas')


        imageutil.drawIcon(canvas,'','',{
            success:function(localFile){
                that.setData({
                    group_icon:localFile
                })
            }
        })
    },

    changeButtonStatus:function(status){
        switch(status){
          case "add_group_info_invalid":
            this.setData({
              commit_class: "commit_disable",
              commit_text:"新增分组(红点项必填）",
              deleteStyle: "display:none;",
              quitStyle: "display:none;",
            })
            break;
          case "add_group_info_valid": 
            this.setData({
              commit_class: "commit",
              commit_text: "新增分组",
              commit_hover_class:"commit_hover",
              deleteStyle: "display:none;",
              quitStyle: "display:none;",
            })
            break;
          case "update_admin_member":
            this.setData({
              commit_class: "commit",
              commit_text: "提交更改",
              commit_hover_class: "commit_hover",
              deleteStyle: "",
              quitStyle: "",
            })
            break;
          case "update_admin":
            this.setData({
              commit_class: "commit",
              commit_text: "提交更改",
              commit_hover_class: "commit_hover",
              deleteStyle: "",
              quitStyle: "display:none;",
            })
            break;
          case "update_member":
            this.setData({
              commit_class: "commit",
              commit_text: "提交更改",
              commit_hover_class: "commit_hover",
              deleteStyle: "display:none;",
              quitStyle: "",
            })
            break;

        }
    }

})














