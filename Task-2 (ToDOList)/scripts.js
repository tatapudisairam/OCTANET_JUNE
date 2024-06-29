document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority');
    const categorySelect = document.getElementById('category');
    const otherCategoryInput = document.getElementById('other-category');
    const todoList = document.getElementById('todo-list');
    const taskFilterCategory = document.getElementById('task-filter-category');
    const taskFilterPriority = document.getElementById('task-filter-priority');
    const taskSearchInput = document.getElementById('task-search');

    const inputFields = form.querySelectorAll('input, select, textarea');
    inputFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.classList.add('highlight');
        });

        field.addEventListener('blur', () => {
            field.classList.remove('highlight');
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let category = categorySelect.value;
        if (category === 'other') {
            category = otherCategoryInput.value.trim();
            if (!categoryExistsInFilter(category)) {
                addNewCategoryToFilter(category);
            }
        }
        addTask(input.value, dueDateInput.value, prioritySelect.value, category);
        input.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'low';
        categorySelect.value = ''; 
        otherCategoryInput.value = '';
        otherCategoryInput.style.display = 'none'; 
        filterTasks(taskFilterCategory.value, taskFilterPriority.value); 
        performTaskSearch(taskSearchInput.value.toLowerCase()); 
    });

    categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'other') {
            otherCategoryInput.style.display = 'inline-block'; 
        } else {
            otherCategoryInput.style.display = 'none'; 
        }
        filterTasks(taskFilterCategory.value, taskFilterPriority.value);
        performTaskSearch(taskSearchInput.value.toLowerCase());
    });

    taskFilterCategory.addEventListener('change', () => {
        filterTasks(taskFilterCategory.value, taskFilterPriority.value);
        performTaskSearch(taskSearchInput.value.toLowerCase());
    });

    taskFilterPriority.addEventListener('change', () => {
        filterTasks(taskFilterCategory.value, taskFilterPriority.value);
        performTaskSearch(taskSearchInput.value.toLowerCase());
    });

    taskSearchInput.addEventListener('input', () => {
        performTaskSearch(taskSearchInput.value.toLowerCase());
    });

    function addTask(task, dueDate, priority, category) {
        if (task.trim() === '') return;

        const li = document.createElement('li');
        li.classList.add(priority, category);

        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');
        taskInfo.innerHTML = `<strong>${task}</strong> - ${dueDate}`;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-btn');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            taskInfo.classList.toggle('completed');
            completeButton.textContent = taskInfo.classList.contains('completed') ? 'Incomplete' : 'Complete';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.remove();
        });

        buttonsDiv.appendChild(completeButton);
        buttonsDiv.appendChild(deleteButton);
        li.appendChild(taskInfo);
        li.appendChild(buttonsDiv);
        todoList.appendChild(li);
    }

    function filterTasks(category, priority) {
        const tasks = todoList.getElementsByTagName('li');
        Array.from(tasks).forEach(task => {
            const taskCategory = task.classList[1]; 
            const taskPriority = task.classList[0]; 
            let showTask = true;

            if (category !== 'all' && taskCategory !== category) {
                showTask = false;
            }

            if (priority !== 'all' && taskPriority !== priority) {
                showTask = false;
            }

            if (showTask) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function performTaskSearch(searchTerm) {
        const tasks = todoList.getElementsByTagName('li');
        Array.from(tasks).forEach(task => {
            const taskInfo = task.querySelector('.task-info');
            const taskName = taskInfo.querySelector('strong').textContent.toLowerCase();
            const taskCategory = task.classList[1];
            const taskPriority = task.classList[0];
            let showTask = true;

            if (!taskName.includes(searchTerm)) {
                showTask = false;
            }

            if (taskCategory !== taskFilterCategory.value && taskFilterCategory.value !== 'all') {
                showTask = false;
            }
            if (taskPriority !== taskFilterPriority.value && taskFilterPriority.value !== 'all') {
                showTask = false;
            }

            if (showTask) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function categoryExistsInFilter(newCategory) {
        const existingOptions = Array.from(taskFilterCategory.options).map(option => option.value.toLowerCase());
        return existingOptions.includes(newCategory.toLowerCase());
    }

    function addNewCategoryToFilter(newCategory) {
        const option = document.createElement('option');
        option.value = newCategory.toLowerCase(); 
        option.textContent = newCategory;
        taskFilterCategory.appendChild(option);
        const categoryOption = document.createElement('option');
        categoryOption.value = newCategory.toLowerCase(); 
        categoryOption.textContent = newCategory;
        categorySelect.appendChild(categoryOption);
    }
});

const s = ScrollReveal({
    distance: '30px',
    duration: 1800,
    reset: true,
});

s.reveal(`.left-panel`, {
origin: 'left'
})

s.reveal(`.right-panel`, {
origin: 'right'
})
