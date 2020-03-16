//引入用来发送请求的方法引入要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数据
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.发送异步请求 获取轮播图数据
    //优化手段：通过ES6的promise来解决这个问题
  //   wx.request({
  //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //     success: (result)=>{
  //       this.setData({
  //         //取数据
  //         swiperList:result.data.message
  //       })
  //     }
  //   });
  this.getSwiperList();
  this.getCatesList();
  this.getFloorList();

  },

  // 获取轮播图数据
getSwiperList(){
    request({ url: "/home/swiperdata"})
    .then(result =>{
      this.setData({
        //取数据
        swiperList:result.data.message
      })
  })
},
 // 获取导航分类数据
 getCatesList(){
  request({ url: "/home/catitems"})
  .then(result =>{
    this.setData({
      //取数据
      catesList:result.data.message
    })
  })
},
 // 获取楼层数据
 getFloorList(){
  request({ url: "/home/floordata"})
  .then(result =>{
    this.setData({
      //取数据
      floorList:result.data.message
    })
  })
}

})