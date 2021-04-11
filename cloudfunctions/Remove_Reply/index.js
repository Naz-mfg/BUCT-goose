// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'try-2gufwkut86ac8afb' })
// 云函数入口函数
exports.main = async (event, context) =>
 {
  //const Post_id = event.youid
  //console.log(Post_id)
  return db.collection('My_ReplyData')
  .doc(event.Page_id)
  .remove()
}