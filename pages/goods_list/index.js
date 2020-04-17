/**
 * 1.用户赏花页面滚动条触底 开始加载下一页数据
 *  1.找到滚动条触底事件 微信小程序官方开发文档中找
 *  2.判断还有没有下一页数据
 *    加入获取到数据总页数（只有总条数 总页数=Math.ceil（总条数/页容量） Math.ceil(23/10)=3 向上取整 ） 获取到当前的页码 只要判断当前页码是否是大于等于总页数 
 *  3.假如没有下一页数据 弹出一个提示
 *  4.加入还有下一页数据 来加载下一页数据
 *    当前的页码++ 重新发送请求 数据请求回来 要对 data中的数组进行拼接而不是全部替换
 */
/**
 * 下拉刷新页面
 * 1.出发下拉刷新事件 页面的json文件中开启一个配置项 找到出发下拉的事件添加逻辑
 * 2.重置数据数组
 * 3.重置页码 设置为1
 * 4.重新发送请求
 * 5.数据请求回来 需要手动关闭等待效果
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:"",
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //取到分类页面传过来的参数
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    //获取总条数
    const total=res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      //拼接了数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    //关闭下拉菜单的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  //标题的点击事件 从子组件传递过来的
  handleItemTap(e){
    //1.获取被点击的标题索引
    const {index}=e.detail;
    //2 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //赋值到data中
    this.setData({
      tabs
    })
  },

  //页面上滑 滚动条触底事件
  onReachBottom(){
    //判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title:'没有下一页数据了'
      })
    }else{
      //还有下一页数据
      // console.log("有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //充值数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1;
    //发送请求
    this.getGoodsList();
  }

 
})