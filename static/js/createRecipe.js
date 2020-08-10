var title = document.querySelector("#title");
var dish = document.querySelector("#dish");
var uploadImg = document.querySelector("#image")
var servings = document.querySelector("#servings");
var recipeDescription = document.querySelector("#description");
var ingredientContainer = document.querySelector("#ingredients");
var instructionContainer = document.querySelector("#instructions");
var input = document.querySelector("#input");
var next = document.querySelector("#next");
var invisibleForm = document.querySelector("#invForm");
var actions = document.querySelector("#actions");

var ingredientHolder = [];
var instructionCount = 1;

// when enter is pressed go to next step
input.addEventListener("keydown", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    // Trigger the button element with a click
    next.click();
  }
});

//edit
var editBtn = "<i class='far fa-edit edit' onclick='editThis(this)'></i>";
// 1
  imgPath: ""
var data = new FormData();
function createRecipe() {
  //add change class
  document.querySelector("#dishTitle h2").setAttribute("class", "change string");


  input.style.display = "none";

  actions.innerHTML = "Upload an image";

  var uploadBtn = document.createElement("input");
  uploadBtn.setAttribute("type", "file")
  uploadBtn.setAttribute("name", "imgUpload")
  uploadBtn.setAttribute("accept", "image/*");

  uploadBtn.addEventListener("change", function() {
    const file = this.files[0];
    imgPath = this.files[0].name;
    if(file) {
      createImageUpload()
      data.set('recipeImage', file);
      console.log(data.recipeImage);
    }
  })

  var dishName = input.value;
  dish.innerHTML = dishName;
  var dishTitle = document.querySelector("#dishTitle");
  dishTitle.querySelector(".changeC").innerHTML = editBtn;
  document.querySelector("#dishTitle b").innerHTML = "Recipe name: ";

  var imgContainer = document.createElement("div");
  imgContainer.setAttribute("class", "imagePreview");
  imgContainer.setAttribute("id", "imagePreview");

  var recipeImg = document.createElement("img");
  recipeImg.setAttribute("src", "");
  imgContainer.appendChild(recipeImg);

  uploadImg.appendChild(uploadBtn);
  uploadImg.appendChild(imgContainer);
}

// 2
function createImageUpload() {
  document.querySelector("#imageTitle p").setAttribute("class", "change file");
  var imageTitle = document.querySelector("#imageTitle");
  imageTitle.querySelector(".changeC").innerHTML = editBtn;
  document.querySelector("#imageTitle b").innerHTML = "Image: ";
  document.querySelector("#imagePath").innerHTML = imgPath;

  uploadImg.style.display = "none";
  input.style.display = "inline";
  actions.innerHTML = "How many servings?";
  input.setAttribute("type", "number");
  input.value = "";
}

// 3
function createServings() {
  document.querySelector("#servingsTitle p").setAttribute("class", "change numb");
  var servingsTitle = document.querySelector("#servingsTitle");
  servingsTitle.querySelector(".changeC").innerHTML = editBtn;
  document.querySelector("#servingsTitle b").innerHTML = "Servings:"
  var servingsAmount = input.value;
  servingsTitle.querySelector("p").innerHTML = servingsAmount;
  actions.innerHTML = "Some more information about your dish";
  input.setAttribute("type", "text");
  input.value = "";
}

// 4
function createDescription() {
  document.querySelector("#descriptionTitle p").setAttribute("class", "change string");
  var descriptionTitle = document.querySelector("#descriptionTitle");
  descriptionTitle.querySelector(".changeC").innerHTML = editBtn;
  document.querySelector("#descriptionTitle b").innerHTML = "Description:"
  var descriptionInput = input.value;
  descriptionTitle.querySelector("p").innerHTML = descriptionInput;
  actions.innerHTML = "Ingredients you need";
  input.setAttribute("placeholder", "Seperate by ','")
  input.value = "";
}

// 5
function createIngredients() {
  var ingredientsTitle =  document.querySelector("#ingredientsTitle");
  document.querySelector("#ingredientsTitle b").innerHTML = "Ingredients:"
  var ingredientInput = input.value;
  input.value = "";
  input.style.display = "none";

  ingredientHolder = ingredientInput.split(',');
  ingredientBtnMake(ingredientHolder);
  actions.innerHTML = "How much?";

  var ingBtn = document.getElementById("ingredients").querySelectorAll("div");
  var quantInp = document.createElement("input");

  var quantInpField =  "<input type='number' class='input quant'>";
  var quantMeasure =  "<div class='select'><select><option value='' disabled selected>Select Measure</option><option val='kg'>kg</option><option val='g'>g</option><option val='ounce'>ounce</option><option val='pound'>pound</option><option val='dl'>dl</option><option val='l'>l</option><option val='ml'>ml</option><option val='cup(s)'>cup(s)</option><option val='tblsp'>tblsp</option><option val='tsp'>tsp</option></select></div>";
  ingBtn.forEach((ingBtn, i) => {

    ingBtn.innerHTML =  quantInpField + quantMeasure + ingBtn.innerHTML;
  });

}

// create ingredient buttons
function ingredientBtnMake(arr) {
  for (var i = 0; i < arr.length; i++) {
    var div = "<div class='"+ i + " control'><button class='button ingr'>" + arr[i] +  "</button></div>"
    document.querySelector("#ingredients").innerHTML += div;
  }
}

function createQuantities() {
  document.querySelector("#ingredients").setAttribute("class", "change ingredients");
  ingredientsTitle.querySelector(".changeC").innerHTML = editBtn;
  var finish = document.createElement("A");
  finish.setAttribute("id", "finish");
  finish.setAttribute("onClick", "finish('<%= email %>')")
  finish.innerHTML = "finish";
  inputs.appendChild(finish);
  input.setAttribute("placeholder", "")
  input.value = "";
  input.style.display = "block";

  actions.innerHTML = "The method for cooking your dish";
}

function addQuant() {

  var quantIng = document.querySelector("#ingredients").querySelectorAll(".control");
  var completeIngr = "<div class='ingList'>";
  quantIng.forEach((item, i) => {
    var toList;
    var amount = item.querySelector("input").value;
    var select = item.querySelector(".select select");
    var measure = select.options[select.selectedIndex].value;

    var ingr = item.querySelector(".ingr").innerHTML;

    toList = "<p><span class='amount'>" + amount + "</span><span class='measure'>" + measure + " </span><span class='ingr'>"  + ingr + "</span></p>";
    completeIngr += toList;
    console.log()
  });
  completeIngr += "</div>";
  document.querySelector("#ingredients").innerHTML = completeIngr;
  createQuantities();
}

// 5
function createInstructions() {
  document.querySelector("#instructions").setAttribute("class", "change method");
  var methodTitle = document.querySelector("#methodTitle");
  if(document.querySelector("#instructions").innerHTML == "") {
    methodTitle.querySelector(".changeC").innerHTML = editBtn;
  }

  document.querySelector("#methodTitle b").innerHTML = "Method:"

  var instructionInput = input.value;

  var instruction = "<p>" + "<span class='methodNr'>" + instructionCount + ")</span>" + "<span class='instruction'>" + instructionInput + "</span></p>";
  document.querySelector("#instructions").innerHTML += instruction;
  instructionCount++;
  input.value = "";
}

// 6
function finish() {
  var path = "/upload-recipe";

  var servs = document.getElementById("servings");
  //get ingredients
  var ingredients = "";
  var ingList = document.querySelector("#ingredients").querySelectorAll("p");
  var ingrObj = new Object();
  ingList.forEach((item, i) => {
    var amount = item.querySelector(".amount").innerHTML;
    var measure = item.querySelector(".measure").innerHTML;
    var ingredient = item.querySelector(".ingr").innerHTML;
    ingrObj.amount = Number(amount);
    ingrObj.measure = measure;
    ingrObj.ingredient = ingredient;
    ingredients += JSON.stringify(ingrObj);
    console.log("item" + i);
    console.log("listCount" + ingList.length);
    if(i != ingList.length - 1) {
      ingredients += "*";
    }
  });

  var instructions = "";
  var descriptionLine = document.getElementById("instructions").querySelectorAll(".instruction");
  descriptionLine.forEach((item, i) => {
    instructions += item.innerHTML;
    if(i != descriptionLine.length - 1) {
      instructions += "*";
    }
  })

  data.append('dish', dish.innerHTML);
  data.append('servings', servs.innerHTML);
  data.append('description', recipeDescription.innerHTML);
  data.append('ingredients', ingredients);
  data.append('instructions', instructions);



  const options = {
    body: data,
    method: "POST",
    contentType: 'application/json',
  };

  fetch('/upload-recipe/recipe', options)
  .then((response) => {
    window.location.href = "/explore";
  })

}

function nextThing() {
  var step = actions.innerHTML
  if (step == "What's the name of your dish?") {
    createRecipe();
  } else if (step == "Upload an image") {
    createImageUpload();
  } else if (step == "How many servings?") {
    createServings();
  } else if (step == "Some more information about your dish") {
    createDescription();
  } else if (step == "Ingredients you need") {
    createIngredients();
  } else if (step == "How much?") {
    addQuant()
  } else if (step == "The method for cooking your dish"){
    createInstructions();
  } else {
    alert("next")
  }
}
