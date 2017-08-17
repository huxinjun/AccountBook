//index.js
//获取应用实例
var APP = getApp()
Page({
    data: {
        account:{

            name:"火锅",


            members:[{
                id:"abc",
                name:"新军",
                icon:"/img/head.jpg",
                paid_in:88.8,
                pay_rule:{
                    type:0,
                    number:0.2
                },
                money_for_self:20.5
                
            },{
                
            }]
        }
    },
    
    onLoad: function () {
        var that = this
    },

    longtap:function(e){
        console.log(e)
    }

})

