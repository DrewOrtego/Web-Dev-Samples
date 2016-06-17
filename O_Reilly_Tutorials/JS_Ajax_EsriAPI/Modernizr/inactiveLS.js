var todos = new Array(); // Holds all present ToDo items on the page

function getTodoItems() {
	// If local storage is not available, this code alerts the user
    alert("Local Storage is not available!\nCannot load or save items from the browser.");
}

function saveTodoItem(todoItem) {
	// Alert user that the item cannot be saved to local storage
	console.log("Error: you don't have localStorage! Item will not persist after exiting the website.");
}

function updateDone(e) {
	// Click event for the "Done" button
	var span = e.target;
    var id = span.parentElement.id;
    var li_item = document.getElementById(id);
    var status = span.getAttribute("class");
    if (status == "done") {
        span.setAttribute("class", "notDone");
        span.setAttribute("title", "Mark Complete");
        span.innerHTML = "&nbsp;&#10152;&nbsp;";
        li_item.setAttribute("class", "bg_red");
    } else {
        span.setAttribute("class", "done");
        span.setAttribute("title", "Mark Incomplete");
        span.innerHTML = "&nbsp;&#10004;&nbsp;";
        li_item.setAttribute("class", "green");
    }
}

function deleteItem(e) {
    // Click event for the delete button-- removes item from webpage
    var span = e.target;
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}

function displayAddress(e) {
    alert("Geocoding not available without active local storage.\nActivate local storage to use this feature.")
}