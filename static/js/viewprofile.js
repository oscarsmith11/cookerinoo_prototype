const { admin, auth, db, firestore } = require("./util/admin.js");

exports.thisUserShow = (req, res, next) => {
  const currentUser = res.locals.uid;
  const userToShow = req.params.id;
  

  if(currentUser == userToShow) {
    res.redirect('../profile/' + currentUser)
  } else {
    next();
  }
}

exports.getViewProfile = (req, res, next) => {
  const currentUser = res.locals.uid;
  const userId = req.params.id;
  var userRef = db.collection("users").doc(userId);
  userRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('User doesnt exist');
    } else {
      // translate followers ids to names 
      var fans = [] 
      doc.data().followedBy.forEach((item) => {
        db.collection('users').doc(item).get()
        .then(doc => {
          arr = [item, doc.data().username]
          fans.push(arr)
        })      
      })

      // translate following ids to names 
      var following = [] 
      doc.data().followList.forEach((item) => {
        db.collection('users').doc(item).get()
        .then(doc => {
          arr = [item, doc.data().username]
          following.push(arr)
        })      
      })

      res.locals.uidView = userId;
      res.locals.username = doc.data().username;
      res.locals.fanCount = doc.data().fanCount
      res.locals.following = following;
      res.locals.fans = fans;
      res.locals.avatar = doc.data().avatar;
      res.locals.bio = doc.data().bio;
      res.locals.link = doc.data().link;

      res.locals.userPostIds = doc.data().posts;
      res.locals.userSaved = doc.data().saved;
      
      next();
    }
  })
}

exports.getViewRecipes = (req, res, next) => {
  var uid = res.locals.uid;
  var userPostIds = res.locals.userPostIds;
  if(userPostIds.length == 0) {
    res.locals.userRecipes = []
    next()
  }

  var userRecipes = [];
  var userRecipeRef = db.collection("recipes");
  var itemsProcessed = 0;
  userPostIds.forEach((item, i, array) => {
    userRecipeRef.doc(item).get()
    .then(doc => {
      if (!doc.exists) {
        res.locals.userRecipes = [];
        console.log('User has no uploads');
        next();
      }

      var recipeObj = doc.data();
      recipeObj.id = item;
      userRecipes.push(recipeObj);
      itemsProcessed++;

      if(itemsProcessed === array.length) {
        res.locals.userRecipes = userRecipes;
        next();
      }
    })
  });
}

exports.showViewProfile = (req, res) => {
  var alreadyFollowed = false;
  if(typeof res.locals.uid !== "undefined") {
    db.collection('users').doc(res.locals.uid).get()
    .then(doc => {
      const followList = doc.data().followList;
      for(id of followList) {
        if(id == res.locals.uidView) {
          alreadyFollowed = true;
        }
      }
    })
  }
  res.render('viewProfile', {
    uid : res.locals.uid ,
    username : res.locals.username ,
    fanCount: res.locals.fanCount,
    fans: res.locals.fans,
    following: res.locals.following,
    alreadyFollowed: alreadyFollowed,
    avatar : res.locals.avatar,
    bio : res.locals.bio,
    link : res.locals.link,
    userPosts : res.locals.userRecipes ,
  })
}

exports.viewProfile = (req, res) => {
  var user = {}
  var recipes = []
  var alreadyFollowed = false;

  const currentUser = res.locals.uid;
  const userId = req.params.id;
  db.collection("users").doc(userId).get()
  .then(doc => {
    const data = doc.data();
    const followerIds = data.followList;

    const getFollowerData = async () => {
      
      var followers = [] 
      followerIds.forEach((item) => {
        db.collection('users').doc(item).get()
        .then(doc => {
          arr = [item, doc.data().username]
          followers.push(arr)
        })      
      })

      user.avatar = data.avatar;
      user.username = data.username;
      user.bio = data.bio;
      user.link = data.link;
      user.id = userId;
      user.fans = data.fanCount;
      user.followers = followers;
    } 

    // get user recipes
    const getRecipes = async () => {
      const recipeIds = data.posts;
      for(const id of recipeIds) {
        const getRecipe = await db.collection("recipes").doc(id).get()
        var obj = getRecipe.data();
        obj.id = id;
        recipes.push(obj)
      }
      if(typeof currentUser !== "undefined") {
        const getUser = await db.collection('users').doc(currentUser).get();
        const followList = getUser.data().followList;
        for(id of followList) {
          if(id == userId) {
            alreadyFollowed = true;
          }
        }
      }
      console.log(user);
    }
    res.render("viewProfile", {uid : res.locals.uid , email : res.locals.email , user : user , recipes : recipes, alreadyFollowed : alreadyFollowed})  // expected output: 'resolved'

  })
}


exports.followUser = (req, res) => {
  const toFollow = req.params.id,
  currentUser = res.locals.uid;

  const updateFollowList = db.collection("users").doc(currentUser).set({
    followList : admin.firestore.FieldValue.arrayUnion(toFollow),
  }, {merge: true})

  const updateFollowerList = db.collection("users").doc(toFollow).set({
    followedBy : admin.firestore.FieldValue.arrayUnion(currentUser),
  }, {merge: true})

  var userRef = db.collection("users").doc(toFollow);
  userRef.get()
  .then(doc => {
    if(doc.data().fanCount != null) {
      var newCount = doc.data().fanCount + 1;
      userRef.set({
        fanCount: newCount
      }, {merge: true});
      res.json("succes")
    } else {
      userRef.set({
        fanCount: Number(1),
      }, {merge: true});
      res.json("succes")
    }
  })
  .catch(error => res.json(error.message))

}
