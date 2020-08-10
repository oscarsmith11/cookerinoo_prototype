var uploadBtn = document.querySelector('#newProfilePic');
var profilePic = document.querySelector('.profilePic');
profilePic.addEventListener('click', function() {
  uploadBtn.click();
})
uploadBtn.addEventListener("change", function() {
  var path = "newProfilePicture/user";
  const file = this.files[0];
  data.set("profilePic", file)
  const options = {
    body: data,
    method: "POST",
    contentType: 'application/json',
  }
  fetch(path, options)
  .then((response) => {
    console.log("profile picture send");
    location.reload();
  })
});


function addBio(a) {
  const parent = a.parentNode;

  a.setAttribute("type", "text");
  a.setAttribute("value", "");
  a.setAttribute("onclick", "");

  var add = document.createElement("button");
  add.setAttribute("onclick", "bioFetch(this)");
  add.innerHTML = "add";
  parent.append(add);
}

function bioFetch(a) {
  const parent = a.parentNode.parentNode.parentNode,
        bioRef = parent.querySelector("input"),
        bio = bioRef.value;

  fetch('newBio', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      bio: bio
    })
  })
  .then(function() {
    console.log("Bio send");
    location.reload();
  })

}

function addLink(a) {
  const parent = a.parentNode;

  a.setAttribute("type", "text");
  a.setAttribute("value", "");
  a.setAttribute("onclick", "");


  var add = document.createElement("button");
  add.setAttribute("onclick", "linkFetch(this)");
  add.innerHTML = "add";
  parent.append(add)
}

function linkFetch(a) {
  const parent = a.parentNode.parentNode.parentNode,
        linkRef = parent.querySelector("input"),
        link = linkRef.value;

  fetch('newLink', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      link: link
    })
  })
  .then(function() {
    console.log("Link send");
    location.reload();
  })
}

function editBio(a) {
  const parent = a.parentNode,
    bioRef = parent.querySelector("#bio"),
    initialBio = bioRef.innerHTML,
    input = document.createElement("input"),
    done = document.createElement("button")
    field = document.createElement("div"),
    control = document.createElement("div"),
    control_ = document.createElement("div"),
    label = document.createElement('label');

    field.setAttribute('class', 'field');

    control.setAttribute('class', 'control');
    control_.setAttribute('class', 'control');

    label.setAttribute('class', 'label');
    label.innerHTML = "Bio";

    input.setAttribute("type", "text");
    input.setAttribute("class", "input");
    input.setAttribute("value", initialBio);
    a.setAttribute("value", initialBio);

    done.setAttribute("onClick", "bioFetch(this)");
    done.setAttribute("class", "button margin-top cookerinoo")
    done.innerHTML = "Change";

    parent.removeChild(a);
    bioRef.innerHTML = "";

    control.append(label);
    control.append(input);
    control_.append(done);

    field.append(control);
    field.append(control_);

    parent.append(field);
}


function editLink(a) {
  const parent = a.parentNode,
    linkRef = parent.querySelector("#link"),
    initialLink = linkRef.innerHTML,
    input = document.createElement("input"),
    done = document.createElement("button"),
    field = document.createElement("div"),
    control = document.createElement("div"),
    control_ = document.createElement("div"),
    label = document.createElement('label');

    field.setAttribute('class', 'field');

    control.setAttribute('class', 'control');
    control_.setAttribute('class', 'control');

    label.setAttribute('class', 'label');
    label.innerHTML = "Link";
  
    input.setAttribute("type", "text");
    input.setAttribute('class', 'input');
    input.setAttribute("value", initialLink);
    a.setAttribute("value", initialLink);

    done.setAttribute("onClick", "linkFetch(this)");
    done.setAttribute('class', 'button margin-top cookerinoo')
    done.innerHTML = "Change";

    parent.removeChild(a);
    linkRef.innerHTML = "";

    control.append(label);
    control.append(input);
    control_.append(done);

    field.append(control);
    field.append(control_);

    parent.append(field);
}

function recipeView(id) {
  window.location = '/recipe/' + id;
}

function deleteThis(id) {
  if (confirm('Delete recipe?')) {
    fetch('deleteRecipe', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        toDelete: id
      })
    })
    .then(function() {
      console.log("Id of to delete recipe send");
      location.reload();
    })  
  } 


}

function deleteThisSaved(id) {
  if (confirm('Unsave recipe?')) {
    fetch('deleteSaved', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        toDelete: id
      })
    })
    .then(function() {
      console.log("Id of to delete saved recipe send");
      location.reload();
    })
  } 
}

function verify() {
  fetch('verify-user', {
    method: 'POST'
  })
  .then(function() {
    console.log("Verification email send");
  })
}