// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("forgot");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the ingredient placeholder
var toFilter = document.getElementById("filterIng");

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  var ingInput = document.getElementById("keywordInput");
  ingInput.addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
      filter();
    }
  })
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function sendReset() {
  var emailAddress = document.getElementById("forgottenEmail").value,
  fotgottenMessage = document.querySelector('.forgottenMessage');

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    window.location.href = '/reset-email-send';
  }).catch(function(error) {
    fotgottenMessage.innerHTML = error.message; 
});
}
