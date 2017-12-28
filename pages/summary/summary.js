var wxCharts = require('../../utils/wxcharts.js')
var util = require('../../utils/util.js')
var APP = getApp()
var chartMonthPaid//月支出
var chartMonthPaidOther//月支出中其他类型的支出
Page({
    data: {
        monthPaid:{
            dataType: "all",
            selectItem:null,
            style:{
                info: "color:transparent;"
            },
            value:{}
        }
    },

    refreshMonthPaid:function(e){
        this.setData({
            monthPaid: this.data.monthPaid
        })
    },
    getMonthPaidItem: function (index) {
        var isOther = this.data.monthPaid.value.dataType == "other"
        return isOther ? this.data.monthPaid.otherInfos[index]:this.data.monthPaid.infos[index]
    },
    /**
     * 点击月支出饼图中的扇形 
     */
    monthPaidTouch: function (e) {
        var index=chartMonthPaid.getCurrentDataIndex(e)
        var item = this.getMonthPaidItem(index)
        item.monthPaidPercent = (item._proportion_ * 100).toFixed(2)
        this.data.monthPaid.selectItem=item
        this.data.monthPaid.style.info = "color:" + item.color
        if(item.name=='其他')
            this.initMonthForOther()
        else
            this.refreshMonthPaid()
    }, 
    /**
     * 点击月支出其他类型消费饼图中的扇形 
     */  
    monthPaidOtherTouch: function (e) {
        var index = chartMonthPaidOther.getCurrentDataIndex(e)
        var item = this.getMonthPaidItem(index)
        item.monthPaidPercent = (this.data.monthPaid.value.otherTotal / this.data.monthPaid.value.total * item._proportion_ * 100).toFixed(2)
        this.data.monthPaid.selectItem = item
        this.data.monthPaid.style.info = "color:" + item.color
        this.refreshMonthPaid()
    },   
    /**
     * 上一月支出
     */
    cardMonthPaidPre:function(e){
        this.setData({
            queryYear: this.data.queryMonth == 1 ? this.data.queryYear - 1 : this.data.queryYear,
            queryMonth: this.data.queryMonth == 1 ? 12 : this.data.queryMonth-1
        })
        this.initMonthAll()
    },
    /**
     * 下一月支出
     */
    cardMonthPaidNext: function (e) {
        this.setData({
            queryYear: this.data.queryMonth == 12 ? this.data.queryYear + 1 : this.data.queryYear,
            queryMonth: this.data.queryMonth == 12 ? 1 : this.data.queryMonth + 1
        })
        this.initMonthAll()
    },

    /**
     * 月支出从其他返回到全部
     */
    cardMonthPaidBack:function(){
        this.initMonthAll()
    },

    onLoad: function (e) {
        var cardWidth=util.rpx2px(650)
        this.setData({
            cw:cardWidth,
            ch: cardWidth
        })
        this.onPullDownRefresh()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth()+1
        this.setData({
            queryYear:year,
            queryMonth:month
        })
        this.initMonthAll()
    },

    /**
     * 月支出比例
     */
    initMonthAll: function (option) {
        var date = new Date()
        var currYear = date.getFullYear()
        var currMonth = date.getMonth() + 1

        this.data.monthPaid.style.next = (this.data.queryYear == currYear && this.data.queryMonth == currMonth) ? "visibility:hidden;" : ""
        this.data.monthPaid.selectItem = null
        this.data.monthPaid.style.info = "color:transparent;",
        this.refreshMonthPaid()
        APP.ajax({
            url: APP.globalData.BaseUrl + '/summary/getMonthPaid',

            data: {
                token: wx.getStorageSync("token"),
                year: this.data.queryYear,
                month: this.data.queryMonth
            },

            success: function (res) {
                if (res.data.infos.length==0){
                    this.data.monthPaid.value.nullData=true
                    this.data.monthPaid.value.desc = "该月无支出"
                    this.refreshMonthPaid()
                    return
                }
                chartMonthPaid = new wxCharts({
                    animation: true,
                    canvasId: 'chartMonthPaidCanvas',
                    type: 'pie',
                    series: res.data.infos,
                    width: this.data.cw,
                    height: this.data.ch,
                    dataLabel: true,
                });
                //计算月总支出
                var total=0
                res.data.infos.forEach(function(v,i){
                    total+=v.data
                })
                this.data.monthPaid.infos=res.data.infos
                this.data.monthPaid.value.nullData = false
                this.data.monthPaid.value.dataType= "all"
                this.data.monthPaid.value.total=total
                this.data.monthPaid.value.desc="月总支出" + total + "元"
                this.refreshMonthPaid()
            },
            complete:function(){
                wx.stopPullDownRefresh()
            }


        }, this)
    },
    /**
     * 月支出中其他类型下数据的比例
     */
    initMonthForOther: function (option) {
        this.data.monthPaid.selectItem = null
        this.data.monthPaid.style.info = "color:transparent;",
        this.refreshMonthPaid()
        APP.ajax({
            url: APP.globalData.BaseUrl + '/summary/getMonthPaidForOther',

            data: {
                token: wx.getStorageSync("token"),
                year: this.data.queryYear,
                month: this.data.queryMonth
            },

            success: function (res) {
                
                chartMonthPaidOther = new wxCharts({
                    animation: true,
                    canvasId: 'chartMonthPaidOtherCanvas',
                    type: 'pie',
                    series: res.data.infos,
                    width: this.data.cw,
                    height: this.data.ch,
                    dataLabel: true,
                });
                //计算该月其他类型的总支出
                var total = 0
                res.data.infos.forEach(function (v, i) {
                    total += v.data
                })
                this.data.monthPaid.otherInfos = res.data.infos
                this.data.monthPaid.value.nullData = false
                this.data.monthPaid.value.dataType = "other"
                this.data.monthPaid.value.otherTotal = total
                this.data.monthPaid.value.desc = this.data.queryYear + "年" + this.data.queryMonth + "月其他类型支出" + total + "元"
                this.refreshMonthPaid()
            }


        }, this)
    },
});