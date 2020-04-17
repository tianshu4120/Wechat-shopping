/**
 * 获取用户收货地址
 * 1.绑定点击事件
 * 2.调用小程序内置api 获取用户收货地址  wx.chooseAddress
 * 
 * 2.获取用户对小程序所搜授予获取地址的权限状态scope
 *  假如用户点击获取收货地址的提示框 点击确定 authSetting scope.address scope为true 可以直接调用获取收货地址
 *  假如用户点击获取收货地址的提示框 取消 scope为false 诱导用户自己打开授权设置页面 当用户重新给予获取地址权限的时候 获取收货地址
 * 假设用户从来没有调用过收货地址api scope为undifine 可以直接调用获取收货地址
 * 
 * 把获取到的收货地址存储到本地缓存中
 * 
 * 页面加载完毕
 * onload onshow
 * 获取本地存储中的地址数据
 * 把数据设置给data中的一个变量
 * 
 * 页面onshow
 * 回到商品详情页面 第一次添加商品的时候 手动添加了属性
 *   num=1；checked=true
 * 获取缓存中的购物车数组
 * 把购物车数据填充到data中
 * 
 * 全选实现 数据的展示
 * 再onshow里面获取缓存中的购物车数组
 * 根据购物车中的商品数据 所有商品都被选中checked=true  全选就被选中
 * 
 * 总价格和总数量
 * 都需要商品被选中 我们才用它来计算
 * 获取到购物车数组
 * 遍历
 * 判断商品是否被选中
 * 总价格+=商品的单价*商品的数量
 * 总数量+=商品的数量
 * 把计算后的价格和数量 设置会data中即可
 * 
 * 商品的选中功能
 * 绑定change事件
 * 获取到被修改的商品对象
 * 商品对象的选中状态 取反
 * 重新填充回data中和缓存中
 * 重新计算全选 总价格
 * 
 * 全选和反选
 * 全选的复选框绑定事件change
 * 获取data中的全选变量 allchecked
 * 直接取反 
 * 遍历购物车数组 让里面的购物车商品选中状态跟随allchecked改变
 * 把购物车数组和allchecked重新设置回data中 把购物车重新设置回缓存中
 * 
 * 商品数量的编辑
 * + — 按钮绑定同一个点击事件 区分的关键在于自定义属性
 *  + +1 
 *  - -1
 * 传递被点击的商品id goods_id
 * 获取到data中的购物车数组 来获取需要被修改的商品对象
 * 当购物车数量为1时点击 - 
 *   弹窗提示（showModal）是否要删除 进行删除操作 
 * 直接修改商品对象的数量属性num
 * 把cart数组 重新设置回缓存和data中 this.setCart()
 * 
 * 点击结算
 * 判断有没有收货地址
 * 判断有没有选购商品
 * 经过以上验证 跳转到支付页面
 */
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/index.js
Page({
  data:{
    address:{},
    cart:[],
    allchecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    this.setData({
      address
    });
    this.setCart(cart);
  },
    //点击收货地址
    async handleChooseAddress(){
    try {
          //获取权限状态
          const res1=await getSetting();
          const scopeAddress=res1.authSetting["scope.address"];
          //判断权限状态
          if(scopeAddress===false){
            //先诱导用户打开授权页面
            await openSetting();
          }
          //调用获取收货地址的api
          let address=await chooseAddress();
          address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
          //存入缓存中
          wx.setStorageSync("address",address);
    }
     catch (error) {
      console.log(error);
    }
  },

  //商品的选中
  handeItemChange (e){
    //获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //获取购物车数组
    let {cart}=this.data;
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //选中状态取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
   
  },

  //设置购物车状态同时 重新计算底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allchecked=true;
    //总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allchecked=false;
      }
      
    });
  //判断数组是否为空
    allchecked=cart.length!=0?allchecked:false;
    this.setData({
      cart,
      totalNum,totalPrice,allchecked
    });
    wx.setStorageSync("cart",cart);
  },

  //商品的全选功能
  handleItemAllCheck(){
    //获取data中的数据
    let {cart,allchecked}=this.data;
    //修改值
    allchecked=!allchecked;
    //循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allchecked);
    //把修改后的值设置回data中 或者缓存中
    this.setCart(cart);
  },

  //商品数量的编辑功能
  async handleItemNumEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //获取购物车数组
    let {cart}=this.data;
    //找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      //弹窗提示
      const res =await showModal({content:"您是否要删除？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
    //进行修改数量
    cart[index].num+=operation;
    //设置回缓存和data中
    this.setCart(cart);
    }
   
  },

  //点击 结算
  async handlePay(){
    //判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})