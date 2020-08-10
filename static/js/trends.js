
//recipeRef.on("value", gotData, errData)
const { db } = require('./util/admin.js');
var arr = ["da"]

exports.showFavorites = async (req, res) => {
  var favorites
  console.log('wwwww')
  const getFavorites = await db.collection('trends').doc('favorites').get()
  .then(doc => {
    favorites = doc.data().favorites;
    favorites.sort((a, b) => b.count - a.count)
  })
  res.render("exploreFavorites", { uid : res.locals.uid , favorites : favorites});
}

exports.showTopTrends = async (req, res) => {
  var populars;
  const getPopulars = await db.collection('trends').doc('populars').get()
  .then(doc => {
    populars = doc.data().popular;
    populars.sort((a, b) => b.count - a.count)
  })
  res.render("explorePopulars", { uid : res.locals.uid , populars : populars });

}

exports.showNewTrends = (req, res) => {
  res.render("explore", { uid : res.locals.uid });
}
