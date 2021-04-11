// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database({ env: 'try-2gufwkut86ac8afb' })
// 云函数入口函数

exports.main = async(event, context) => {
  
  // let data = {
  //   atcId: event.atcId
  // }
  // if (event.cuDate) {
  //   data.cuDate = event.cuDate
  // }
  return await db.collection('Assistant_DataSheet')
  .skip(event.skip)
  .limit(20)
  .get()
}