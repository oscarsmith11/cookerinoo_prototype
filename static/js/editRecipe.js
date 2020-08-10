const { admin, auth, db, firestore } = require("./util/admin.js");

exports.showEditPage = (req, res) => {
  const recipeId = req.params.id;
  var recipe;
  const getRecipe = db.collection('recipes').doc(recipeId).get()
  .then(doc => {
    recipe = doc.data()
    recipe.id = recipeId;

    // set one value for kind
    const keys = Object.keys(recipe.kind)
    var kind;
    const filtered = keys.filter(function(key) {
      var item = recipe.kind[key];
      if(item == true) {
        kind = key;
      }
    })
    recipe.kind = kind
    // make keyword string
    var keywordString = "";
    recipe.keywords.forEach((item, i) => {
      keywordString += "@" + item;
    });
    recipe.keywords = keywordString;
    res.render("editRecipe", { recipe : recipe})
  })
}

exports.editRecipe = async (req, res) => {
  const recipe = req.body,
    id = req.params.id;
  console.log(recipe);
  
  if(recipe.keywordsChange) {
    var oldKeywords;
    const getOldKeywords = await db.collection('recipes').doc(id).get();
    oldKeywords = getOldKeywords.data().keywords;
    console.log("old ones");
    console.log(oldKeywords);
    for(keyword of oldKeywords) {
      keyword = keyword.toLowerCase().trim();
  
      var getCount = await db.collection("keywords").doc(keyword).get();
      var newCount = getCount.data().count - 1;
      console.log("olf from old" + getCount.data().count + "new from old" + newCount);
      // remove id and count from old keyword
      var removeIds = await db.collection('keywords').doc(keyword).update({
        ids: admin.firestore.FieldValue.arrayRemove(id),
        count: newCount
      })
    }
  }

  const updateRecipe = await db.collection('recipes').doc(id).update(recipe);

if(recipe.keywordsChange) {
  // add id and count to new keywords
  console.log("new ones");
  console.log(recipe.keywords);
  for(key of recipe.keywords) {
    key = key.toLowerCase().trim();

    var getCount = await db.collection("keywords").doc(key).get();
    if(getCount.data() != null) {
      var count = getCount.data().count + 1;
      console.log("old from new" + getCount.data().count + "new from new" + count);
      console.log(count);
      db.collection('keywords').doc(key).update({
        ids: admin.firestore.FieldValue.arrayUnion(id),
        count: count
      });
    } else {
      console.log("new");
      db.collection('keywords').doc(key).set({
        count: Number(1),
        ids: [id]
      });
    }
  }
}
res.send('succes')
}
