import { ManageProject } from "../events/manageProjects";
import { ManageTask, Task } from "../events/manageTasks";

class MainUI {
    constructor(outerSelector, mainSelector) {
        this.outerContainer = document.querySelector(outerSelector);
        this.mainSelector = mainSelector;
        this.mainContainer = null;
    }

    clearMainUI() {
        const container = document.querySelector(`.${this.mainSelector}`);
        if (container) {
            container.remove();
        }
    }

    renderMainContainer() {
        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add(this.mainSelector);

        this.outerContainer.appendChild(this.mainContainer);
    }

    renderAddBtn(type, selectorName, className, nameContent) {
        const addBtnContainer = document.createElement('div');
        addBtnContainer.classList.add(selectorName);

        const addBtn = document.createElement(type);
        addBtn.classList.add(className);
        addBtn.textContent = nameContent;

        // Prevent duplication
        const existingBtn = document.querySelector(`.${selectorName}`);
        if (existingBtn) {
            existingBtn.remove();
        }

        addBtnContainer.appendChild(addBtn);
        this.mainContainer.appendChild(addBtnContainer);

        // Form
        addBtn.addEventListener('click', (e) => addTaskForm.appendBody(e));
    }

    matchProject() {
        const targetList = document.querySelectorAll('.project-list-item');
        targetList.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetItem = ManageProject.projects.find((itemProject) => {
                    return itemProject.title === e.target.textContent;
                });

                if (targetItem) {
                    this.renderContent('div', 'project-main-title', 'h1', targetItem.title);
                    this.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
                    this.renderContent('div', 'project-main-description', 'p', targetItem.description);
                    this.renderTasks(targetItem.taskArray, 'task-box');
                }
            });
        });
    }

    renderContent(elementType, className, innerElementType, target) {
        const contentContainer = document.createElement(elementType);
        contentContainer.classList.add(className);

        const contentText = document.createElement(innerElementType);
        contentText.textContent = target;

        // Clear content first
        const existingContent = document.querySelector(`.${className}`);
        if (existingContent) {
            existingContent.remove();
        }

        // Append contents
        contentContainer.appendChild(contentText);
        this.mainContainer.appendChild(contentContainer);
    }

    renderTasks(target, containerName) {
        const container = document.createElement('div');
        container.classList.add(containerName);

        target.forEach(item => {
            const outerTaskContainer = document.createElement('div');
            outerTaskContainer.classList.add('outer-task-container');
            outerTaskContainer.setAttribute('data-attribute', item.title);

            // Setting Btn
            const settingContainer = document.createElement('div');
            settingContainer.classList.add('main-setting');
            for (let i = 0; i < 3; i++) {
                const dotContainer = document.createElement('div');
                dotContainer.classList.add('side-dot');
                settingContainer.appendChild(dotContainer);
            }
            outerTaskContainer.appendChild(settingContainer);

            // // Setting Menu
            settingContainer.addEventListener('click', this.renderSettingForm);

            function generateTaskInfo(containerName, type, content, textType) {
                const innerContainer = document.createElement('div');
                innerContainer.classList.add(containerName);

                const taskText = document.createElement(type);
                taskText.textContent = `${textType} ${content}`;

                container.appendChild(outerTaskContainer);
                outerTaskContainer.appendChild(innerContainer);
                innerContainer.appendChild(taskText);
            }

            generateTaskInfo('task-title', 'p', item.title, '');
            generateTaskInfo('task-description', 'p', item.description, '');
            generateTaskInfo('task-date', 'p', item.dueDate, 'Due Date: ');
            generateTaskInfo('task-priority', 'p', item.priority, 'Priority: ');
        });

        // Prevent Duplication
        const existingContainer = document.querySelector('.task-box');
        if (existingContainer) {
            existingContainer.remove();
        }

        this.mainContainer.appendChild(container);
    }

    renderSettingForm = (e) => {
        // Avoid duplications
        const clickTarget = e.currentTarget.closest('.outer-task-container');
        const existingContainer = clickTarget.querySelector('.main-setting-container');

        if (existingContainer) {
            existingContainer.remove();
        } else {
            const settingForm = document.createElement('div');
            settingForm.classList.add('main-setting-container');

            const generateSettingItem = (className, settingText) => {
                const settingItem = document.createElement('p');
                settingItem.classList.add(className);
                settingItem.textContent = settingText;
                settingForm.appendChild(settingItem);

                // Delete event
                if (settingText === 'delete') {
                    settingItem.addEventListener('click', (e) => {
                        this.deleteTask(e);
                    });
                }

                // Edit event
                if (settingText === 'edit') {
                    settingItem.addEventListener('click', (e) => {
                        editTaskForm.appendBody(e);
                    });
                }
            }

            generateSettingItem('edit-setting', 'edit');
            generateSettingItem('delete-setting', 'delete');

            clickTarget.appendChild(settingForm);
        }
    }

    deleteTask(e) {
        // Match clicked setting and return data-attribute value
        const target = e.currentTarget.closest('.outer-task-container').getAttribute('data-attribute');

        const foundItem = ManageTask.tasks.find(itemTask => {
            return itemTask.title === target;
        });

        if (foundItem) {
            // Assign index
            const index = ManageTask.tasks.indexOf(foundItem);

            // If Object exists
            if (index !== -1) {
                // Remove
                ManageTask.tasks.splice(index, 1);

                // Target matched tasks with parent projects
                const foundProject = ManageProject.projects.find((itemProject) => {
                    return itemProject.title === foundItem.projectParent;
                });

                if (foundProject) {
                    // Clear Task Array and match back tasks
                    foundProject.taskArray = [];
                    ManageTask.matchContent(ManageTask.tasks);
                    generateMainUI.renderTasks(foundProject.taskArray, 'task-box');
                }
            }
        }
    }

    rebootMainContent() {
        const target = document.querySelector('.project-main-title h1');

        const contents = document.querySelectorAll('.main-container div');
        // Clear content
        contents.forEach((item => {
            item.remove();
        }));

        const foundItem = ManageProject.projects.find((itemProject) => {
            return itemProject.title === target.textContent;
        });

        if (foundItem) {
            generateMainUI.renderContent('div', 'project-main-title', 'h1', foundItem.title);
            generateMainUI.renderAddBtn('button', 'task-main-button', 'add-btn', 'Add Task');
            generateMainUI.renderContent('div', 'project-main-description', 'p', foundItem.description);
            generateMainUI.renderTasks(foundItem.taskArray, 'task-box');
        }
    }
}

class TaskForm {
    constructor(formName, legendName, mainContainerName, mainTarget) {
        this.formName = formName;
        this.legendName = legendName;
        this.mainContainerName = mainContainerName;
        this.mainTarget = mainTarget;

        this.taskFormContainer = this.mainForm();
        this.headerContainer();
        this.generateFormDetails();
    }

    mainForm() {
        const taskFormContainer = document.createElement('form');
        taskFormContainer.classList.add(this.formName); //task-form-container
        return taskFormContainer;
    }

    headerContainer() {
        const taskFormHeader = document.createElement('legend');
        taskFormHeader.textContent = this.legendName; //Add/Edit Task
        this.taskFormContainer.appendChild(taskFormHeader);
    }

    formDetails(name, className, elementLabel, labelText, elementInput, inputType) {
        const outerFormItem = document.createElement('div');
        outerFormItem.classList.add(className);

        // Label
        const containerLabel = document.createElement(elementLabel);
        containerLabel.textContent = labelText;
        containerLabel.setAttribute('for', name);
        // General Input
        const containerInput = document.createElement(elementInput);
        containerInput.setAttribute('type', inputType);
        containerInput.setAttribute('id', name);
        containerInput.setAttribute('name', name);
        containerInput.required = true;

        outerFormItem.appendChild(containerLabel);
        outerFormItem.appendChild(containerInput);
        return outerFormItem;
    }

    optionDetails(option, label) {
        // Make sure projects are pushed 
        ManageProject.pushNewProjects();

        const mainContainer = document.createElement('div');
        const containerLabel = document.createElement('label');

        containerLabel.setAttribute('for', option);
        containerLabel.textContent = label;
        const selectContainer = document.createElement('select');
        selectContainer.setAttribute('id', option);
        selectContainer.setAttribute('name', option);

        if (option === 'priority') {
            const options = ['Medium', 'High', 'Low'];
            options.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item;
                selectContainer.appendChild(option);
            });
        } else if (option === 'status') {
            const options = ['To Do', 'In Progress', 'Done'];
            options.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item;
                selectContainer.appendChild(option);
            });
        } else if (option === 'projectParent') {
            const options = ManageProject.projects;
            options.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item.title;
                selectContainer.appendChild(option);
            });
        }

        mainContainer.appendChild(containerLabel);
        mainContainer.appendChild(selectContainer);
        return mainContainer;
    }

    generateFormDetails() {
        const title = this.formDetails('title', 'form-title', 'label', 'Title: ', 'input', 'text');
        const description = this.formDetails('description', 'form-description', 'label', 'Description: ', 'input', 'text');
        const date = this.formDetails('date', 'form-date', 'label', 'Due Date: ', 'input', 'date');
        const priority = this.optionDetails('priority', 'Priority: ');
        const status = this.optionDetails('status', 'Status: ');
        const projectParent = this.optionDetails('projectParent', 'Category: ');
        const submit = this.formDetails('submit', 'form-submit', 'label', '', 'input', 'submit');


        this.taskFormContainer.appendChild(title);
        this.taskFormContainer.appendChild(description);
        this.taskFormContainer.appendChild(date);
        this.taskFormContainer.appendChild(priority);
        this.taskFormContainer.appendChild(status);
        this.taskFormContainer.appendChild(projectParent);
        this.taskFormContainer.appendChild(submit);
    }

    appendBody(e) {
        const targetContainer = e.target.closest(this.mainTarget);
        const existingContainer = document.querySelector(`.${this.formName}`);
        this.targetValue = targetContainer.getAttribute('data-attribute');

        if (existingContainer) {
            existingContainer.remove();
        } else {
            targetContainer.appendChild(this.taskFormContainer);
        }
    }
}

class SubmitTaskEvent {
    constructor(mainForm) {
        this.mainForm = mainForm;
    }

    addTask() {
        this.mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formContainer = document.querySelector(`.${addTaskForm.formName}`);
            const getTitle = document.querySelector('#title');
            const getDescription = document.querySelector('#description');
            const getDate = document.querySelector('#date');
            const getPriority = document.querySelector('#priority');
            const getStatus = document.querySelector('#status');
            const getProjectParent = document.querySelector('#projectParent');
            const task = new Task(getTitle.value, getDescription.value, getDate.value, getPriority.value, getStatus.value, getProjectParent.value);

            // Clear form after submit
            formContainer.remove();

            // Push project into array
            ManageTask.tasks.push(task);
            ManageTask.matchContent(ManageTask.tasks);

            // // Re-render MainUI
            generateMainUI.rebootMainContent(getProjectParent);
        });
    }

    editTask() {
        this.mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formContainer = document.querySelector('.edit-task-container');
            const getTitle = document.querySelector('#title');
            const getDescription = document.querySelector('#description');
            const getDate = document.querySelector('#date');
            const getPriority = document.querySelector('#priority');
            const getStatus = document.querySelector('#status');
            // const getProjectParent = document.querySelector('#projectParent');

            // Clear form after submit
            formContainer.remove();

            const foundItem = ManageTask.tasks.find(item => item.title === editTaskForm.targetValue);

            if (foundItem) {
                foundItem.title = getTitle.value;
                foundItem.description = getDescription.value;
                foundItem.date = getDate.value;
                foundItem.priority = getPriority.value;
                foundItem.status = getStatus.value;
                // foundItem.projectParent = getProjectParent.value;
            }

            // Re-render MainUI
            const contents = document.querySelectorAll('.main-container div');
            // Clear content first
            contents.forEach((item => {
                item.remove();
            }));

            const foundItem2 = ManageProject.projects.find((itemProject) => {
                return itemProject.title === foundItem.projectParent;
            });

            if (foundItem2) {
                generateMainUI.renderContent('div', 'project-main-title', 'h1', foundItem2.title);
                generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
                generateMainUI.renderContent('div', 'project-main-description', 'p', foundItem2.description);
                generateMainUI.renderTasks(foundItem2.taskArray, 'task-box');
            }
        });
    }
}

export const generateMainUI = new MainUI('.content', 'main-container');

// Add Task
export const addTaskForm = new TaskForm('task-form-container', 'Add Task', 'content', '.main-container');
export const submitAddTask = new SubmitTaskEvent(addTaskForm.taskFormContainer);
submitAddTask.addTask();

// Edit Task
export const editTaskForm = new TaskForm('edit-task-container', 'Edit Task', 'content', '.outer-task-container');
export const submitEditTask = new SubmitTaskEvent(editTaskForm.taskFormContainer);
submitEditTask.editTask();