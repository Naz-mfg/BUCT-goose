// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'try-2gufwkut86ac8afb' })
// 云函数入口函数
exports.main = async (event, context) =>
 {
  const Post_id = event.youid
  return db.collection('Assistant_DataSheet').doc(Post_id).remove({
  }).then(res => { 
    console.log(res);
  })
}