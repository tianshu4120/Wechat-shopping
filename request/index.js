//promise方法 避免了一层一层的回调函数
//同时发送异步代码的次数
let ajaxTimes=0;
//es6模块化
export const request=(params)=>{//暴露 导出request模块
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title:"加载中",
        mask:true
    })

    //定义公共的url
    //url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,//服务器的url地址
            url:baseUrl+params.url,
            success:(result)=>{//成功
                resolve(result.data.message);//返回结果
            },
            fail:(err)=>{//失败
                reject(err);
            },
            complete:()=>{//不管请求成功与否 都会执行
                ajaxTimes--;
                if(ajaxTimes===0){
                    //关闭正在加载的图标
                    wx.hideLoading();
                }
            }
        });
    })
}