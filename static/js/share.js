var digitsOnly = /[1234567890]/g;
var floatOnly = /[0-9\.]/g;
var alphaOnly = /^[a-zA-Z\s]*$/;

function restrictCharacters(myfield, e, restrictionType) {
    if (!e) var e = window.event
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);
    // if they pressed esc... remove focus from field...
    if (code==27) { this.blur(); return false; }
    // ignore if they are press other keys
    // strange because code: 39 is the down key AND ' key...
    // and DEL also equals .
    if (!e.ctrlKey && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40) {
        if (character.match(restrictionType)) {
            return true;
        } else {
            return false;
        }
    }
}

function deleteIng(a) {
  var parent = a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
    element = a.parentNode.parentNode.parentNode.parentNode.parentNode;
  parent.removeChild(element);
}

function deleteIns(a) {
  var parent = a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
    element = a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  parent.removeChild(element);

  // replace number
  var counting = parent.querySelectorAll('.count');
  counting.forEach((item, i) => {
    item.innerHTML = i + 1
  });

}


var imageUpload = false;
var loadFile = function(event) {
  var uploadInput = document.getElementById('imgUpload')
  var output = document.getElementById('imgPreview');

  imageUpload = true;
  uploadInput.style.display = "none";
  output.src = URL.createObjectURL(event.target.files[0]);
};

function addIngredient() {
  const ingredients = document.querySelector(".ingredients");
  var ingredientC = document.createElement("div");
  ingredientC.setAttribute("class", "ingredientC columns");
  ingredientC.innerHTML = "<div class='field-body column is-3 is-6-mobile'> <div class='control'> <label class='label is-hidden-tablet'>Amount</label> <input type='number' class='input amount is-medium' name='amount' placeholder='amount' onkeypress='return restrictCharacters(this, event, floatOnly);'> </div></div><div class='field-body column is-narrow is-6-mobile'> <div class='control'> <label class='label is-hidden-tablet'>Measure</label> <div class='select is-medium'><select class='measure'><option value='' disabled selected>Select</option><option val='kg'>kg</option><option val='g'>g</option><option val='ounce'>ounce</option><option val='pound'>pound</option><option val='dl'>dl</option><option val='l'>l</option><option val='ml'>ml</option><option val='cup(s)'>cup(s)</option><option val='tblsp'>tblsp</option><option val='tsp'>tsp</option></select></div></div></div><div class='field-body column is-4 is-10-mobile'> <div class='columns'> <div class='control column is-10-desktop'> <label class='label is-hidden-tablet'>Ingredient</label> <input type='text' class='input ingredient is-medium' name='ingredient' placeholder='ingredient'> </div><div class='field-body deleteIng column is-2-desktop'> <div class='control'> <button class='button is-medium is-danger is-inverted' onclick='deleteIng(this)'> <span class='icon is-small'> <i class='fas fa-times'></i> </span> </button> </div></div></div></div>";

  ingredients.append(ingredientC)
}

function addInstruction() {
  const method = document.querySelector(".method");
  var instructionC = document.createElement("div");
  var count = method.childElementCount + 1;
  instructionC.setAttribute("class", "columns");
  instructionC.innerHTML = "<div class='field-body instructionC column is-10'> <div class='columns is-vcentered is-mobile'> <div class='column is-10'> <div class='control'> <label class='label count'>" + count + "</label> <input type='text' class='input instruction is-medium' name='instruction' placeholder='instruction'> </div></div><div class='column is-2'> <div class='field-body column deleteIng'> <div class='control'> <label class='label'>&nbsp;</label> <button class='button is-medium is-danger is-inverted' onclick='deleteIns(this)'> <span class='icon is-small'> <i class='fas fa-times'></i> </span> </button> </div></div></div></div></div>";
  method.append(instructionC);
}



var data = {};
var image = new FormData();


function getKind() {
  const kindC = document.querySelector(".kind"),
  kind = kindC.options[kindC.selectedIndex].value;

  var breakfast = false,
  lunch = false,
  dinner = false,
  desert = false,
  snack = false;

  switch (kind) {
    case "breakfast":
      breakfast = true;
      break;
    case "lunch":
      lunch = true;
      break;
    case "dinner":
      dinner = true;
      break;
    case "desert":
      desert = true;
      break;
    case "snack":
      snack = true;
  }

  kindObj = {
    "breakfast": breakfast,
    "lunch": lunch,
    "dinner": dinner,
    "desert": desert,
    "snack": snack
  }

  data.kind = kindObj;
}

function getCountry() {
  const countryC = document.querySelector("#country"),
  country = countryC.options[countryC.selectedIndex].value,
  region = document.querySelector('#region').value;
  if(country == "default") {
    data.country = "";
    data.region = "";
  } else {
    data.country = country
    if(region == "") {
      data.region = "";
    } else {
      data.region = region;
    }
  }
}

function getImage() {
  const imgUpload = document.querySelector("#imgUpload"),
    file = imgUpload.files[0],
    imgPath = file.name;

  if(file) {
    image.set('recipeImage', file);
  }
}

function getCookingTime() {
  const cookingTimeC = document.querySelector("#cookingTime"),
    cookingTime = cookingTimeC.value;
  data.cookingTime = cookingTime;
}

function getServings() {
  const servingsC = document.querySelector("#servings"),
    servings = servingsC.value;
  data.servings = servings;
}

function getDishName() {
  const dishNameC = document.querySelector("#dishName"),
    dishName = dishNameC.value;
  data.dish = dishName;
}

function getDescription() {
  const descriptionC = document.querySelector("#description"),
    description = descriptionC.value;
  data.description = description;
}

function getIngredients() {
  const ingredientsC = document.querySelectorAll(".ingredientC");
  data.ingredients = []
  data.allIngredients = []

  ingredientsC.forEach((item, i) => {
    const amountC = item.querySelector(".amount"),
      measureC = item.querySelector(".measure"),
      ingredientC = item.querySelector(".ingredient"),
      amount = amountC.value,
      measure = measureC.options[measureC.selectedIndex].value,
      ingredient = ingredientC.value.toLowerCase().trim();
    var toData;
      if(ingredient != '') {
        toData = {
          "amount": amount,
          "measure": measure,
          "ingredient": ingredient
        }
      data.allIngredients.push(ingredient)
      data.ingredients.push(toData)
      }
  });

}

function getMethod() {
  const instructionsC = document.querySelectorAll(".instructionC");
  data.instructions = [];

  instructionsC.forEach((item, i) => {
    const instructionC = item.querySelector(".instruction"),
      instruction = instructionC.value;
    if(instruction != '') {
      data.instructions.push(instruction);
    }
  });
}

function getKeywords() {
  const keywordsC = document.querySelector(".keywords");
  var keywordsArr = [];
  var arr = [];
  if(keywordsC.value != '') {
    keywordsArr = keywordsC.value.split('@');
    keywordsArr.shift();
    keywordsArr.forEach((item) => {
      arr.push(item.toLowerCase().trim());
    });

  }

  data.keywords = arr

}

var keywordI = document.getElementById('keywords');
var ats = 0;
keywordI.addEventListener('keydown', event => {
  console.log("dasda");
  if(event.keyCode === 50) {
    var str = keywordI.value;
    ats = str.replace(/[^@]/g, "").length;
  }
});

function checkFields() {
  const kind = document.querySelector('.kind').value,
    cookingTime = document.querySelector('#cookingTime').value,
    servings = document.querySelector('#servings').value,
    dishName = document.querySelector('#dishName').value,
    description = document.querySelector('#description').value;

  const inputArr = [['kind of recipe', kind], ['cooking time', cookingTime], ['servings', servings], ['dish name', dishName], ['description', description]];
  required(inputArr)
}

function required(arr) {
  var emptyFields = [];
  for(input of arr) {
    if(input[1].length == 0) {
      emptyFields.push(input[0]);
    }
  }
  return checkImage(emptyFields)
}


function checkImage(arr) {
  var message = document.querySelector('.message');
  if (typeof arr !== 'undefined' && arr.length > 0 && imageUpload === false) {
    message.innerHTML = "The following field(s) are empty: image, " + arr;
  } else if(typeof arr !== 'undefined' && arr.length > 0) {
    message.innerHTML = "The following field(s) are empty: " + arr;
  } else if(imageUpload === false) {
    message.innerHTML = "Please upload an image";
  } else {
    post()
  }
}

function addDate() {
  var today = new Date();

  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (day < 10) {
    day = '0' + day
  }
  if (month < 10) {
    month = '0' + month
  }

  var date = day + "/" + month + "/" + year;
  data.date = date;
}

const fetchData = async() => {
  const optionsImage = {
    method: "POST",
    contentType: "application/json",
    body: image
  };

  const imageFetch = await fetch('/upload-recipe-image/recipe', optionsImage)
  const imageData = await imageFetch.json()
  data.image = imageData.imagePath;

  console.log(data);


  const optionsData = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const fetchRecipe = await fetch('/upload-recipe', optionsData);
  window.location.href = "/succes"
}

function createRecipe() {
  data = {
    kind: {breakfast: true, lunch: false, dinner: false, desert: false, snack: false},
    country: "france",
    region: "paris",
    cookingTime: "2",
    servings: "1",
    dish: "dsad",
    description: "ewq",
    ingredients: [{amount: "2", measure: "", ingredient: "eqw"}, {amount: "1", measure: "", ingredient: "dsad"}, {amount: "3", measure: "", ingredient: "gwg"}],
    allIngredients: ["eqw", "dsad", "gwg"],
    instructions: ["ewqe", "ewqedsada", "dqweqwe"],
    keywords: ["ehmhellyeah", "challenge", "dothis"],
    image: "uploads/recipe/158748209890620191011-creamy-tuscan-chicken-delish-ehg-2521-1571259466.png"
  }

  const optionsData = {
    method: "POST",
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const fetchRecipe = fetch('/upload-recipe', optionsData);
  window.location.href = "/succes"
}

function post() {
  getKind();
  getCountry();
  getImage();
  getCookingTime();
  getServings();
  getDishName();
  getDescription();
  getIngredients();
  getMethod();
  getKeywords();
  addDate();
  fetchData();
}
