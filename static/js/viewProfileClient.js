function recipeView(id) {
  window.location = '/recipe/' + id;
}

function save(id) {
  var http = new XMLHttpRequest();
  http.open("POST", "save/" + id, true);
  http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  http.send();
  http.onload = function() {
  alert(http.responseText);
  }
}

function follow(uid) {
  const optionsData = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      'uid': uid
    })
  };

const fetchFollow = fetch('../follow/' + uid, optionsData)
  .then(res => {
    res.json()
    .then(data => {
      if(data !== "succes") {
        return false;
      } else {
        var followBtn = document.getElementById("followButton"),
        followText = document.getElementById("followText");

        followBtn.className = followBtn.className.replace(/\bsave\b/g, "saved");
        followBtn.setAttribute('onclick', '');

        followText.innerHTML = "following";
      }
    });
  })
}
