
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const ngeohash = require('ngeohash')

/**
 * http://localhost:5000/newsByGeoHash?h=xn774cnd&km=100
 * のようなパスを処理する関数
 * @query String h データを取得する中心とするgeohash
 * @query Integer km データを取得する半径
 */
exports.newsByGeoHash = functions.https.onRequest(async (req, res) => {
  let h
  if (req.query.h===undefined){
    // 新宿駅
    h = 'xn774cnd'
  }else{
    h = req.query.h
  }
  let km
  if (req.query.km===undefined){
    km = 10
  }else{
    km = req.query.km
  }

  const decode = ngeohash.decode(h)
  // 緯度の1mぶんにあたる値
  const lat = 0.000008983148616
  // 経度の1mぶんにあたる値
  const lon = 0.000010966382364
  const lowerLat = decode.latitude  - (lat * km * 1000)
  const lowerLon = decode.longitude - (lon * km * 1000)
  const upperLat = decode.latitude  + (lat * km * 1000)
  const upperLon = decode.longitude + (lon * km * 1000)
  const lowerHash = ngeohash.encode(lowerLat, lowerLon)
  const upperHash = ngeohash.encode(upperLat, upperLon)
  // firestoreクエリを組み立てる
  const query = await admin.firestore()
    .collection("news")
    .where("geohash", ">=", lowerHash)
    .where("geohash", "<=", upperHash)
    .limit(1000)
    .get()
  if(query.empty){
    // 0件
    res.status(200).send(JSON.stringify([]))
  }else{
    // query.docs.data()を呼ばないとデータ本体が取得できない
    const results = query.docs.map(doc => {
      const data = doc.data()
      if (data.lat===undefined || data.long===undefined){
        const location = ngeohash.decode(data.geohash);
        data.lat = location.latitude
        data.long = location.longitude
      }
      return data
    })
    res.status(200).send(JSON.stringify(results))
  }
})

/*
import { News } from './news'
const news = new News()
exports.updateAllNews = functions.pubsub.schedule('every 60 minutes').onRun(news.updateAllNews)

import { Twitter } from './twitter'
const twitter = new Twitter()
exports.crawlTwitter = functions.pubsub.schedule('every 10 minutes').onRun(twitter.crawlTwitter)
*/