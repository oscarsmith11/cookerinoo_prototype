const { admin, auth, db, firestore } = require("./util/admin.js");


exports.loadTrendData = async (req, res) => {
  var keywordArr = []
  const keywords = await db.collection("keywords").get()
  .then(snapshot => {
    snapshot.forEach((item, i) => {
      var obj = {
        "keyword": item.id,
        "count": item.data().count
      }
      keywordArr.push(obj);
    });
  })
  keywordArr.sort((a, b) => b.count - a.count)

  var populars = [];
  const getPopulars = await db.collection('trends').doc('populars').get()
  .then(doc => {
    if(doc.exists) {
      populars = doc.data().popular;
      populars.sort((a, b) => b.count - a.count)
    }
  })

  var favorites = [];
  const getFavorites = await db.collection('trends').doc('favorites').get()
  .then(doc => {
    if(doc.exists) {
      favorites = doc.data().favorites;
      favorites.sort((a, b) => b.count - a.count)
    }
  })
    res.render("manage-trends", {keywords : keywordArr, populars : populars , favorites : favorites});
}

exports.uploadPopulars = (req, res) => {
  const popular = req.body;
  db.collection('trends').doc('populars').set({popular});
  res.send("succes")
}

exports.uploadFavorites = (req, res) => {
  const favorites = req.body;
  db.collection('trends').doc('favorites').set({favorites});
  res.send("succes")
}
