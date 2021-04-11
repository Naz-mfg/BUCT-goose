// miniprogram/pages/Choose_Type/Choose_Type.js
Page({

  data: {

  },

  onLoad: function (options) {
   
  },
  Touch:function(e){
    //console.log(parseInt(e.currentTarget.dataset.touch_id))//点击的对应的事件

    //1-学习生活 2心情 3恋爱 
    let Temp_Type;
    let item = parseInt(e.currentTarget.dataset.touch_id);
    switch (item){
      case 1:Temp_Type = "学习生活";break;
      case 2: Temp_Type = "心情吐槽";break;
      case 3: Temp_Type = "恋爱日常";break;
    }
    wx.setStorage({
      key: 'PostType',
      data: Temp_Type,
    })
    if(item>=1 && item<=3){
      wx.navigateTo({
        url: '../Creat_Topic/Creat_Topic',
      })
   
    }
  }

 
})