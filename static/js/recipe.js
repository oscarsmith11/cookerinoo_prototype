const { admin, auth, db, firestore } = require("./util/admin.js");

exports.addRecipeCount = async (req, res, next) => {
  var getCount = await db.collection("recipeCount").doc("count").get();
  var count = getCount.data().count + 1
  var data = {
    count: count
  }
  const setCount = await db.collection('recipeCount').doc('count').set(data);
  next();
}

exports.uploadRecipeNew = async (req, res, next) => {
  var recipe = req.body;
  recipe.saves = Number(0);
  const getUsername = await db.collection("users").doc(res.locals.uid).get();
  recipe.savedBy = [];
  recipe.comments = [];
  recipe.user = getUsername.data().username;
  recipe.uid = res.locals.uid;

  //get ingredients
  var ingredientArr = []

  const addRecipe = await db.collection("recipes").add(recipe);
  const updateUserPosts = db.collection("users").doc(res.locals.uid).update({posts: admin.firestore.FieldValue.arrayUnion(addRecipe.id)})
  const updateRecipeCountList = db.collection("recipeCount").doc("ids").update({idList: admin.firestore.FieldValue.arrayUnion(addRecipe.id)});
  const addKeywords = recipe.keywords.forEach((item, i) => {
    item = item.toLowerCase().trim();
    var updateKeywordsIdList = db.collection("keywords").doc(item).set({
      ids: admin.firestore.FieldValue.arrayUnion(addRecipe.id),
    }, {merge: true});
    var keywordCountRef = db.collection("keywords").doc(item)
    keywordCountRef.get()
    .then(count => {
      if(count.data() != null) {
        var newCount = count.data().count + 1;
        keywordCountRef.set({
          count: newCount
        }, {merge: true});
      } else {
        console.log("new");
        keywordCountRef.set({
          count: Number(1)
        }, {merge: true});
      }
    })

  });
  const addIngredients = recipe.allIngredients.forEach((item, i) => {
    var updateIngredientIdList = db.collection("ingredients").doc(item).set({
      ids: admin.firestore.FieldValue.arrayUnion(addRecipe.id),

    }, {merge: true});
    var ingredientCountRef = db.collection("ingredients").doc(item)
    ingredientCountRef.get()
    .then(count => {
      if(count.data() != null) {
        var newCount = count.data().count + 1;
        ingredientCountRef.set({
          count: newCount
        }, {merge: true});
      } else {
        ingredientCountRef.set({
          count: Number(1),
        }, {merge: true});
      }
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

  });

  next()
}

exports.showRecipe = async (req, res) => {
    const recipeId = req.params.id,
    recipeRef = db.collection('recipes').doc(recipeId),
    currentUser = res.locals.uid;

    var currentUserInfo = {
      recipeFromCurrentUser: false,
      currentUser: "none",
      userPosts: []
    }
  // look if recipe belong to user and get avatar
  var avatar = false;
  if(res.locals.uid) {
    currentUserInfo.currentUser =  res.locals.uid;
    const getUserInfo  = await db.collection('users').doc(currentUserInfo.currentUser).get();
    currentUserInfo.posts = getUserInfo.data().posts;

    currentUserInfo.posts.forEach((item, i) => {
      if(item == recipeId) {
        currentUserInfo.recipeFromCurrentUser = true;
      }
    });
    
    var avatar = "../uploads/user/" + getUserInfo.data().avatar; 

  }

  var getDoc = await recipeRef.get();
  if(!getDoc.exists) {
    console.log('No such document!');
  } else {
    var recipe = getDoc.data();
    recipe.id = recipeId;
  }

  var alreadyFollowed = false;
  if(typeof currentUser !== "undefined") {
    if(currentUserInfo.currentUser == recipe.uid) {
      alreadyFollowed = false;
    }
    const getUser = await db.collection('users').doc(currentUser).get();
    const followList = getUser.data().followList;
    for(id of followList) {
      if(id == recipe.uid) {
        alreadyFollowed = true;
      }
    }
  } 

  var alreadySaved = false;
  if(typeof currentUser !== "undefined") {
    const getUser = await db.collection('users').doc(currentUser).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      console.log(id + " vs " + recipeId);
      
      if(id == recipeId) {
        alreadySaved = true;
      }
    }
  }

  var getAuthor = await db.collection('users').doc(recipe.uid).get();
  recipe.avatar = getAuthor.data().avatar;
  recipe.link = getAuthor.data().link;
  recipe.bio = getAuthor.data().bio;

  if(Array.isArray(recipe.comments) && recipe.comments.length) {
    recipe.comments.forEach((comment, i) => {    
      var getComment = db.collection('users').doc(comment.uid).get()
      .then(doc => {
        recipe.comments[i].avatar = doc.data().avatar;
        recipe.comments[i].username = doc.data().username;
        if(i === recipe.comments.length - 1) {
          console.log(recipe.comments);       
          res.render("recipePage", { uid : res.locals.uid, avatar : avatar, recipeData : recipe, recipeFromCurrentUser : currentUserInfo.recipeFromCurrentUser, alreadyFollowed : alreadyFollowed, alreadySaved : alreadySaved})
        }
      })
    });
  } else {
    res.render("recipePage", { uid : res.locals.uid, avatar : avatar, recipeData : recipe, recipeFromCurrentUser : currentUserInfo.recipeFromCurrentUser, alreadyFollowed : alreadyFollowed, alreadySaved : alreadySaved})
  }


}

exports.showSavedRecipe = (req, res) => {
  var recipeDoc = req.params.id;
  var docRef = db.collection('recipes').doc(recipeDoc);

  if(typeof res.locals.uid !== "undefined") {
    var uid = res.locals.uid

    var userRef = db.collection("users").doc(uid);
    userRef.get()
    .then(doc => {
      var ids = doc.data().posts;
      ids.forEach((item, i) => {
        if(item == recipeDoc) {
          var getDoc = docRef.get()
          .then(doc => {
            if (!doc.exists) {
              console.log('No such document!');
            } else {
              var recipe = doc.data();
              recipe.id = recipeDoc;
              res.render("recipePageUser", { uid : res.locals.uid, recipeData : recipe })
            }
          })
        }
      });
    })
  } else {
    docRef.get()
    .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          var recipe = doc.data();
          recipe.id = recipeDoc;
          res.render("recipePage", { uid : res.locals.uid, recipeData : recipe })
        }
    })
  }
}

exports.saveRecipe = (req, res) => {
  const user = res.locals.uid,
    id = req.params.id;

  db.collection("recipes").doc(id).update({
    saves: admin.firestore.FieldValue.increment(1),
    savedBy: admin.firestore.FieldValue.arrayUnion(user)
  })

  db.collection("users").doc(res.locals.uid).update({
    saved: admin.firestore.FieldValue.arrayUnion(id)
  })
  .then(function() {
    res.json("succes")
  })
  .catch(error => res.json(error.message))
}

exports.comment = (req, res) => {
  const commentBody = req.body,
  id = req.params.id;
  console.log(commentBody);

  db.collection('recipes').doc(id).set({
    comments: admin.firestore.FieldValue.arrayUnion(commentBody)
  }, {merge: true})
  .then(function() {
    res.send('comment posted!')
  })
  
}