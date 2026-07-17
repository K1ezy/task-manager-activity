
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function saveTasks() {
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



function renderTasks() {
    const listContainer = document.getElementById('taskList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterSelect').value;

   
    listContainer.innerHTML = '';

    
    const filteredTasks = tasks.filter(task => {
        
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        
        
        const matchesFilter = (filterStatus === 'All') || (task.status === filterStatus);
        
        
        return matchesSearch && matchesFilter;
    });

    
    filteredTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        
        
        taskDiv.innerHTML = `
            <p>
                <strong>${task.title}</strong> - Status: <em>${task.status}</em>
                <br>
                <button onclick="toggleStatus(${task.id})">Mark as ${task.status === 'Pending' ? 'Completed' : 'Pending'}</button>
                <button onclick="openEditModal(${task.id})">Edit Title</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </p>
        `;
        
        listContainer.appendChild(taskDiv);
    });
}




document.getElementById('addBtn').addEventListener('click', () => {
    const titleInput = document.getElementById('taskInput');
    
    
    if (titleInput.value.trim() === '') {
        alert('Please enter a task title!');
        return;
    }

    
    const newTask = {
        id: Date.now(), 
        title: titleInput.value,
        status: 'Pending' 
    };

    tasks.push(newTask);
    saveTasks();   
    renderTasks(); 
    
    titleInput.value = ''; 
});


document.getElementById('taskInput').addEventListener('keypress',function(event){
    if (event.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});


function deleteTask(id) {
    
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();
    renderTasks();
}


function editTask(id) {
    
    const taskToEdit = tasks.find(task => task.id === id);
    
    
    const newTitle = prompt('Edit task title:', taskToEdit.title);
    
    if (newTitle !== null && newTitle.trim() !== '') {
        taskToEdit.title = newTitle;
        saveTasks();
        renderTasks();
    }
}


function toggleStatus(id) {
    const taskToToggle = tasks.find(task => task.id === id);
    
    
    if (taskToToggle.status === 'Pending') {
        taskToToggle.status = 'Completed';
    } else {
        taskToToggle.status = 'Pending';
    }
    
    saveTasks();
    renderTasks();
}

let currentEditId = null; 
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');

// Open the custom modal instead of the browser prompt
function openEditModal(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    currentEditId = id; 
    
    editTaskInput.value = taskToEdit.title; 
    editModal.style.display = 'flex'; 
    editTaskInput.focus(); 
}

// The "Save" button inside the modal
document.getElementById('saveEditBtn').addEventListener('click', () => {
    const newTitle = editTaskInput.value;
    
    if (newTitle.trim() !== '') {
        const taskToEdit = tasks.find(task => task.id === currentEditId);
        taskToEdit.title = newTitle;
        
        saveTasks();
        renderTasks();
        editModal.style.display = 'none'; 
    }
});

// The "Cancel" button inside the modal
document.getElementById('cancelEditBtn').addEventListener('click', () => {
    editModal.style.display = 'none'; 
});


document.getElementById('searchInput').addEventListener('input', renderTasks);


document.getElementById('filterSelect').addEventListener('change', renderTasks);


renderTasks();