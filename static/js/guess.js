var container = document.querySelector("#guesContainer");
var guessDish = document.querySelector("#guessDish");
var guessImage = document.querySelector("#guessImage");
var guessDescription = document.querySelector("#guessDescription");



function loadRandom() {
  var getFilter = document.getElementById("filterIng").innerHTML.toLowerCase();
  var nextButton = document.querySelector('#next');
  
  console.log(window.location.pathname);
  if(window.location.pathname == '/previous' && getFilter == "anything") {
    window.location = '../'
  } else if(window.location.pathname == '/next' && !done && getFilter == "anything") {
    window.location = '../../next'  
  } else if(window.location.pathname.includes('/previous') && !done) {  
    window.location = '../next/' + getFilter;
  } else if(window.location.pathname.includes('/next') && !done) {
    window.location = '../next/' + getFilter;
  } else if(getFilter == "anything") {    
    window.location = '../'
  }  else {
    nextButton.setAttribute('href', '../../filter/' + getFilter)

    window.location = '../../filter/' + getFilter;
  }
}

function loadPrevious() {
  var getFilter = document.getElementById("filterIng").innerHTML.toLowerCase();
  if(getFilter == "anything") {
    window.location = './previous'
  } else {
    window.location = '../previous/' + getFilter;
  }
}

/* function addWheelEvent() {
  document.addEventListener('wheel', this.handleScroll, false)
}

function removeWheelEvent() {
  document.removeEventListener('wheel', this.handleScroll, false)
}

function handleScroll() {
  if (event.deltaY < 0) {
    loadPrevious();
    this.removeWheelEvent();
  }
  else if (event.deltaY > 0) {
    loadRandom()
    this.removeWheelEvent();
  }  
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    setTimeout(function() {
      this.addWheelEvent();
    }, 1000);
  } else {
    this.removeWheelEvent();
  }
};

*/

function goToRecipe(id) {
  window.location = '/recipe/' + id;
}

function save(id) {
  const optionsData = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      'id': id
    })
  };
  const fetchRecipe = fetch('../save/' + id, optionsData)
  .then(res => {
    res.json()
    .then(data => {
      if(data !== "succes") {
        return false;
      } else {
        var saveBtn = document.getElementById("saveButton"),
        saveText = document.getElementById("saveText");

        saveBtn.className = saveBtn.className.replace(/\bsave\b/g, "saved");
        saveBtn.setAttribute('onclick', '');

        saveText.innerHTML = "saved"


      }
    });
  })
}
