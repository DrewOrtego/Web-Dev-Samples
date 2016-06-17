var todos = new Array(); // Holds all present ToDo items on the page

function getTodoItems() {
	// Creates a list of items from local storage to add to the page
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.substring(0, 4) == "todo") {
            var item = localStorage.getItem(key);
            var todoItem = JSON.parse(item);
            todos.push(todoItem);
        }
    }
    addTodosToPage();
}       

function addTodosToPage() {
    // Display ToDo items from local storage to the page
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}

function updateDone(e) {
	// Click event for the "Done" button
    var span = e.target;
    var id = span.parentElement.id;
    
    // Update the item in localStorage
    var key = "todo" + id;
    var item = JSON.parse(localStorage[key]);
    if (item.done) {
        item.done = false;
    } else {
        item.done = true;
    }
    var item = JSON.stringify(item);
    localStorage.setItem(key, item);

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
        li_item.setAttribute("class", "bg_green");
    }
}

function deleteItem(e) {
    // Click event for the delete button-- removes item from local storage and webpage
    var span = e.target;
    var id = span.parentElement.id;
    
    // find and remove the item in localStorage
    var key = "todo" + id;
    localStorage.removeItem(key);

    // find and remove the item in the array
    updateArray(id);

    // find and remove the item in the page
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}

function saveTodoItem(todoItem) {
    // Store a newly-created item in local storage
    var key = "todo" + todoItem.id;
    var item = JSON.stringify(todoItem);
    localStorage.setItem(key, item);
}

function updateArray(id) {
    // Update the local array of todo items on the page
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos.splice(i, 1); // removes 1 item at position i
            break;
        }
    }
}

function displayAddress(e) {
    // Zoom to the location of a todo item on the map
    var img = e.target;
    var id = "todo" + img.parentElement.id;
    var item = JSON.parse(localStorage[id]);
    locate(item.location);
}

function getTodos() {
    return todos;
}