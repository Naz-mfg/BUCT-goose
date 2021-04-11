// miniprogram/pages/delete-Reply-Word/delete-Reply-Word.js
var time = require('../../utils/util.js')
var app = getApp();
let numb=0;
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  //定义所需要用到的变量data
  data: {
    discussShow: false,
    inputMessage: '',
    SendTime: '',
    Time: '',
    HeadImageUrl: '',
    UserName: '',
    PageId: '',
    UpPageId: '',
    RemoveId: '',
    PostUserId: '',
    ReplyOpenId: '',
    PageData: [],
    dataArray: [],
    PostUserData: [],

  },

 actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  bindMenu1: function () {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //添加自己的评论
  formSubmit: function (e) {
    //console.log(e)
    var that = this;
    //that.data.SendTime = time.formatTime(new Date)
    //console.log(that.data.SendTime)
   // console.log('点击评论')
    wx.showToast({
      title: '评论成功',
      icon: 'none'
    })
    this.setData({
      discussShow: true,
      inputMessage: e.detail.value.userName,
      SendTime: Date.now(),
      Time: time.formatTime(new Date)
    })
    // db.collection('Assistant_DataSheet')
    // .doc(that.data.PageId) 
    // .get({
    //   success: function (res) {
    //     console.log(res.data.Reply_Record_num)
    //     that.setData({
    //       numb:res.data.Reply_Record_num
    //     })
    //     }
    //   })   
    //   console.log(numb)
    


    function doubleAfter2seconds() {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            db.collection('Assistant_DataSheet')
            .doc(that.data.PageId) 
            .get({
            success: function (res) {
              console.log(res.data.Reply_Record_num)
              resolve(res.data.Reply_Record_num)
            }
          })   
          }, 2000);
      } )
    }
    async function testResult() {
      let result = await doubleAfter2seconds();
      wx.cloud.callFunction({
        name: 'pinglunadd',
        data: {
          id:that.data.PageId,
          numb:result
        }
      })
    }
    testResult();


    db.collection('My_ReplyData').add({
      data: {
        context: that.data.inputMessage,
        image: that.data.HeadImageUrl,
        time: that.data.SendTime,
        name: that.data.UserName,
        PageId: that.data.PageId,
        PostUserId: that.data.PostUserId,
        PageTime: that.data.Time
      }, success: function (res) {
        that.setData({
          inputMessage: ''
        })
        //刷新页面数据
        db.collection('My_ReplyData').where({
          PageId: that.data.PageId
        }).get({
          success: function (res) {
            that.setData({
              dataArray: res.data
            })
          }
        })
      }
    })
    
  },
  //删除评论
  Remove_Post: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '请问是否删除本条评论？',
      success: function (res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.post_id)//事件的id
          wx.cloud.callFunction({
            name: 'Remove_Reply',
            data: {
              Page_id: e.currentTarget.dataset.post_id,
            },
            success: function (res) {
            //  console.log("删除成功！")
              //刷新页面数据
              db.collection('My_ReplyData').where({
                PageId: that.data.PageId
              }).get({
                success: function (res) {
                  that.setData({
                    dataArray: res.data
                  })
                }
              })
            }
          })
          function doubleAfter2seconds() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.collection('Assistant_DataSheet')
                  .doc(that.data.PageId) 
                  .get({
                  success: function (res) {
                    console.log(res.data.Reply_Record_num)
                    resolve(res.data.Reply_Record_num)
                  }
                })   
                }, 2000);
            } )
          }
          async function testResult() {
            let result = await doubleAfter2seconds();
            wx.cloud.callFunction({
              name: 'pinglundelete',
              data: {
                id:that.data.PageId,
                numb:result
              }
            })
          }
          testResult();

        }
      }
    })


  },
  //获取是否已经有别人评论的信息
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'key',
      success(res) {
        that.setData({
          PageId: res.data.post_id,
          PostUserId: res.data.postopenid
        })

        //根据贴子ID来查找贴子的内容
        db.collection('Assistant_DataSheet').doc(that.data.PageId).get({
          success: function (res) {
            that.setData({
              PageData: res.data  
            })
           // console.log("我是第一个", that.data.PageData.Photo_arr)
          }
          
        })

       // console.log("我是pageid", that.data.PageId)
        //根据贴子的ID获取贴子下面的回复内容
        db.collection('My_ReplyData').where({
          PageId: that.data.PageId
        }).get({
          success: function (res) {
            that.setData({
              dataArray: res.data,
              RemoveId: res.data._id
            })
            //console.log("我是记录ID",RemoveId)
           // console.log("我是第三个")
          }
        })

        //根据发帖人的openid查找他的头像和用户名
        db.collection('Assistant_User').where({
          _openid: that.data.PostUserId
        }).get({
          success: function (res) {
            that.setData({
              PostUserData: res.data
            })
            //console.log("我是第二个", that.data.PostUserData)
          }
        })

        //获取自己的头像和用户名，使其可以在评论栏显示。
        db.collection('Assistant_User').where({
          _openid: app.globalData.openid
        }).get({
          success: function (res) {
            that.setData({
              HeadImageUrl: res.data[0].User_head_url,
              UserName: res.data[0].Username,
              ReplyOpenId: res.data[0]._openid
            })
           // console.log("我是用户的头像和姓名：", that.data.HeadImageUrl)
          }
        })
      }
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading();
  },
})