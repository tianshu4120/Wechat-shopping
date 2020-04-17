import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/asyncWx.js";
Page({
    //获取用户信息
    async handleGetUserInfo(e){
     try {
        //获取用户信息
      const {encryptedData,rawData,iv,signature}=e.datail;
      //获取小程序登陆成功后的code
     const {code}=await login();
     const loginParams={encryptedData,rawData,iv,signature,code};
     //发送请求获取用户token值
     const res=await request({url: "/users/wxlogin",data: loginParams,mathod: "post"});//没有企业权限就不能获取token成功
     //把token存储到缓存中 同时跳转回上一页面
     wx.setStorageSync("token",token);
     wx.navigateBack({
       delta: 1
     });
     } catch (error) {
       console.log(error);
     }

    }
 
})