
/**
 * 1.页面加载的时候
 * 从缓存中获取购物车数据 渲染到页面中这些数据checked属性为true
 * 2.微信支付
 * 哪些人那些账号可以实现微信支付
 * 企业账号 企业账号的小程序后台中必须给开发者添加上白名单 一个appid可以同时绑定多个开发者 这些开发者就可以公用appid和他的开发权限
 * 3.支付按钮，先判断缓存中有没有token
 * 如果没有跳转到授权页面 进行获取token
 * 有token就正常执行
 */
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/index.js
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({
      address
    });

     //总价格 总数量
     let totalPrice=0;
     let totalNum=0;
     cart.forEach(v => {
         totalPrice+=v.num*v.goods_price;
         totalNum+=v.num;
     });
     this.setData({
       cart,
       totalNum,totalPrice,
       address
     });
  },

  //点击支付
  handleOrderPAy(){
    //判断缓存中有没有token
    const token=wx.getStorageSync("token");
    //判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
      console.log("已经存在token");
    }
  }
   

 


 


  
})