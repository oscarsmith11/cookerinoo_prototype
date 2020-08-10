const { admin, auth, db, firestore } = require("./util/admin.js");

const cookie = require('cookie');
const url = require('url');


exports.guessLoad = async(req, res) => {
  const user = res.locals.uid;
  console.log("aagaaaint");

  var randNr, randId;

  var getCount = await db.collection("recipeCount").doc("count").get();
  randNr = Math.floor(Math.random() * getCount.data().count);

  var getIds = await db.collection("recipeCount").doc("ids").get();
  if(getIds.data().idList != null) {
    randId = getIds.data().idList[randNr];

    var getRecipe = await db.collection("recipes").doc(randId).get();
    if(getRecipe.exists != true) {
      res.render('noRecipeFound', {uid : res.locals.uid})
    }
    var randomRecipe = new Object();
    randomRecipe.id = randId;
    randomRecipe.country = getRecipe.data().country.toLowerCase();
    randomRecipe.saves = getRecipe.data().saves;
    randomRecipe.cookingTime = getRecipe.data().cookingTime;
    randomRecipe.servings = getRecipe.data().servings;
    randomRecipe.dish = getRecipe.data().dish;
    randomRecipe.image = getRecipe.data().image;
    randomRecipe.description = getRecipe.data().description;
    randomRecipe.user = getRecipe.data().user;

    var ingredients = getRecipe.data().ingredients;
    var ingredientsPreview = []
    for (var i = 0; i < ingredients.length && i < 3; i++) {
      ingredientsPreview.push(" " + ingredients[i].ingredient);
    }
    randomRecipe.ingredients = ingredientsPreview;

    var alreadySaved = false;
    if(typeof user !== "undefined") {
      const getUser = await db.collection('users').doc(user).get();
      const userSaves = getUser.data().saved;
      for(id of userSaves) {
        if(id == randomRecipe.id) {
          alreadySaved = true;
        }
      }
    }

    // save cookie
    var cookies = cookie.parse(req.headers.cookie || '');
    res.cookie('previous', randId)    
    var last = false;
    if(Object.keys(cookies).length === 0 && cookies.constructor === Object) {
      var last = true;
    }
    console.log(cookies);
    console.log("request arrived for URL", req.url);

    res.render("landing", {uid : res.locals.uid, randomRecipe : randomRecipe, alreadySaved : alreadySaved})
  }
}

exports.guessLoadFiltered = async(req, res) => {
  const user = res.locals.uid;

  var keyword = req.params.keyword.trim();
  
  var randNr, randId;

  var getCount = await db.collection("keywords").doc(keyword).get();
  if(getCount.exists != true) {
    return res.render('noRecipeFound', {uid : res.locals.uid, keyword : keyword})
  }
  randNr = Math.floor(Math.random() * getCount.data().count);

  var getIds = await db.collection("keywords").doc(keyword).get();
  if(getIds.data().ids.length == 0) {
    return res.render('noRecipeFound', {uid : res.locals.uid, keyword : keyword})
  }
  randId = getIds.data().ids[randNr];

  var getRecipe = await db.collection("recipes").doc(randId).get();
  if(getRecipe.exists != true) {
    return res.render('noRecipeFound', {uid : res.locals.uid, keyword : keyword})
  }
  var randomRecipe = new Object();
  randomRecipe.id = randId;
  randomRecipe.saves = getRecipe.data().saves;
  randomRecipe.country = getRecipe.data().country.toLowerCase();
  randomRecipe.cookingTime = getRecipe.data().cookingTime;
  randomRecipe.servings = getRecipe.data().servings;
  randomRecipe.dish = getRecipe.data().dish;
  randomRecipe.image = getRecipe.data().image;
  randomRecipe.description = getRecipe.data().description;
  randomRecipe.user = getRecipe.data().user;

  var ingredients = getRecipe.data().ingredients;
  var ingredientsPreview = []
  for (var i = 0; i < ingredients.length && i < 3; i++) {
    ingredientsPreview.push(" " + ingredients[i].ingredient);
  }
  randomRecipe.ingredients = ingredientsPreview;

  var alreadySaved = false;
  if(typeof user !== "undefined") {
    const getUser = await db.collection('users').doc(user).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      if(id == randomRecipe.id) {
        alreadySaved = true;
      }
    }
  }
// save cookie
var cookies = cookie.parse(req.headers.cookie || '');
var order = String(Object.keys(cookies).length - 1);
res.cookie(order, randId)
res.cookie('step', order)    
var last = false;
if(Object.keys(cookies).length === 0 && cookies.constructor === Object) {
  var last = true;
}
console.log("filtered: " + cookies);


  res.render("filtered", {uid : res.locals.uid, randomRecipe : randomRecipe, keyword : keyword, alreadySaved : alreadySaved, last : false, done : true})
}

exports.previousLoad = async (req, res) => {
  var id = res.locals.id;

  var getRecipe = await db.collection("recipes").doc(id).get();
  if(getRecipe.exists != true) {
    res.render('noRecipeFound', {uid : res.locals.uid})
  }
  var randomRecipe = new Object();
  randomRecipe.id = id;
  randomRecipe.saves = getRecipe.data().saves;
  randomRecipe.cookingTime = getRecipe.data().cookingTime;
  randomRecipe.servings = getRecipe.data().servings;
  randomRecipe.dish = getRecipe.data().dish;
  randomRecipe.image = getRecipe.data().image;
  randomRecipe.description = getRecipe.data().description;

  var ingredients = getRecipe.data().ingredients;
  var ingredientsPreview = []
  for (var i = 0; i < ingredients.length && i < 3; i++) {
    ingredientsPreview.push(" " + ingredients[i].ingredient);
  }
  randomRecipe.ingredients = ingredientsPreview;

  var alreadySaved = false;
  if(typeof user !== "undefined") {
    const getUser = await db.collection('users').doc(user).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      if(id == randomRecipe.id) {
        alreadySaved = true;
      }
    }
  }  
  res.render("landing", {uid : res.locals.uid, randomRecipe : randomRecipe, alreadySaved : alreadySaved, last : res.locals.last, done : false})
}

exports.previousLoadKeyword = async (req, res) => {
  var id = res.locals.id;
  var keyword = req.params.keyword;

  var getRecipe = await db.collection("recipes").doc(id).get();
  if(getRecipe.exists != true) {
    res.render('noRecipeFound', {uid : res.locals.uid})
  }
  var randomRecipe = new Object();
  randomRecipe.id = id;
  randomRecipe.saves = getRecipe.data().saves;
  randomRecipe.cookingTime = getRecipe.data().cookingTime;
  randomRecipe.servings = getRecipe.data().servings;
  randomRecipe.dish = getRecipe.data().dish;
  randomRecipe.image = getRecipe.data().image;
  randomRecipe.description = getRecipe.data().description;

  var ingredients = getRecipe.data().ingredients;
  var ingredientsPreview = []
  for (var i = 0; i < ingredients.length && i < 3; i++) {
    ingredientsPreview.push(" " + ingredients[i].ingredient);
  }
  randomRecipe.ingredients = ingredientsPreview;

  var alreadySaved = false;
  if(typeof user !== "undefined") {
    const getUser = await db.collection('users').doc(user).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      if(id == randomRecipe.id) {
        alreadySaved = true;
      }
    }
  }  
  res.render("filtered", {uid : res.locals.uid, randomRecipe : randomRecipe, alreadySaved : alreadySaved, last : res.locals.last, done : false, keyword : keyword})
}



exports.nextLoad = async (req, res) => {

  var id = res.locals.id;  

  var getRecipe = await db.collection("recipes").doc(id).get();
  if(getRecipe.exists != true) {
    res.render('noRecipeFound', {uid : res.locals.uid})
  }
  var randomRecipe = new Object();
  randomRecipe.id = id;
  randomRecipe.saves = getRecipe.data().saves;
  randomRecipe.cookingTime = getRecipe.data().cookingTime;
  randomRecipe.servings = getRecipe.data().servings;
  randomRecipe.dish = getRecipe.data().dish;
  randomRecipe.image = getRecipe.data().image;
  randomRecipe.description = getRecipe.data().description;

  var ingredients = getRecipe.data().ingredients;
  var ingredientsPreview = []
  for (var i = 0; i < ingredients.length && i < 3; i++) {
    ingredientsPreview.push(" " + ingredients[i].ingredient);
  }
  randomRecipe.ingredients = ingredientsPreview;

  var alreadySaved = false;
  if(typeof user !== "undefined") {
    const getUser = await db.collection('users').doc(user).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      if(id == randomRecipe.id) {
        alreadySaved = true;
      }
    }
  }  
  res.render("landing", {uid : res.locals.uid, randomRecipe : randomRecipe, alreadySaved : alreadySaved, last : false, done : res.locals.done})
}

exports.nextLoadKeyword = async (req, res) => {
  var keyword = req.params.keyword;

  var id = res.locals.id;  

  var getRecipe = await db.collection("recipes").doc(id).get();
  if(getRecipe.exists != true) {
    res.render('noRecipeFound', {uid : res.locals.uid})
  }
  var randomRecipe = new Object();
  randomRecipe.id = id;
  randomRecipe.saves = getRecipe.data().saves;
  randomRecipe.cookingTime = getRecipe.data().cookingTime;
  randomRecipe.servings = getRecipe.data().servings;
  randomRecipe.dish = getRecipe.data().dish;
  randomRecipe.image = getRecipe.data().image;
  randomRecipe.description = getRecipe.data().description;

  var ingredients = getRecipe.data().ingredients;
  var ingredientsPreview = []
  for (var i = 0; i < ingredients.length && i < 3; i++) {
    ingredientsPreview.push(" " + ingredients[i].ingredient);
  }
  randomRecipe.ingredients = ingredientsPreview;

  var alreadySaved = false;
  if(typeof user !== "undefined") {
    const getUser = await db.collection('users').doc(user).get();
    const userSaves = getUser.data().saved;
    for(id of userSaves) {
      if(id == randomRecipe.id) {
        alreadySaved = true;
      }
    }
  }  
  res.render("filtered", {uid : res.locals.uid, randomRecipe : randomRecipe, alreadySaved : alreadySaved, last : false, done : res.locals.done, keyword : keyword})
}

exports.getPrevious = (req, res, next) => {
  var cookies = cookie.parse(req.headers.cookie || '');
  console.log(cookies);
  
  var id = cookies['previous'];  
  res.locals.id = id;
  next();
}