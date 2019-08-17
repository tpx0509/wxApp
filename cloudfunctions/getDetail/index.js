// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp = require("request-promise")
// 云函数入口函数
exports.main = async (event, context) => {
  return rp(`http://api.douban.com/v2/movie/subject/${event.movieId}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
  .then(res => {
     console.log(res)
     return res
  })
  .catch(err => {
     console.error(err)
     return err
  })
}