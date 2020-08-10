function editThis(a) {
  var container = a.parentNode.parentNode;
  var parent = container.querySelector(".change");
  var initialValue = parent.innerHTML;
  console.log(container);

  // get data type
  var classes = parent.className.split(' ');
  console.log(classes);
  var type;
  if(classes.includes("string")) {
    type = "string";
  } else if(classes.includes("file")) {
    type = "file";
  } else if(classes.includes("numb")) {
    type = "numb";
  } else if(classes.includes("ingredients")) {
    type = "ingredients";
  } else if(classes.includes("method")) {
    type = "method";
  }
  // temporarily hide initial value
  function hideParent() {
    parent.innerHTML = "";
  }


  // check type and create input field for change accordingly
  if(type == "string") {
    hideParent();
    var changeField = document.createElement("INPUT");
    changeField.setAttribute("value", initialValue);
    changeField.setAttribute("class", "changeField");
    container.append(changeField);
    addDone();
  }

  if(type == "file") {
    a.parentNode.parentNode.parentNode.querySelector("#image input").click();
    console.log(imgPath)
  }

  if(type == "numb") {
    var initialValue = parent.innerHTML;
    hideParent();
    var changeField = document.createElement("INPUT");
    changeField.setAttribute("type", "number");
    changeField.setAttribute("value", initialValue);
    changeField.setAttribute("class", "changeField");
    container.append(changeField);
    addDone();
  }

  if(type == "ingredients") {
    var initialIngredients = [];
    var ingredientsLi = parent.querySelectorAll("p");
    hideParent();
    container.append(addDoneIng());

    ingredientsLi.forEach((item, i) => {
      var obj = {}
      // gather initial values
      var amount = item.querySelector(".amount").innerHTML;
      var measure = item.querySelector(".measure").innerHTML;
      var ingredient = item.querySelector(".ingr").innerHTML;
      // add to initial variable
      obj.amount = amount;
      obj.measure = measure;
      obj.ingredient = ingredient;

      initialIngredients.push(obj);

      // create div with different class
      var divC = document.createElement("div");
      divC.setAttribute("class", i + " temp");
      divC.innerHTML = listInputs(obj);

      container.append(divC);
      
    });
  }

  if(type == "method") {
    var inputs = "";
    var allInstr = parent.querySelectorAll("p");
    hideParent();
    container.append(addDoneMethod());

    allInstr.forEach((item, i) => {
      console.log(item);
      var count = i + 1
      inputs += "<p class='tempCount'>" + count + ")</p><input type='text' class='input' value='" + item.querySelector(".instruction").innerHTML + "'>"
    });
    container.innerHTML += inputs;
    console.log(parent);
  }

  function listInputs(ingrFull) {
    var quantInp = "<input type='number' class='input amount' value='" + ingrFull.amount + "'>";
    var measureInp = initialMeasure(ingrFull.measure);
    var ingrInp = "<input type='text' class='input ingr' value='" + ingrFull.ingredient + "'>";
    console.log(quantInp);
    console.log(parent);
    return quantInp + measureInp + ingrInp;
  }

  // add done button
  function addDone() {
    var doneBtn = document.createElement("i");
    doneBtn.setAttribute("class", "far fa-check-circle");
    doneBtn.setAttribute("onClick", "change(this)");
    container.append(doneBtn);
  }

  function addDoneIng() {
    var doneBtn = document.createElement("i");
    doneBtn.setAttribute("class", "far fa-check-circle");
    doneBtn.setAttribute("onClick", "changeIng(this)");
    return doneBtn;
  }

  function addDoneMethod() {
    var doneBtn = document.createElement("i");
    doneBtn.setAttribute("class", "far fa-check-circle");
    doneBtn.setAttribute("onClick", "changeMethod(this)");
    return doneBtn;
  }
}

// change
function change(where) {
  //get newValue
  var newValue = where.parentNode.querySelector(".changeField").value;
  // get location
  var here = where.parentNode.querySelector(".change");
  // change
  here.innerHTML = newValue;
  // remove input field
  var field = where.parentNode.querySelector(".changeField");
  where.parentNode.removeChild(field);
  where.parentNode.removeChild(where);
}

function initialMeasure(initMeasure) {
  var kg = "<option val='kg'>kg</option>";
  var g = "<option val='g'>g</option>";
  var ounce = "<option val='ounce'>ounce</option>";
  var pound = "<option val='pound'>pound</option>";
  var dl = "<option val='dl'>dl</option>";
  var l = "<option val='l'>l</option>";
  var ml = "<option val='ml'>ml</option>";
  var cups = "<option val='cup(s)'>cup(s)</option>";
  var tblsp = "<option val='tblsp'>tblsp</option>";
  var tsp = "<option val='tsp'>tsp</option>";
  var measureArr = [kg, g, ounce, pound, dl, l, ml, cups, tblsp, tsp];
  var initial;
  console.log(initMeasure);
  switch (initMeasure) {
    case "kg ":
      initial = measureArr[0];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      console.log(initialFull);
      measureArr.splice(0, 1);
      break;
    case "g ":
      initial = measureArr[1];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(1, 1);
      break;
    case "ounce ":
      initial = measureArr[2];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(2, 1);
      break;
    case "pound ":
      initial = measureArr[3];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(3, 1);
      break;
    case "dl ":
      initial = measureArr[4];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(4, 1);
      break;
    case "l ":
      initial = measureArr[5];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(5, 1);
      break;
    case "ml ":
      initial = measureArr[6];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(6, 1);
      break;
    case "cups ":
      initial = measureArr[7];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(7, 1);
      break;
    case "tblsp ":
      initial = measureArr[8];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(8, 1);
      break;
    case "tsp ":
      initial = measureArr[9];
      initialFull = initial.substring(0, 7) + " selected " + initial.substring(8);
      measureArr.splice(9, 1);
  }
  console.log(measureArr);

return "<div class='select quant'><select><option value='' disabled>Select Measure</option>" + initialFull + measureArr + "</select></div>";
}

function changeIng(where) {
  var toList = "";
  var parent = where.parentNode;
  console.log(parent);
  var here = parent.querySelector(".change");
  var allIng = parent.querySelectorAll(".temp");
  allIng.forEach((item, i) => {
    console.log(i);
    var amount = item.querySelector(".amount").value;
    var select = item.querySelector(".select select");
    var measure = select.options[select.selectedIndex].value;
    var ingredient = item.querySelector(".ingr").value;
    toList += "<p><span class='amount'>" + amount + "</span><span class='measure'>" + measure + " </span><span class='ingr'>"  + ingredient + "</span></p>";
    parent.removeChild(item)
  });
  here.innerHTML = toList;
  // to remove
  parent.removeChild(where)
}

function changeMethod(where) {
  var toList = "";
  var parent = where.parentNode;
  console.log(parent);
  var here = parent.querySelector(".change");
  var allMethods = parent.querySelectorAll("input");
  var allTempCount = parent.querySelectorAll(".tempCount");
  allTempCount.forEach((item, i) => {
    parent.removeChild(item);
  });

  allMethods.forEach((item, i) => {
    var count = i + 1
    toList += "<p><span class='methodNr'>" + count + ")</span><span class='instruction'>" + item.value + "</span></p>";
    parent.removeChild(item)
  });
  here.innerHTML = toList;
  var addBtn = parent.querySelector("i");
  parent.removeChild(where)
}
