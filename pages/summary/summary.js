var wxCharts = require('../../utils/wxcharts.js')
var util = require('../../utils/util.js')
var APP = getApp()
var chartMonthPaid//月支出饼图
var chartMonthPaidOther//月支出中其他类型的支出饼图
var chartYearMonthPaid//年度支出柱状图
var chartYearMonthReceipt//年度收入柱状图

Page({
    data: {
        monthPaid:{
            selectItem:null,
            style:{
                info: "color:transparent;"
            },
            value:{
                dataType: "all"
            }
        },
        yearMonthPaid: {
            chartData:null,
            style: {},
            value: {
                dataType: "year"
            }
        },
        yearMonthReceipt: {
            chartData: null,
            style: {},
            value: {
                dataType: "year"
            }
        }
    },

    refreshMonthPaid:function(){
        this.setData({
            monthPaid: this.data.monthPaid
        })
    },
    refreshYearMonthPaid: function () {
        this.setData({
            yearMonthPaid: this.data.yearMonthPaid
        })
    },
    refreshYearMonthReceipt: function () {
        this.setData({
            yearMonthReceipt: this.data.yearMonthReceipt
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
        if(index==-1)
            return
        var item = this.getMonthPaidItem(index)
        item.monthPaidPercent = (item._proportion_ * 100).toFixed(1)
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
        if (index == -1)
            return
        var item = this.getMonthPaidItem(index)
        item.monthPaidPercent = (this.data.monthPaid.value.otherTotal / this.data.monthPaid.value.total * item._proportion_ * 100).toFixed(1)
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

    

    /**
     * 柱状图从月视图切换回年视图(支出)
     */
    cardYearMonthPaidBack: function () {
        this.data.yearMonthPaid.value.dataType = 'year'
        this.data.yearMonthPaid.value.desc = ''
        this.refreshYearMonthPaid()
        chartYearMonthPaid.updateData({
            categories: this.data.yearMonthPaid.chartData.main.categories,
            series: [{
                name: '支出额(元)',
                data: this.data.yearMonthPaid.chartData.main.data,
                format: function (val, name) {
                    return val==0?0:val.toFixed(1);
                }
            }]
        });
    },

    /**
     * 柱状图年度支出小条点击了(支出)
     */
    yearMonthPaidTouch: function (e) {
        var index = chartYearMonthPaid.getCurrentDataIndex(e);
        if (index > -1 && index < this.data.yearMonthPaid.chartData.sub.length && this.data.yearMonthPaid.value.dataType=='year') {
            this.data.yearMonthPaid.value.dataType='month'
            this.data.yearMonthPaid.value.desc = this.data.yearMonthPaid.chartData.main.categories[index] +"年度总支出"
            this.refreshYearMonthPaid()

            chartYearMonthPaid.updateData({
                categories: this.data.yearMonthPaid.chartData.sub[index].categories,
                series: [{
                    name: '支出额(元)',
                    data: this.data.yearMonthPaid.chartData.sub[index].data,
                    format: function (val, name) {
                        return val == 0 ? 0 : val.toFixed(1);
                    }
                }]
            });

        }
    },






    /**
     * 柱状图从月视图切换回年视图(收入)
     */
    cardYearMonthReceiptBack: function () {
        this.data.yearMonthReceipt.value.dataType = 'year'
        this.data.yearMonthReceipt.value.desc = ''
        this.refreshYearMonthReceipt()
        chartYearMonthReceipt.updateData({
            categories: this.data.yearMonthReceipt.chartData.main.categories,
            series: [{
                name: '收入额(元)',
                data: this.data.yearMonthReceipt.chartData.main.data,
                format: function (val, name) {
                    return val == 0 ? 0 : val.toFixed(1);
                }
            }]
        });
    },

    /**
     * 柱状图年度支出小条点击了(收入)
     */
    yearMonthReceiptTouch: function (e) {
        var index = chartYearMonthReceipt.getCurrentDataIndex(e);
        if (index > -1 && index < this.data.yearMonthReceipt.chartData.sub.length && this.data.yearMonthReceipt.value.dataType == 'year') {
            this.data.yearMonthReceipt.value.dataType = 'month'
            this.data.yearMonthReceipt.value.desc = this.data.yearMonthReceipt.chartData.main.categories[index] + "年度总收入"
            this.refreshYearMonthReceipt()

            chartYearMonthReceipt.updateData({
                categories: this.data.yearMonthReceipt.chartData.sub[index].categories,
                series: [{
                    name: '收入额(元)',
                    data: this.data.yearMonthReceipt.chartData.sub[index].data,
                    format: function (val, name) {
                        return val == 0 ? 0 : val.toFixed(1);
                    }
                }]
            });

        }
    },






















    onLoad: function (e) {
        var cardWidth = util.rpx2px(650)
        this.setData({
            cw: cardWidth,
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
        this.initYearMonthPaid()
        this.initYearMonthReceipt()
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
    /**
     * 年度支出柱状图
     */
    initYearMonthPaid: function (option) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/summary/getYearMonthPaid',

            data: {
                token: wx.getStorageSync("token")
            },
            // var chartData = {
            //     main: {
            //         data: [15, 20, 45, 37],
            //         categories: ['2012', '2013', '2014', '2015']
            //     },
            //     sub: [{
            //         data: [70, 40, 65, 100, 34, 18],
            //         categories: ['1', '2', '3', '4', '5', '6']
            //     }, {
            //         data: [55, 30, 45, 36, 56, 13],
            //         categories: ['1', '2', '3', '4', '5', '6']
            //     }, {
            //         data: [76, 45, 32, 74, 54, 35],
            //         categories: ['1', '2', '3', '4', '5', '6']
            //     }, {
            //         data: [76, 54, 23, 12, 45, 65],
            //         categories: ['1', '2', '3', '4', '5', '6']
            //     }]
            // };
            success: function (res) {
                var chartData={
                    main:{
                        data: [],
                        categories: [] 
                    },
                    sub:[]
                }
                //统计所有支出数据
                for(var year in res.data.map){
                    var yearPaid=0
                    var chartDataMonth={
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    }
                    for (var month in res.data.map[year]) {
                        var monthPaid = parseFloat(res.data.map[year][month])
                        yearPaid+=monthPaid
                        chartDataMonth.data.splice(month-1,1,monthPaid)
                    }

                    chartData.main.data.push(yearPaid)
                    chartData.main.categories.push(year)
                    chartData.sub.push(chartDataMonth)
                }
                
                this.data.yearMonthPaid.chartData = chartData

                chartYearMonthPaid = new wxCharts({
                    canvasId: 'chartYearMonthPaidCanvas',
                    type: 'column',
                    animation: true,
                    categories: chartData.main.categories,
                    series: [{
                        name: '支出额(元)',
                        data: chartData.main.data,
                        format: function (val, name) {
                            return val == 0 ? 0 : val.toFixed(1);
                        }
                    }],
                    yAxis: {
                        format: function (val) {
                            return val;
                        },
                        min: 0
                    },
                    xAxis: {
                        disableGrid: false,
                        type: 'calibration'
                    },
                    extra: {
                        column: {
                            width: 15
                        }
                    },
                    width: this.data.cw,
                    height: this.data.ch,
                });
            }


        }, this)
    },


    /**
     * 年度收入柱状图
     */
    initYearMonthReceipt: function (option) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/summary/getYearMonthReceipt',

            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                var chartData = {
                    main: {
                        data: [],
                        categories: []
                    },
                    sub: []
                }
                //统计所有支出数据
                for (var year in res.data.map) {
                    var yearReceipt = 0
                    var chartDataMonth = {
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    }
                    for (var month in res.data.map[year]) {
                        var monthReceipt = parseFloat(res.data.map[year][month])
                        yearReceipt += monthReceipt
                        chartDataMonth.data.splice(month-1,1,monthReceipt)
                    }
                    chartData.main.data.push(yearReceipt)
                    chartData.main.categories.push(year)
                    chartData.sub.push(chartDataMonth)
                }
                this.data.yearMonthReceipt.chartData = chartData

                chartYearMonthReceipt = new wxCharts({
                    canvasId: 'chartYearMonthReceiptCanvas',
                    type: 'column',
                    animation: true,
                    categories: chartData.main.categories,
                    series: [{
                        name: '收入额(元)',
                        data: chartData.main.data,
                        format: function (val, name) {
                            return val == 0 ? 0 : val.toFixed(1);
                        }
                    }],
                    yAxis: {
                        format: function (val) {
                            return val;
                        },
                        min: 0
                    },
                    xAxis: {
                        disableGrid: false,
                        type: 'calibration'
                    },
                    extra: {
                        column: {
                            width: 15
                        }
                    },
                    width: this.data.cw,
                    height: this.data.ch,
                });
            }


        }, this)
    },
});