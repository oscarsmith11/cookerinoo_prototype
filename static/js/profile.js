const { admin, auth, db, firestore } = require("./util/admin.js")
const fs = require('fs')

exports.editUploadCheck = (req, res, next) => {
  if(res.locals.authenticated) {
    console.log("edit upload check");
    next();
  } else {
    res.send("Please login or create an account")
  }
}

exports.getUserData = (req, res, next) => {
  var uid = res.locals.uid;
  var admin = false;
  console.log(uid);
  console.log("Jyn9D9ADoePMnhEO5pI2NQPF3nN2");
  if(uid == "pHMXLTn4fETzgErMOOcaYz9cXnq1") {
    admin = true;
  }
  var userRef = db.collection("users").doc(uid);
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

      
      res.locals.username = doc.data().username;
      res.locals.admin = admin;
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

exports.getUserUploads = (req, res, next) => {
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

exports.getUserSaved = (req, res, next) => {
  var uid = res.locals.uid;
  var userSavedIds = res.locals.userSaved;

  var userSaved = [];
  var userRecipeRef = db.collection("recipes");
  var itemsProcessed = 0;
  if(userSavedIds.length == 0) {
    res.locals.userSaved = []
    next()
  }

  userSavedIds.forEach((item, i, array) => {
    userRecipeRef.doc(item).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('User has no saves');
        next();
      } else {
        var savedObj = doc.data();
        savedObj.id = item;
        userSaved.push(savedObj);
        itemsProcessed++;
      }

      if(itemsProcessed === array.length) {
        res.locals.userSaved = userSaved;
        next();
      }
    })
  });
}

exports.loadProfile = (req, res) => {
  res.render('profile', {
    uid : res.locals.uid ,
    admin: res.locals.admin,
    username : res.locals.username ,
    fanCount: res.locals.fanCount,
    fans: res.locals.fans,
    following: res.locals.following,
    avatar : res.locals.avatar,
    bio : res.locals.bio,
    link : res.locals.link,
    userPosts : res.locals.userRecipes ,
    userSaved : res.locals.userSaved
  })
}

exports.uploadProfilePic = async (req, res) => {
  var uid = res.locals.uid;
  const getUser = await db.collection('users').doc(uid).get();
  const avatar = getUser.data().avatar;
  if(avatar != "") {
    try {
      fs.unlinkSync('static/uploads/user/' + avatar)
    } catch(err) {
      console.error(err)
    }
  }
  var profilePicPath = req.file.filename
  var userRef = db.collection("users").doc(uid);
  userRef.update({
    avatar: profilePicPath
  })
  .then(function() {
    res.redirect('/');
  })
}

exports.uploadBio = (req, res) => {
  const uid = res.locals.uid,
        bioRef = db.collection("users").doc(uid);
        bio = req.body.bio;
  bioRef.update({
    bio: bio
  })
  .then(function() {
    res.redirect('back');
  })
}

exports.uploadLink = (req, res) => {
  const uid = res.locals.uid,
        linkRef = db.collection("users").doc(uid);
        link = req.body.link;
  linkRef.update({
    link: link
  })
  .then(function() {
    res.redirect('back');
  })
}

exports.showUserUpload = (req, res) => {
  var recipeDoc = req.params.id;
  var docRef = db.collection('recipes').doc(recipeDoc);
  var getDoc = docRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      var recipe = doc.data();
      recipe.id = recipeDoc;

      res.render('recipePageUser', { uid : res.locals.uid, recipeData : recipe })
    }  })
}


exports.deleteSaved = (req, res) => {
  const id = req.body.toDelete,
    uid = res.locals.uid,
    userRef = db.collection("users").doc(uid);

    var removeIdFromUser = userRef.update({
      saved: admin.firestore.FieldValue.arrayRemove(id)
    })
    .then(function() {
      res.send('deleted saved one')
      console.log("Saved post removed from user collection");
    })
};
