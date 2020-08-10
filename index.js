// dependencies
var express = require("express");
var ejs = require("ejs");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true });
//app.use(bodyParser.json({limit: '50mb', extended: true}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      var type = req.params.type;
        cb(null, 'static/uploads/' + type );
    },
    filename: function(req, file, cb) {
      console.log(file);

        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  // reject file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
  fileSize: 1024 * 1024 * 4
  },
  fileFilter: fileFilter
});

const firebaseConfig = {
  apiKey: "AIzaSyCRGCORpahuef0FZPwEgtWXppm6ELcy8LQ",
  authDomain: "cookerinoo-bc38a.firebaseapp.com",
  databaseURL: "https://cookerinoo-bc38a.firebaseio.com",
  projectId: "cookerinoo-bc38a",
  storageBucket: "cookerinoo-bc38a.appspot.com",
  messagingSenderId: "159810480842",
  appId: "1:159810480842:web:69cdd2843c033688f66233",
  measurementId: "G-S0FHHHMJC8"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

// leaving out .ejs
app.set("view engine", "ejs")

// look in static folder for external files (css, js)
app.use(express.static("static"));

 const { db } = require("./static/js/util/admin.js");

const { showFavorites, showTopTrends, showNewTrends } = require("./static/js/trends.js")

const { uploadRecipeNew, showRecipe, comment, addRecipeCount, saveRecipe } = require("./static/js/recipe.js");

const { showEditPage , editRecipe } = require("./static/js/editRecipe.js");

const  { signup, logout, login, userCheckup, authenticated, shareRecipeCheck, sendVerificationEmail } = require("./static/js/users.js");

const  { getUserData, getUserUploads, getUserSaved, loadProfile, uploadProfilePic, uploadBio, uploadLink, showUserUpload, editUploadCheck, deleteSaved} = require("./static/js/profile.js");

const { guessLoad, previousLoad, previousLoadKeyword, getPrevious, nextLoad, getNext, nextLoadKeyword, guessLoadFiltered } = require("./static/js/makeAGuess.js");


const { loadTrendData, uploadPopulars, uploadFavorites } = require("./static/js/manageTrends.js");

const { getRecipe, reduceKeywords, reduceIngredients, reduceRecipeCount, deleteSaves, deletePosts, deleteImage, deleteRecipe } = require('./static/js/deleteRecipe.js')


app.get("/", userCheckup, guessLoad);

app.get("/filter/:keyword", userCheckup, guessLoadFiltered)

app.get("/previous", userCheckup, getPrevious, previousLoad);
app.get("/previous/:keyword", userCheckup, getPrevious, previousLoadKeyword);

app.post('/save/:id', userCheckup, saveRecipe);


app.get("/make-a-guess", userCheckup, guessLoad);
app.get("/make-a-guess/:id", userCheckup, showRecipe)


app.get("/explore", userCheckup, showFavorites);
app.get("/explore/favorites", userCheckup, showFavorites)
app.get("/explore/top-trends", userCheckup, showTopTrends)
app.get("/explore/new-trends", userCheckup, showNewTrends)

app.get("/recipe/:id", userCheckup, showRecipe);
app.post('/comment/:id', userCheckup, comment);

app.get("/edit/:id", userCheckup, showEditPage);

app.post("/edit-recipe/:id", userCheckup, editRecipe);

app.get("/create-recipe", userCheckup, shareRecipeCheck, function(req, res) {
  res.render("form", { uid : res.locals.uid , email : res.locals.email});
})

app.get("/share", userCheckup, shareRecipeCheck, function(req, res) {
  res.render("share", {uid : res.locals.uid , email : res.locals.email});
})

app.post("/upload-recipe-image/:type", userCheckup, upload.single('recipeImage'), function(req, res) {
  res.json({imagePath: 'uploads/recipe/' + req.file.filename});
})

app.post("/upload-recipe", userCheckup, uploadRecipeNew, addRecipeCount, function(req, res) {
  res.send("succes")

})

app.get("/succes", userCheckup, function(req, res) {
  console.log("give me succes");
  res.render("succes", {uid : res.locals.uid , email : res.locals.email});
})

app.post("/save/:id", userCheckup, saveRecipe);

app.post("/follow/:id", userCheckup, followUser)

app.get("/succes-recipe", userCheckup, function(req, res) {
  res.render("succes");
})

app.get("/succes-login", userCheckup, function(req, res) {
  res.render("succesLogin")
})

app.get("/succes-account", userCheckup, function(req, res) {
  res.render("succesAccount")
})


app.get("/login", function(req, res) {
  console.log("dd")
  res.render("login");
})

app.get("/logout", logout);

app.post("/signup", signup);
app.get("/reset-email-send", function(req, res) {
  res.render('resetEmailSend')
})

app.post("/login", urlencodedParser, login);

app.get("/profile/:uid", userCheckup, getUserData, getUserUploads, getUserSaved, loadProfile);

app.post("/profile/newProfilePicture/:type", userCheckup, upload.single('profilePic'), uploadProfilePic);

app.post("/profile/newBio", userCheckup, uploadBio);

app.post("/profile/newLink", userCheckup, uploadLink);

app.get("/profile/upload/:id", userCheckup, editUploadCheck, showRecipe);
app.get("/profile/saved/:id", userCheckup,  editUploadCheck, showRecipe)


app.post("/profile/deleteRecipe", userCheckup, getRecipe, reduceKeywords, reduceIngredients, reduceRecipeCount, deleteSaves, deletePosts, deleteImage, deleteRecipe)
app.post("/profile/deleteSaved", userCheckup, deleteSaved)


app.get("/viewProfile/:id", userCheckup, thisUserShow, getViewProfile, getViewRecipes, showViewProfile)

app.get("/manage-trends", userCheckup, loadTrendData)
app.post("/fetch-populars", userCheckup, uploadPopulars)
app.post("/fetch-favorites", userCheckup, uploadFavorites)


app.listen(port, () => console.log("server started"));
