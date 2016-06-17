// Final.js
// Andrew Ortego
// 12/18/2014
// 
// This script creates boxes in the document! The user can specify which color the
// boxes will be, whether 5, 10, or 15 will be created, and the text displayed
// inside the boxes. Clicking a box will display metadata about it.

window.onload = init;

var counter = 0; // increments for each box created
var boxes = []; // holds all box-div elements

function Box(id, name, color, x, y) {
    // creates a new box object to display with the generate function
    this.id = id;
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    
    this.display = function() {
        // alerts user to the info about the box they clicked
        alert("== Box Info ==" +
              "\nID: " + this.id +
              "\nName: " + this.name +
              "\nColor: " + this.color +
              "\nX position: " + this.x +
              "\nY position: " + this.y);             
    }
}

function init() {
    // load the button handlers for generating and clearing boxes
    var b_generate = document.getElementById("generateButton");
    b_generate.onclick = generate;
    
    var b_clear = document.getElementById("clearButton");
    b_clear.onclick = clear;
}

function generate() {
    // get the form and each input object in it
    var f_data = document.forms.data;
    var b_name = f_data.elements.name.value;
    var b_color = f_data.elements.color.value;
    var b_amount = f_data.elements.amount;
  
    // check for valid input and display error messages for missing data    
    var amount = null;
    for (i = 0; i < b_amount.length; i++) {
        if (b_amount[i].checked) {
            amount = b_amount[i].value;
        }
    }
    if (b_name == "" || b_name == null) {
        alert("Please enter a name");
    } else if (amount == null) {
        alert("Please select an amount");
    } else {
        for (i = 0; i < amount; i++) {
            // create the x, y position attributes of the box
            var scene_div = document.getElementById("scene");
            var x = Math.floor(Math.random() * (scene_div.offsetWidth-101));
            var y = Math.floor(Math.random() * (scene_div.offsetHeight-101));
            
            // create a new box and add it to the boxes array
            var box = new Box(counter, b_name, b_color, x, y);
            boxes.push(box);
            counter += 1;
            
            // create a div to represent the box & add it to the page
            var box_div = document.createElement("div");
            box_div.className = "box";
            box_div.id = box.id;
            box_div.innerHTML = box.name;
            box_div.style.backgroundColor = box.color;
            box_div.style.left = x + "px";
            box_div.style.top = y + "px";
            scene_div.appendChild(box_div);
            box_div.onclick = box_info;
        }
    }
}

function clear() {
    // clear the forms and remove all boxes from the page
    var f_data = document.forms.data;
    f_data.reset();
    var scene_div = document.getElementById("scene");
    while (scene_div.firstChild) {
        scene_div.removeChild(scene_div.firstChild);
    }
    counter = 0;
    boxes = [];
}

function box_info(e) {
    // displays the metadata for the box which is associated with the box-div
    var box_div = e.target;
    var box = boxes[box_div.id];
    box.display();
}
