const $ = require("jquery");

if (!localStorage.getItem("todos"))
  localStorage.setItem("todos", JSON.stringify([]));
const todos = JSON.parse(localStorage.getItem("todos"));

// Load all existing todos

todos.forEach(({ index, text, due, star, completed }) => {
  const div = getDiv(text, due, star, completed);
  $("#tasks").append(div);
});

// Toggle dark or light theme

$("#checkbox").click(() => {
  $("#slider").toggleClass("right").toggleClass("left");
  $("#checkbox").toggleClass("right").toggleClass("left");
  $("body").toggleClass("dark");
  if ($("body").hasClass("dark")) {
    $(".todo").css("border", "2px solid white");
    $(".todo-modify").css("border", "2px solid white");
  } else {
    $(".todo").css("border", "2px solid black");
    $(".todo-modify").css("border", "2px solid black");
  }
});
$("#add-star").click(() => {
  $("#add-star").toggleClass("enabled");
});

// Returns a new todo div based on data

function getDiv(text, dueDate, important, completed) {
  const newDiv = $("<div></div>").addClass("todo");
  const subDiv = $("<div></div>").addClass("todo-modify");
  const h2 = $("<h2></h2>").addClass("todo-title").text(text);
  const h3 = $("<h3></h3>").addClass("todo-due").text(dueDate);
  const day = new Date().getDate();
  const dueDay = new Date(dueDate).getDate();
  if (day < dueDay) h3.css("color", "green");
  if (day == dueDay) h3.css("color", "orange");
  if (day > dueDay) h3.css("color", "red");
  const delIcon = $(
    "<i class='fas fa-trash todo-delete' onclick='deleteDiv(this)'></i>"
  );
  const starIcon = $(
    "<i class='fas fa-star todo-star' onclick='modifyStar(this)''></i>"
  );
  const completedIcon = $(
    '<i class="fas fa-check-circle todo-check" onclick="modifyChecked(this)"></i>'
  );
  if (important) starIcon.addClass("enabled");
  if (completed) completedIcon.addClass("checked");
  if ($("body").hasClass("dark")) {
    subDiv.css("border", "2px solid white");
    newDiv.css("border", "2px solid white");
  }
  subDiv.append(completedIcon);
  subDiv.append(starIcon);
  subDiv.append(delIcon);
  newDiv.append(h2);
  newDiv.append(subDiv);
  newDiv.append(h3);
  return newDiv;
}

// add a new todo (accessed from onclick event)

function addItem(plusIcon) {
  const data = $(plusIcon).parent().parent();
  const [text, due, important] = [
    data.children("#add-input"),
    data.children("#add-date"),
    data.children("#add-options").children("#add-star"),
  ];
  if (!text.val() || !due.val()) return;
  // const dueDate = new Date(due.val()).getTime() - new Date().getTime();
  const isStarred = important.hasClass("enabled");
  const div = getDiv(text.val(), due.val(), isStarred);
  let prevLength = todos.length;
  todos.push({
    index: prevLength,
    text: text.val(),
    due: due.val(),
    star: isStarred,
    completed: false,
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  $("#tasks").append(div);
  $("input").val("");
  $("#add-star").removeClass("enabled");
}

// unstar or star a todo (accessed from onclick event)

function modifyStar(b) {
  const btn = $(b);
  const index = $(btn).parent().parent().index();
  todos[index].star = !btn.hasClass("enabled");
  btn.toggleClass("enabled");
  localStorage.setItem("todos", JSON.stringify(todos));
}

// mark complete or uncomplete (accessed from onclick event)

function modifyChecked(b) {
  const btn = $(b);
  const index = $(btn).parent().parent().index();
  todos[index].completed = !todos[index].completed;
  btn.toggleClass("checked");
  localStorage.setItem("todos", JSON.stringify(todos));
}

// delete a div (accessed from onclick event)

function deleteDiv(delBtn) {
  const parentDiv = $(delBtn).parent().parent(".todo");
  todos.splice(
    todos.indexOf(todos.find((o) => parentDiv.index() == o.index)),
    1
  );
  parentDiv.remove();
  localStorage.setItem("todos", JSON.stringify(todos));
}

// change to my day/important/complete/all

$(".sidebar-selector").click((e) => {
  const element = $(e.target);
  if (element.is("#ss-my-day")) {
    $("#title").text("My Day");
    const filtered = [...todos].filter(
      (o) => new Date().getDate() == new Date(o.due).getDate()
    );
    $("#tasks").empty();
    filtered.forEach(({ index, text, due, star, completed }) => {
      const div = getDiv(text, due, star, completed);
      $("#tasks").append(div);
    });
  }
  if (element.is("#ss-important")) {
    $("#title").text("Important");
    const filtered = [...todos].filter((o) => o.star);
    $("#tasks").empty();
    filtered.forEach(({ index, text, due, star, completed }) => {
      const div = getDiv(text, due, star, completed);
      $("#tasks").append(div);
    });
  }
  if (element.is("#ss-completed")) {
    $("#title").text("Completed");
    const filtered = [...todos].filter((o) => o.completed);
    $("#tasks").empty();
    filtered.forEach(({ index, text, due, star, completed }) => {
      const div = getDiv(text, due, star, completed);
      $("#tasks").append(div);
    });
  }
  if (element.is("#ss-all-tasks")) {
    $("#title").text("All Tasks");
    $("#tasks").empty();
    todos.forEach(({ index, text, due, star, completed }) => {
      const div = getDiv(text, due, star, completed);
      $("#tasks").append(div);
    });
  }
});
