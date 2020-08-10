const { auth, admin, db } = require("./util/admin.js")

exports.userCheckup = (req, res, next) => {
  var user = auth.currentUser;
  var authenticated;
  if(user) {
    authenticated = true;
    res.locals.authenticated = authenticated;
    res.locals.uid = user.uid;
    res.locals.email = user.email;
    next();
  } else {
    authenticated = false;
    res.locals.authenticated = authenticated;
    next();
  }
}

exports.shareRecipeCheck = (req, res, next) => {
  if(res.locals.authenticated) {
    next();
  } else {
    res.send("Please login or create an account")
  }
}

exports.signup = (req, res) => {
  console.log(req.body);
  
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  auth.createUserWithEmailAndPassword(email, password)
  .then(cred => {
    db.collection("users").doc(cred.user.uid).set({
      email: cred.user.email,
      username: username,
      avatar: "",
      fanCount: 0,
      followList: [],
      followedBy: [],
      bio: "",
      link: "",
      posts: [],
      saved: []
    })
    res.json("succes")
  })
  .catch(error => {
    res.json(error.message)
  })

}

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  auth.signInWithEmailAndPassword(email, password)
  .then(cred => {
    //console.log(cred.user);
    res.redirect("/")
  })
  .catch(error => {
    console.log(error);
  })

}

exports.logout = (req, res) => {
  auth.signOut()
  .then(() => {
    console.log("user logged out");
    res.redirect("/")
  })
  .catch(error => {
    console.log(error)
  })
}
