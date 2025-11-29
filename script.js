// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentDate = new Date();

// DOM Elements
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const listViewBtn = document.getElementById('listViewBtn');
const calendarViewBtn = document.getElementById('calendarViewBtn');
const listView = document.getElementById('listView');
const calendarView = document.getElementById('calendarView');

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
listViewBtn.addEventListener('click', () => toggleView('list'));
calendarViewBtn.addEventListener('click', () => toggleView('calendar'));
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Initial Render
renderTasks();
renderCalendar();

// Core Functions
function addTask() {
    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!text) {
        alert('할 일을 입력해주세요!');
        return;
    }
    if (!date) {
        alert('날짜를 선택해주세요!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        date
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    renderCalendar();
    
    taskInput.value = '';
    dateInput.value = '';
}

function deleteTask(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        renderCalendar();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('수정할 내용을 입력하세요:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
        renderCalendar();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleView(view) {
    if (view === 'list') {
        listView.classList.add('active');
        calendarView.classList.remove('active');
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
    } else {
        listView.classList.remove('active');
        calendarView.classList.add('active');
        listViewBtn.classList.remove('active');
        calendarViewBtn.classList.add('active');
        renderCalendar(); // Re-render to ensure correct size
    }
}

// List View Rendering
function renderTasks() {
    taskList.innerHTML = '';
    
    // Sort tasks by date
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">✎</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;
        taskList.appendChild(item);
    });
}

// Calendar View Rendering
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthYear.textContent = `${year}년 ${month + 1}월`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if it's today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }
        
        cell.innerHTML = `<div class="calendar-date">${day}</div>`;
        
        // Add tasks for this day
        const dayTasks = tasks.filter(task => task.date === dateStr);
        dayTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'calendar-task';
            taskEl.textContent = task.text;
            taskEl.title = task.text; // Tooltip
            cell.appendChild(taskEl);
        });
        
        calendarGrid.appendChild(cell);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}
