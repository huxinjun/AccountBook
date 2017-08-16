//index.js
//获取应用实例
var APP = getApp()
Page({
    data: {
        list: [
            {
                "id":0,
                "name":"吃饭",
                "icon":"/img/type/gray_food.png"
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
                "id": 3,
                "name": "打车",
                "icon": "/img/type/gray_car.png"
            },
            {
                "id": 4,
                "name": "信用卡还钱",
                "icon": "/img/type/gray_refund.png"
            },
            {
                "id": 5,
                "name": "请客",
                "icon": "/img/type/gray_gam.png"
            },
            {
                "id": 6,
                "name": "零食",
                "icon": "/img/type/gray_snacks.png"
            },
            {
                "id": 6,
                "name": "购物",
                "icon": "/img/type/gray_shopping.png"
            },
            {
                "id": 7,
                "name": "其他",
                "icon": "/img/type/gray_other.png"
            }

        ],
    },
    
    onLoad: function () {
        var that = this
        this.setData({
            list:this.data.list
        })
    }
})

