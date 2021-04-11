const app = getApp()
var template = require('../../template/template.js');
var util=require('../../utils/util.js');
Page({

  data: {
    avatarUrl: '',
    userInfo: {},
  },

onLoad: function (options) {

    },

    getUserProfile: function (e)  
    {
      let that=this
      const db = wx.cloud.database({ env: 'try-2gufwkut86ac8afb' })
      wx.getUserProfile({
        desc:'获取你的昵称、头像、地区及性别',//声明获取用户个人信息后的用途，后续会展示在弹窗中
        success: res => {
          console.log("获取用户信息成功",res)
          db.collection("Assistant_User").add({
            data:{
              Username: res.userInfo.nickName,
              User_head_url: res.userInfo.avatarUrl
            }
          })
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName
          })
          
          wx.cloud.callFunction({
            name: 'login'
            }).then(res=>{
              this.setData({
                myopenid:res.result.openid
              }),
              db.collection("Assistant_User").where({
                _openid:this.data.myopenid
              }).get().then(res=>{
                if(res.data.length)
                {
                  console.log()
                  this.setData({
                    hasuse:true,
                    Username: that.data.userInfo.nickName,
                    Last_to_Reply: Date.now(),
                    Last_toup_Time: Date.now(),
                    User_head_url: that.data.userInfo.avatarUrl,
                    Creat_user_Time: Date.now()
      
                  })
                }
              })
            })
            .then(res => {
              console.log(res);
              wx.switchTab({
                url: '../Mine_page/Mine_page',
              })
            })  
          },


        
      })
    }

})
