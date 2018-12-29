
const app = getApp()
import common from '../../../utils/common.js';
import api from '../../../utils/api.js';
import util from '../../../utils/util.js';
let http = common.https;
let ReachBottom = false;
let WxParse = require("../../../wxParse/wxParse.js");


Page({
    data:{
        obj: {},
        curpage: 0,
        totalPage: 0,
        dataList: [],
        erCode:"",
        image:"",
        winHeight:"",//窗口高度
        currentTab:0, //预设当前项的值
        scrollLeft:0, //tab标题的滚动条位置
        expertList:[{ //假数据
            img:"avatar.png",
            name:"欢顔",
            tag:"知名情感博主",
            answer:134,
            listen:2234
        }]
    },
    // 滚动切换标签样式
    switchTab:function(e){
        this.setData({
            currentTab:e.detail.current
        });
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav:function(e){
        var cur=e.target.dataset.current;
        if(this.data.currentTaB==cur){return false;}
        else{
            this.setData({
                currentTab:cur
            })
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor:function(){
      if (this.data.currentTab>4){
        this.setData({
          scrollLeft:300
        })
      }else{
        this.setData({
          scrollLeft:0
        })
      }
    },
    onLoad: function() {  
        var that = this; 
        wx.showLoading({
          title: '加载中',
        })
        that.getData(0);
        that.getQrcodeData();

        //  高度自适应
        wx.getSystemInfo( {  
            success: function( res ) {  
                var clientHeight=res.windowHeight,
                    clientWidth=res.windowWidth,
                    rpxR=750/clientWidth;
              var  calc=clientHeight*rpxR-180;
                console.log(calc)
                that.setData( {  
                    winHeight: calc  
                });  
            }  
        });
    },  
    //获取列表数据
    getData() {
        const that = this;
        const curpage = that.data.curpage;
        let obj = {
        curpage,
        };
        common.post(
        api.getInviteUser_url,
        obj,
        res => {
            let datas = res.datas;
            let dataList = that.data.dataList;
            
            that.setData({
            dataList: datas,
            dataList: [...dataList, ...res.datas],
            curpage: curpage + 1,
            totalPage: res.page_total
            })
            console.log(that.data.dataList);
            wx.hideLoading()
            ReachBottom = false;
            if (res.code !== 200) {
            return wx.showToast({
                title: res.datas.error,
            })
            }

        }, '')

    },
    getQrcodeData() {
        const that = this;
        let obj = {
            key :wx.getStorageSync('keys').key
            };
        common.post(
        api.getQr_code_url,
        obj,
        res => {
            let datas = res.datas;
            let erCode = that.data.erCode;
            that.image = res.datas.image;
  
            WxParse.wxParse('img', 'html', res.datas.content, that, 5)
            that.setData({
            erCode: datas,
            })
            wx.hideLoading()
        }, '')

    },

    //上拉加载
    onReachBottom() {
        const that = this;
        if (ReachBottom) return;
        const page = that.data.curpage;
        if (page > that.data.totalPage) {
        that.setData({
            ReachBottomBloo: true
        })
        return;
        }
        wx.showLoading({
        title: '加载中',
        })
        that.getData()
    },
    //下拉刷新
    onPullDownRefresh() {
        const that = this;
        wx.showLoading({
        title: '加载中',
        })
        that.setData({
        curpage: 0
        })
        that.getData(true)
    },
    footerTap:app.footerTap
})
