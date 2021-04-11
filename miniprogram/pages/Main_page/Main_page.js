var app = getApp()
var util=require('../../utils/util.js');
//var template = require('../../template/template.js');
var UserIdArry = new Array()
var UserUpId = new Array()
var SellUserId = new Array()
var SellUserUpId = new Array()
let cishu=0
Page({

  data: {
    navbar: ['社区广场'],
    currentTab: 0,
    DataPostArry:[],
    UserHeadurlArry:[],
    UpArray: [],
    UsernameArry: [],
    UserId:'',//app.globalData.openid
    replyData: [],
    //分页
     perNum: 20, // 每页多少条纪录数量
     totalCount: 0, // 总共的纪录条数
     maxPage: 0, // 最大页码
  },
  
    /** 
     * 预览图片 
     */
  previewImage: function (e) {
    //console.log(e)
    //var current = e.target.dataset.src;
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [e.target.dataset.myimg], // 需要预览的图片http链接列表
    })
  },
  // navbarTap: function (e) {
  //   this.setData({
  //     currentTab: e.currentTarget.dataset.idx
  //   })
  //   console.log(currentTab)
  //   {this.get_DBinf();}
  // },

  onLoad: function (options){
   
  const db = wx.cloud.database({ env: 'try-2gufwkut86ac8afb' })
  db.collection('Assistant_DataSheet')
 // .where(data)
  .count()
  .then(res => {
      this.data.totalCount = res.total
      // 得到总页数
      this.data.maxPage = Math.floor(this.data.totalCount / this.data.perNum);
      if (this.data.totalCount % this.data.perNum != 0) {
        this.data.maxPage += 1
      }
      console.log('this.data.maxPage', this.data.maxPage)
      this.setData({
        maxPage:this.data.maxPage
      })
    })
    let that=this
    wx.getStorage({
      key: 'Userinfo',
      success(res) {
        //console.log(res.data) //userinfo
      }
    })
    //console.log(util.formatTime(new Date()));
    //this.get_DBinf();
    //this.navbarTap();
    //this.get_Sell_DBinf();
  },
  
  upclickbutton: function (e) {
    //点赞
    var that = this
    var ind = e.currentTarget.dataset.nowindex
    //console.log("Post_id:" + e.currentTarget.dataset.post_id)
    const postuserid = e.currentTarget.dataset.postopenid

    console.log(this.data.UpArray[ind] == 0)

    if (this.data.UpArray[ind] == 0)//说明没点赞过
    {

      var nowup = 'UpArray[' + ind + ']'//设置为点赞过
      this.setData({
        [nowup]: 1
      })
      const db = wx.cloud.database({ env: 'try-2gufwkut86ac8afb' })
      return db.collection('Assistant_Up').add({ //添加帖子
        data: {
          Up_Post_id: e.currentTarget.dataset.post_id,
          Up_id: e.currentTarget.dataset.postopenid,
          Time_s: Date.now()
        }
      }).then(res => {
        console.log("Assistant_Up OK!");
        console.log("Pick the post_id:"+e.currentTarget.dataset.post_id);
        wx.cloud.callFunction({
          name: 'Up_Assistant_Post',
          data: {
            Post_id: e.currentTarget.dataset.post_id,
          },
          success: function (res) {
            console.log("Up_Assistant_Post OK!");
            that.get_DBinf()
            wx.showToast({
              title: '已点赞',
              image: '../../images/Up_heart.png',
              duration: 2000
            })
          },
          fail: err => {
            console.log('error:', err)
          }
        })
      })
    }
    else{
      wx.showToast({
        title: '已点赞过',
        image: '../../images/Up_heart2.png',
        duration: 2000
      })
    }
  },
  Remove_Post:function(e){
    //删除发表的内容
    let that = this
    wx.showModal({
      title: '提示',
      content: '请问是否删除本条？',
      success: function (res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.post_id)//事件的id
          wx.cloud.callFunction({
            name: 'Remove_Assistant_DataSheet',
            data: {
              youid: e.currentTarget.dataset.post_id,
            },
            success: function (res) {
              that.get_DBinf()
            }
          })
        }
      }
    })
  },
  to_Reply: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.post_id);//事件的id
    console.log(e.currentTarget.dataset.postopenid);//创建表的用户openid
    //console.log(e.currentTarget.dataset)
    that.setData({
      replyData: e.currentTarget.dataset
    })
    console.log(that.data.replyData)
    wx.setStorage({
      key: "key",
      data: that.data.replyData
    })
    wx.navigateTo({
      url: '../Reply_page/Reply_page',
    
    })
  },
  onShow(){
    this.get_DBinf();
    //this.get_Sell_DBinf();
  },
  get_DBinf:function(){
   let that = this
    wx.getStorage({
      key: 'User_openid',
      success(res) {
        that.setData({
          UserId: res.data
        })
        ////
        var db = wx.cloud.database()//{ env: 'mfg-6gia7x6l0f60f614' }
        let userid = res.data;
        //console.log("My openid:"+userid);
        db.collection('Assistant_Up').where({//获取自己的点赞列表
          _openid: userid
        })
        .skip(20*cishu)
        .get({
          success: res => {   
            
            //console.log("点赞列表:", res.data)

            for (var i = 0; i < res.data.length; i++) {
              UserUpId[i] = res.data[i].Up_Post_id//点赞列表赋值
            }

            db.collection('Assistant_DataSheet').get({
              success: res => {
                //console.log("Assistant_DataSheet Res"+res);
                console.log(res),
                that.setData({
                  alldata: res.data//所有的用户列表数据
                })
                for (var i = 0; i < res.data.length; i++) {
                  UserIdArry[i] = res.data[i]._id  //所有的用户列表_id
                  if (UserUpId.indexOf(UserIdArry[i]) == -1) {
                    var item = 'UpArray[' + i + ']'
                    that.setData({
                      [item]: 0
                    })
                  }
                  else {
                    var item = 'UpArray[' + i + ']'
                    that.setData({
                      [item]: 1
                    })
                  }
                }
                //console.log(that.data.UpArray)
              }
            })
          },
        })
      }
    })
    const get_inf_db = wx.cloud.database()//{ env: 'mfg-6gia7x6l0f60f614' }
    get_inf_db.collection('Assistant_DataSheet')
    .skip(20*cishu)
    .get({
      success: res => {
        that.setData({
          DataPostArry: res.data
        })
        Promise.all(res.data.map((item)=>{
          return item._openid
        })).then(res=>{
          let _ = get_inf_db.command;
            get_inf_db.collection('Assistant_User').where({
              _openid: _.in(res)
            }).get().then(res => {
              that.data.UsernameArry = [];
              that.data.UserHeadurlArry=[];
              for (let i = 0; i < this.data.DataPostArry.length;i++){
                let openId = this.data.DataPostArry[i]._openid;
                for(let j=0;j<res.data.length;j++){
                  if(openId == res.data[j]._openid){
                    that.data.UsernameArry.push(res.data[j].Username);
                    that.data.UserHeadurlArry.push(res.data[j].User_head_url);
                  }
                }
              }
              that.setData({
                UsernameArry: that.data.UsernameArry,
                UserHeadurlArry: that.data.UserHeadurlArry
              });
            })

        }).catch((ex)=>{
          console.log(ex);
        })

      }
    })
  },
  onPageData(){
    cishu=cishu-1
    console.log('加载更多···')
    const db = wx.cloud.database({ env: 'try-2gufwkut86ac8afb' })
    db.collection('Assistant_DataSheet')
    //.skip(20)
    .get()
    .then(res=>{
      console.log('获取成功',res)
      this.setData({
        cishu:cishu
      })
      {this.get_DBinf();}//重新刷新
      console.log('已经重新刷新')
    })
    .catch(res=>{
      console.log('获取失败',res)
    })
  },
  downPageData(){
    cishu=cishu+1
    console.log('加载更多···')
    const db = wx.cloud.database({ env: 'try-2gufwkut86ac8afb' })
    db.collection('Assistant_DataSheet')
    //.skip(20)
    .get()
    .then(res=>{
      console.log('获取成功',res)
      this.setData({
        cishu:cishu
      })
      {this.get_DBinf();}//重新刷新
      console.log('已经重新刷新')
    })
    .catch(res=>{
      console.log('获取失败',res)
    })
  },
  // onReachBottom:function(){
  //   cishu=cishu+1
  //   console.log('加载更多···')
  //   const db = wx.cloud.database({ env: 'mfg-6gia7x6l0f60f614' })
  //   db.collection('Assistant_DataSheet')
  //   //.skip(20)
  //   .get()
  //   .then(res=>{
  //     console.log('获取成功',res)
  //     this.setData({
  //       cishu:cishu
  //     })
  //     {this.get_DBinf();}//重新刷新
  //     console.log('已经重新刷新')
  //   })
  //   .catch(res=>{
  //     console.log('获取失败',res)
  //   })
  // }

})

