function checkUsername() {
    const username = document.querySelector("#username").value;
    var usernameRegex = /^[a-zA-Z0-9_.-]*$/;
    if(username.match(usernameRegex)) {
        return true;
    } else {
        return false;
    }

}

function checkPassword() {
    const pas = document.querySelector('#password').value;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(pas.match(passw)) { 
        return true;
    } else {
        return false;
    }
}

function match() {
    const pas = document.querySelector('#password').value;
    const pasV = document.querySelector('#passwordVerify').value;

    if(pas === pasV) {
        return true;
    } else {
        return false;
    }
}

function wrongUsername() {
    var usernameMessage = document.querySelector('.usernameMessage');
    usernameMessage.innerHTML = "Your username can only contain letters, numbers and '-' "
}

function notCorrect() {    
    var usernameMessage = document.querySelector('.usernameMessage');
    var passwordMessage = document.querySelector('.passwordMessage');
    var passwordVerifyMessage = document.querySelector('.passwordVerifyMessage');
    usernameMessage.innerHTML = "";
    passwordVerifyMessage.innerHTML = "";
    passwordMessage.innerHTML = "Your password must contain between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter";
}

function noMatch() {
    var usernameMessage = document.querySelector('.usernameMessage');
    var passwordMessage = document.querySelector('.passwordMessage');
    var passwordVerifyMessage = document.querySelector('.passwordVerifyMessage');
    usernameMessage.innerHTML = "";
    passwordMessage.innerHTML = "These should match";
    passwordVerifyMessage.innerHTML = "These should match";
}

function checkInput() {
    var goodToGo = {
        'username': false,
        'password': false
    }
    if(!checkUsername()) {
        return wrongUsername()
    } else {
        goodToGo.username = true;
    }

    if(!checkPassword()) {
        return notCorrect()
    } 

    if(!match()) {
        return noMatch()
    } else {
        goodToGo.password = true;
    }

    if(goodToGo.password && goodToGo.username) {
        completeSignup()
    }
}
//completeSignup()