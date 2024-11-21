const addButton = document.querySelector(".add-new button");
const inputText = document.querySelector(".add-new input");
const template = document.getElementById("to-do-template");
const container = document.querySelector(".todos");
const succesContainer = document.querySelector(".succes-list");

const toDoSpan = document.querySelector(".to-do-count");
const allDoneSpan = document.querySelector(".all-done-count");
const clearButton = document.querySelector('.clear-all');
const saveTasks = [];



addButton.addEventListener("click", function () {
    inputText.style.display = "block";
});


function resetForm() {
    inputText.style.display = "none";
    inputText.value = "";
}

function createTask(task = null) {
    let inputValue = task ? task.text : inputText.value;
    let newTemplate = template.content.cloneNode(true);
    newTemplate.querySelector("p").textContent = inputValue;

    const taskObject = {
        text: inputValue,
        id: Math.floor(Math.random() * 100),
    };
    saveTasks.push(taskObject);
    localStorage.setItem("item", JSON.stringify(saveTasks));

    let contentEditable = newTemplate.querySelector(
        '[contenteditable="true"]'
    );

    const removeBtn = newTemplate.querySelector(".remove");
    const doneBtn = newTemplate.querySelector("svg");
    updateToDocount();

    doneBtn.addEventListener("click", function () {
        let editText = contentEditable.innerText;
        const newLi = document.createElement("li");
        newLi.textContent = [editText];

        succesContainer.appendChild(newLi);

        let completedTask =
            JSON.parse(localStorage.getItem("succes")) || [];
        completedTask.push({ text: editText, id: taskObject.id });
        localStorage.setItem("succes", JSON.stringify(completedTask));

        let removeTask = JSON.parse(localStorage.getItem("item")) || [];
        removeTask = removeTask.filter((y) => y.id !== taskObject.id);
        localStorage.setItem("item", JSON.stringify(removeTask));

        updateAllDoneCount();
        updateToDocount();

        doneBtn.closest("li").remove();
    });

    removeBtn.addEventListener("click", function () {
        removeBtn.closest("li").remove();

        let tasks = JSON.parse(localStorage.getItem("item"));
        tasks = tasks.filter((x) => x.id !== taskObject.id);
        localStorage.setItem("item", JSON.stringify(tasks));
        updateToDocount();
    });

    container.appendChild(newTemplate);
}

inputText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (inputText.value !== '') {
            createTask();
            resetForm();
        }
    }
});

window.addEventListener("load", function () {
    const loadTask =
        JSON.parse(this.localStorage.getItem("item")) || [];
    if (loadTask) {
        loadTask.forEach((x) => createTask(x));
    }

    const succesTask =
        JSON.parse(this.localStorage.getItem("succes")) || [];
    succesTask.forEach((y) => {
        const newLi = this.document.createElement("li");
        newLi.textContent = y.text;
        succesContainer.appendChild(newLi);
    });

    updateAllDoneCount();
});

let toDoNumber = 0;
let allDoneNumber = 0;

function updateToDocount() {
    let toDoCount = JSON.parse(localStorage.getItem("item"));
    toDoNumber = toDoCount.length;
    toDoSpan.textContent = toDoNumber;
}

function updateAllDoneCount() {
    let allDoneCount = JSON.parse(localStorage.getItem("succes")) || [];
    allDoneNumber = allDoneCount.length;
    allDoneSpan.textContent = allDoneNumber;

    console.log(allDoneCount);
}

clearButton.addEventListener('click', function () {
    localStorage.removeItem('succes');
    succesContainer.innerHTML = '';
    updateAllDoneCount();
})