// SET VARIABLES
const listTable = document.getElementById("list-table");
const listTableBody = document.getElementById("list-table-body");
const taskModal = new bootstrap.Modal(document.getElementById("task"));
const todoForm = document.getElementById("todoForm");
const taskCount = document.createElement("p");

// Cargar las tareas desde localStorage al cargar la pagina
window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem("task")) || [];
    createRows(tasks);
    updateTaskCount(tasks);
};

// Evento al enviar el formulario
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const text = document.getElementById("text").value;
    const date = document.getElementById("date").value;
    const hour = document.getElementById("hour").value;

    if (!title || !text || !date || !hour) {
        Swal.fire({
            text: "Por favor, completa todos los campos antes de agregar la tarea.",
            icon: "warning",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
        });
        return;
    }

    if (!todoForm.checkValidity()) {
        event.stopPropagation();
        todoForm.classList.add("was-validated");
    } else {
        const data = new FormData(this);
        addTask(data);
        todoForm.classList.remove("was-validated");
    }
});

// Funcion para crear las filas dinamicas en la tabla
function createRows(data) {
    listTableBody.innerHTML = ""; 
    data.forEach((element, index) => {
        const tr = document.createElement("tr");

        const tdIndex = document.createElement("td");
        tdIndex.textContent = index + 1;

        const tdName = document.createElement("td");
        tdName.textContent = element.title;

        const tdDetail = document.createElement("td");
        tdDetail.textContent = element.text;

        const tdDate = document.createElement("td");
        tdDate.textContent = element.date;

        const tdHour = document.createElement("td");
        tdHour.textContent = element.hour;

        const tdStatus = document.createElement("td");
        const statusLabel = document.createElement("label");
        statusLabel.className =
            element.status === "Completado"
                ? "bg-success text-light p-2 rounded"
                : "bg-warning text-light p-2 rounded";
        statusLabel.textContent = element.status;
        tdStatus.appendChild(statusLabel);

        const tdBtn = document.createElement("td");
        const btnComplete = document.createElement("button");
        btnComplete.className =
            element.status === "Completado" ? "btn btn-success" : "btn btn-warning";
        btnComplete.innerHTML =
            element.status === "Completado"
                ? '<i class="bi bi-check-square"></i>'
                : '<i class="bi bi-exclamation-square text-light"></i>';
        btnComplete.addEventListener("click", function () {
            toggleStatus(index, btnComplete);
        });

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-danger ms-2";
        btnDelete.innerHTML = '<i class="bi bi-trash"></i>';
        btnDelete.addEventListener("click", function () {
            deleteTask(index);
        });

        tdBtn.appendChild(btnComplete);
        tdBtn.appendChild(btnDelete);
    
        tr.appendChild(tdIndex);
        tr.appendChild(tdName);
        tr.appendChild(tdDetail);
        tr.appendChild(tdDate);
        tr.appendChild(tdHour);
        tr.appendChild(tdStatus);
        tr.appendChild(tdBtn);
    
        listTableBody.appendChild(tr);
    });
    updateTaskCount(data);
}

// Funcion para agregar tareas
function addTask(data) {
    Swal.fire({
        text: "¿Quieres guardar esta tarea?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Agregar tarea",
    }).then((result) => {
        if (result.isConfirmed) {
            const task = {
                title: data.get("title"),
                text: data.get("text"),
                date: data.get("date"),
                hour: data.get("hour"),
                status: "Pendiente",
            };

            let localTask = JSON.parse(localStorage.getItem("task")) || [];
            localTask.push(task);
            localStorage.setItem("task", JSON.stringify(localTask));

            createRows(localTask);
            taskModal.hide();
        }
    });
}

// Funcion para actualizar el conteo de tareas
function updateTaskCount(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Completado").length;
    const pendingTasks = totalTasks - completedTasks;

    taskCount.innerHTML = `Total: ${totalTasks} | Completadas: ${completedTasks} | Pendientes: ${pendingTasks}`;
    document.body.appendChild(taskCount);
    taskCount.style.color = "white";
    taskCount.style.textAlign = "center";
    taskCount.style.margin = "20px 0";
}

// Funcion toggle para cambiar el estado de la tarea
function toggleStatus(index, btnComplete) {
    let tasks = JSON.parse(localStorage.getItem("task"));

    if (tasks[index].status === "Pendiente") {
        tasks[index].status = "Completado";
        btnComplete.classList.remove("btn-warning");
        btnComplete.classList.add("btn-success");
        btnComplete.innerHTML = '<i class="bi bi-check-square"></i>';
    } else {
        tasks[index].status = "Pendiente";
        btnComplete.classList.remove("btn-success");
        btnComplete.classList.add("btn-warning");
        btnComplete.innerHTML = '<i class="bi bi-exclamation-square"></i>';
    }

    localStorage.setItem("task", JSON.stringify(tasks));
    createRows(tasks);
}

// Funcion para eliminar una tarea
function deleteTask(index) {
    Swal.fire({
        text: "¿Estás seguro de eliminar esta tarea?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#198754",
        confirmButtonText: "Si, Eliminar tarea",
    }).then((result) => {
        if (result.isConfirmed) {
            let tasks = JSON.parse(localStorage.getItem("task"));
            tasks.splice(index, 1);
            localStorage.setItem("task", JSON.stringify(tasks));
            createRows(tasks);
        }
    });
}