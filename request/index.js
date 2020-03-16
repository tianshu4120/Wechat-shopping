//promise方法 避免了一层一层的回调函数
export const request=(params)=>{
    //定义公共的url
    //url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,//服务器的url地址
            url:baseUrl+params.url,
            success:(result)=>{//成功
                resolve(result);//返回结果
            },
            fail:(err)=>{//失败
                reject(err);
            }
        });
    })
}