// todo.js
// blah blah blah
// documentation

function Todo(id, task, who, dueDate, location) {
    this.id = id;
    this.task = task;   
    this.who = who;
    this.dueDate = dueDate;
    this.done = false;
    this.location = location;
}

var todos = new Array(); // Holds all present ToDo items on the page
window.onload = init;

function init() {
    var submitButton = document.getElementById("submit");
    var searchButton = document.getElementById("searchButton");
    var clearSearch = document.getElementById("clearSearch");
    submitButton.onclick = getFormData;
    searchButton.onclick = searchTodos;
    clearSearch.onclick = hideSearchResults;
    todos = getTodos();
}
             
function getFormData() {
    // Error checks the user's input and adds a new ToDo Item to the page and local storage
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;

    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;

    var loc = document.getElementById("location").value;
    
    var id = (new Date()).getTime();
    var todoItem = new Todo(id, task, who, date, loc);
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem); // Works if local storage is present, or shows error message
    hideSearchResults(); // clear previous search results
}

function checkInputText(value, msg) {
    // Error-check the user's input
    if (value == null || value == "") {
        alert(msg);
        return true;
    } else {
        return false;
    }
}

// *************************
//      ADD TODO ITEM
// *************************
function addTodoToPage(todoItem) {
    // Adds ToDo items from the Submit button to the page
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    document.forms[0].reset();
}

function createNewTodo(todoItem) {
    // Creates a new ToDo item to display on the page
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);
    var spanTodo = document.createElement("span");
    spanTodo.setAttribute("class", "text");
    spanTodo.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate;

    // Add the Done/Not Done button
    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        li.setAttribute("class", "bg_red");
        spanDone.setAttribute("title", "Mark Complete");
        spanDone.innerHTML = "&nbsp;&#10152;&nbsp;";
    }
    else {
        spanDone.setAttribute("class", "done");
        li.setAttribute("class", "bg_green");
        spanDone.setAttribute("title", "Mark Incomplete");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }
    spanDone.onclick = updateDone;

    // Add the geolocation button if the location text box is populated
    if (todoItem.location) {
        var img = document.createElement("img");
        img.src="images/urf.png";
        img.setAttribute("id", "addressButton");
        img.setAttribute("alt", "locate");
        img.setAttribute("title", "Map Location");
        img.onclick = displayAddress;
    }

    // Add the Delete button
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "delete");
    spanDelete.setAttribute("title", "Delete Item");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
    spanDelete.onclick = deleteItem;

    //Add date info to the item and calculate whether it's overdue or not
    var spanDate = document.createElement("span");
    spanDate.setAttribute("class", "date");

    var now = new Date();
    var due = new Date();
    var timeLeft = new Date();

    now = Date.now();
    due = new Date(todoItem.dueDate);
    timeLeftms = due - now;
    timeLeftDays = Math.ceil(timeLeftms / 1000 / 60 / 60 / 24);

    if (timeLeftDays == 0) spanTodo.innerHTML += " (due today)";
    else if (timeLeftDays == 1) spanTodo.innerHTML += " (" + timeLeftDays + " day left)";
    else if (timeLeftDays == -1) spanTodo.innerHTML += " (" + Math.abs(timeLeftDays) + " day OVERDUE)";
    else if (timeLeftDays > 0) spanTodo.innerHTML += " (" + timeLeftDays + " days left)";
    else if (timeLeftDays < 0) spanTodo.innerHTML += " (" + Math.abs(timeLeftDays) + " days OVERDUE)";
 
    // Add elements to the li item
    li.appendChild(spanDone);
    if (todoItem.location) {
        li.appendChild(img);
    }
    li.appendChild(spanTodo);
    li.appendChild(spanDelete);
    
    return li;
}

function locate(add) {
    map.graphics.clear();
    var address = {
        "SingleLine": add
    };
    locator.outSpatialReference = map.spatialReference;
    var options = {
        address: address,
        outFields: ["Loc_name"]
    };
    locator.addressToLocations(options);
}

// *************************
//     SEARCH FUNCTIONS
// *************************
function searchTodos() {
    clearSearchResultsList();
    var searchTerm = document.getElementById("searchTerm").value;
    var matches = 0;
    // check all the todos in the list
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var re = new RegExp(searchTerm, "i");
        if (todoItem.task.match(re) || todoItem.who.match(re)) {
            addSearchResultToPage(todoItem);
            matches++;
        }
    }
    // if we don't match any items, display "no results" in the search results list
    if (matches == 0) {
        var ul = document.getElementById("searchResultsList");
        var li = document.createElement("li");
        li.innerHTML = "No results!";
        ul.appendChild(li);
    }
    showSearchResults();
}

// add a search result to the search results list in the page
function addSearchResultToPage(todoItem) {
    var ul = document.getElementById("searchResultsList");
    var li = document.createElement("li");
    li.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate;
    ul.appendChild(li);
}

// clear the previous search results by removing all the children of the "searchResultsList" ul element
function clearSearchResultsList() {
    var ul = document.getElementById("searchResultsList");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

// don't show anything unless the user's just searched
function hideSearchResults() {
    var div = document.getElementById("searchResults");
    div.style.display = "none";
    clearSearchResultsList();
}

function showSearchResults() {
    var div = document.getElementById("searchResults");
    div.style.display = "block";
    document.forms[0].reset();
}