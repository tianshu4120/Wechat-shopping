//引入用来发送请求的方法引入要把路径补全
import { request } from "../../request/index.js";
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList:[],
    //右侧商品数据
    rightContent:[],
    //被点击的左侧的菜单
    currentIndex:0,
    //右侧内容滚动条距离顶部的距离
    scrollTop:0

  },
  //接口返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*web中的本地存储和小程序中的本地存储区别
    1.写代码的方式不同
    web:localStorage.setItem("key","value") 取localStorage.getItem("key")
    小程序：wx.setStorageSync("key","value") 取wx-getStorageSync("key");
    2.存的时候有没有做类型转换
    web；不管存入的是什么类型的数据，最终都会先调用一下toString（），把数据变成了字符串 再存进去
    小程序：不存在类型转换这个操作，存什么类型的数据进去，获取的时候就是什么类型

    
    先判断本地存储中有没有旧的数据
    {time:Date.now(),data[...]}
    没有旧数据 直接发送新请求
    有旧的数据 同时 旧的数据也没有国企 就是用本地存储中的旧数据即可 */

    //获取本地存储中的数据（小程序中也存在本地存储这个技术）
    const Cates=wx.getStorageSync("cates");
    //判断
    if(!Cates){
      //不存在 发送请求获取数据
      this.getCates();
    }else{
      //有旧数据 判断是否过期 定义过期时间 10s 改成5分钟
      if(Date.now() - Cates.time > 1000 * 10){
        //如果过期 重新发送请求
        this.getCates();
      }else{
        //可以使用旧的数据
        this.Cates=Cates.data;
          //渲染左侧大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //渲染右侧商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }
    }

  },
  //获取分类数据
  getCates(){
    request({url:"/categories"})
    .then(res=>{
      //先获取所有数据再拆分两侧的数据
      this.Cates=res.data.message;

      //把接口的数据存入到本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

      //构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    // 获取被点击的标题身上的索引
    //给data中的currentIndex赋值
    //根据不同的索引来渲染右侧的商品内容
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })

    
  }

})