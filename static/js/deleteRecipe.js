const { admin, auth, db, firestore } = require("./util/admin.js")

const fs = require('fs')

exports.getRecipe = (req, res, next) => {
  res.locals.id = req.body.toDelete;
  db.collection('recipes').doc(res.locals.id).get()
  .then(doc => {
    res.locals.keywords = doc.data().keywords;
    res.locals.ingredients = doc.data().allIngredients;
    res.locals.usersWhoSaved = doc.data().savedBy;
    res.locals.path = doc.data().image;
    next()
  })
}

exports.reduceKeywords = (req, res, next) => {
  res.locals.keywords.forEach((item, i) => {
    db.collection('keywords').doc(item).get()
    .then(doc => {
      console.log(item);
      const newCount = doc.data().count - 1;
      db.collection('keywords').doc(item).update({
        ids: admin.firestore.FieldValue.arrayRemove(res.locals.id),
        count: newCount
      })
    })
    console.log(res.locals.keywords.length + "   " + i);
    if(res.locals.keywords.length - 1 == i ) {
      console.log('next');
      next()
    }
  });
}

exports.reduceIngredients = (req, res, next) => {
  res.locals.ingredients.forEach((item, i) => {
    db.collection('ingredients').doc(item).get()
    .then(doc => {
      const newCount = doc.data().count - 1;
      db.collection('ingredients').doc(item).update({
        ids: admin.firestore.FieldValue.arrayRemove(res.locals.id),
        count: newCount
      })
    })
    console.log(res.locals.ingredients.length + "   " + i);
    if(res.locals.ingredients.length - 1 == i ) {
      console.log('next');
      next()
    }
  });
}

exports.reduceRecipeCount = (req, res, next) => {
  db.collection('recipeCount').doc('count').get()
  .then(doc => {
    const newCount = doc.data().count - 1;
    db.collection('recipeCount').doc('count').update({
      count: newCount
    })
    .then(function() {
      db.collection('recipeCount').doc('ids').update({
        idList: admin.firestore.FieldValue.arrayRemove(res.locals.id),
      })
      next()
    })
  })
}

exports.deleteSaves = (req, res, next) => {
  if (typeof res.locals.usersWhoSaved == 'undefined' || res.locals.usersWhoSaved.length == 0) {
    next();
  }
  res.locals.usersWhoSaved.forEach((userId, i) => {
    console.log(userId);
    db.collection('users').doc(userId).update({
      saved: admin.firestore.FieldValue.arrayRemove(res.locals.id)
    })
    .then(function() {
      if(res.locals.usersWhoSaved.length - 1 == i ) {
        console.log('next');
        next()
      }
    })
  });
}

exports.deletePosts = (req, res, next) => {
  db.collection('users').doc(res.locals.uid).update({
    posts: admin.firestore.FieldValue.arrayRemove(res.locals.id)
  })
  next()
}

exports.deleteImage = (req, res, next) => {
  const path = res.locals.path;
  console.log(path);
  try {
    fs.unlinkSync('static/' + path)
    next()
  } catch(err) {
    console.error(err)
  }
}

exports.deleteRecipe = (req, res) => {
  db.collection('recipes').doc(res.locals.id).delete()
  .then(function() {
    res.send('succes delete')
    console.log('succesfully deleted: ' + res.locals.id);
  })
}
