// Get the modal
var modal = document.getElementById("myModal");
var followingModal = document.getElementById("followingModal");


// Get the button that opens the modal
var btn = document.getElementById("viewFollowers");
var followingBtn = document.getElementById("viewFollowing");


// Get the <span> element that closes the modal
var span = document.getElementById("close");
var spanF = document.getElementById("closeFollowing");


// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

followingBtn.onclick = function() {
  followingModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

spanF.onclick = function() {
  followingModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal || event.target == followingModal) {
    modal.style.display = "none";
    followingModal.style.display = "none";
  }
}

