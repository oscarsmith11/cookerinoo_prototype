const fill = document.querySelectorAll('.fill'),
  empties = document.querySelectorAll('.empty');

var current;
// Fill listeners
fill.forEach((item, i) => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('dragend', dragEnd);
});

// Loop trough empties and call drag events
for(const empty of empties) {
  empty.addEventListener('dragover', dragOver)
  empty.addEventListener('dragenter', dragEnter)
  empty.addEventListener('dragleave', dragLeave)
  empty.addEventListener('drop', dragDrop)

}

// add onclick redirect 
var btns = document.querySelectorAll(".ocRed");
btns.forEach(element => {
  element.setAttribute('onClick', 'redirectFilter(this)')
});

function redirectFilter(a) {

  var goTo = a.querySelector('.keyword').innerHTML;
  if (confirm('Your about to be redirected to #' + goTo)) {

    window.location = "./filter/" + goTo;
  }
}

// Drag functions
function dragStart() {
  current = this.innerHTML;
  setTimeout(() => this.className += ' invisible', 0);
}

function dragEnd() {
  this.className = 'button'
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += ' hovered';
}

function dragLeave() {
  this.className = 'button empty'
}

function dragDrop() {
  this.className = 'button empty';
  console.log(current);
  this.innerHTML = current;
}

// fetch trends to db
function fetchPopulars() {
  const popularC = document.querySelectorAll('.popularC button');
  var populars = []
  popularC.forEach((item, i) => {
    if (item.innerHTML != "") {
      var name = item.querySelector('.keyword').innerHTML;
      console.log(name);
      var count = item.querySelector('.count').innerHTML;
      var trend = {
        "keyword": name,
        "count": Number(count)
      }
      populars.push(trend);
    }
  });
  const data = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(populars)
  };

  fetch('/fetch-populars', data)
  .then(res => {
    console.log(res);
    location.reload();
  })
}

function fetchFavorites() {
  const favoritesC = document.querySelectorAll('.favoritesC button');
  var favorites = []
  favoritesC.forEach((item, i) => {
    if (item.innerHTML != "") {
      var name = item.querySelector('.keyword').innerHTML;
      console.log(name);
      var count = item.querySelector('.count').innerHTML;
      var trend = {
        "keyword": name,
        "count": Number(count)
      }
      favorites.push(trend);
    }
  });
  const data = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(favorites)
  };

  fetch('/fetch-favorites', data)
  .then(res => {
    console.log(res);
    location.reload();
  })}
