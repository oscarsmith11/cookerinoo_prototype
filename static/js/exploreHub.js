
//recipeRef.on("value", gotData, errData)
const { db } = require('./util/admin.js');
var arr = ["da"]

exports.showFavorites = (req, res) => {
  let recipes = []
  db.collection("recipes").get()
    .then((snapshot) => {
      var i = 0;
    snapshot.forEach((doc) => {
      var recipe = { 'id': doc.id, 'recipeDetail': doc.data() }
      recipes.push(recipe);
      i++;
    });
    res.render("explore", { uid : res.locals.uid , favorites: recipes});
    //return res.json(recipes);
  })
    .catch((err) => {
      console.log('Error getting documents', err);
  });
};
