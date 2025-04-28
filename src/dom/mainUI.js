import { restartMainContent } from "..";
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
        addBtn.addEventListener('click', this.renderForm);
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

    renderForm = () => {
        const taskFormContainer = document.createElement('form');
        taskFormContainer.classList.add('project-form-container');

        // Form header
        const taskFormHeader = document.createElement('legend');
        taskFormHeader.textContent = 'Add Task';
        taskFormContainer.appendChild(taskFormHeader);

        function generateSelect(option, label) {
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
            taskFormContainer.appendChild(mainContainer);
        }

        function generateFormDetails(name, className, elementLabel, labelText, elementInput, inputType) {
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
            containerInput.setAttribute('required', '');

            outerFormItem.appendChild(containerLabel);
            outerFormItem.appendChild(containerInput);
            taskFormContainer.appendChild(outerFormItem);
        }

        // Prevent duplication
        const existingContainer = document.querySelector('.project-form-container');

        if (existingContainer) {
            existingContainer.remove();
        } else {
            this.outerContainer.appendChild(taskFormContainer);
        }

        // General Label/Input
        generateFormDetails('title', 'form-title', 'label', 'Title: ', 'input', 'text');
        generateFormDetails('description', 'form-description', 'label', 'Description: ', 'input', 'text');
        generateFormDetails('date', 'form-date', 'label', 'Due Date: ', 'input', 'date');

        // Priority Label/Input
        generateSelect('priority', 'Priority: ');
        generateSelect('status', 'Status: ');
        generateSelect('projectParent', 'Project: ');

        generateFormDetails('submit', 'form-submit', 'label', '', 'input', 'submit');

        // Form Submit
        taskFormContainer.addEventListener('submit', this.addSubmitForm);
    }

    addSubmitForm = (e, getProjectParent) => {
        e.preventDefault();

        const formContainer = document.querySelector('.project-form-container');
        const getTitle = document.querySelector('#title');
        const getDescription = document.querySelector('#description');
        const getDate = document.querySelector('#date');
        const getPriority = document.querySelector('#priority');
        const getStatus = document.querySelector('#status');
        getProjectParent = document.querySelector('#projectParent');
        const task = new Task(getTitle.value, getDescription.value, getDate.value, getPriority.value, getStatus.value, getProjectParent.value);

        // Clear form after submit
        formContainer.remove();

        // Push project into array
        ManageTask.tasks.push(task);
        ManageTask.matchContent(ManageTask.tasks);

        // Re-render MainUI
        this.rebootMainContent(getProjectParent);

        console.log(task);
        console.log(ManageTask.tasks);
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
                        this.renderTaskForm(e);
                    });
                }
            }

            generateSettingItem('edit-setting', 'edit');
            generateSettingItem('delete-setting', 'delete');

            clickTarget.appendChild(settingForm);
        }
    }

    renderTaskForm(e) {
        const taskFormContainer = document.createElement('form');
        taskFormContainer.classList.add('task-form-container');

        // Form header
        const taskFormHeader = document.createElement('legend');
        taskFormHeader.textContent = 'Edit Task';
        taskFormContainer.appendChild(taskFormHeader);

        function generateSelect(option, label) {
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
            taskFormContainer.appendChild(mainContainer);
        }

        function generateFormDetails(name, className, elementLabel, labelText, elementInput, inputType) {
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
            containerInput.setAttribute('required', '');

            outerFormItem.appendChild(containerLabel);
            outerFormItem.appendChild(containerInput);
            taskFormContainer.appendChild(outerFormItem);
        }

        // Prevent duplication
        const existingContainer = document.querySelector('.task-form-container');
        const clickTarget = e.target.closest('.outer-task-container');
        this.editValue = clickTarget.getAttribute('data-attribute');

        if (existingContainer) {
            existingContainer.remove();
        } else {
            clickTarget.appendChild(taskFormContainer);
        }

        // General Label/Input
        generateFormDetails('title', 'form-title', 'label', 'Title: ', 'input', 'text');
        generateFormDetails('description', 'form-description', 'label', 'Description: ', 'input', 'text');
        generateFormDetails('date', 'form-date', 'label', 'Due Date: ', 'input', 'date');

        // Priority Label/Input
        generateSelect('priority', 'Priority: ');
        generateSelect('status', 'Status: ');
        // generateSelect('projectParent', 'Project: ');

        generateFormDetails('submit', 'form-submit', 'label', '', 'input', 'submit');

        // Form Submit
        taskFormContainer.addEventListener('submit', this.addSubmitForm2);
    }

    addSubmitForm2 = (e) => {
        e.preventDefault();

        const formContainer = document.querySelector('.task-form-container');
        const getTitle = document.querySelector('#title');
        const getDescription = document.querySelector('#description');
        const getDate = document.querySelector('#date');
        const getPriority = document.querySelector('#priority');
        const getStatus = document.querySelector('#status');
        // getProjectParent = document.querySelector('#projectParent');

        // Clear form after submit
        formContainer.remove();

        // Target object to edit
        const foundItem = ManageTask.tasks.find(item => item.title === this.editValue);
        
        if(foundItem) {
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

        if(foundItem2) {
            generateMainUI.renderContent('div', 'project-main-title', 'h1', foundItem2.title);
            generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
            generateMainUI.renderContent('div', 'project-main-description', 'p', foundItem2.description);
            generateMainUI.renderTasks(foundItem2.taskArray, 'task-box');
        }

        console.log(foundItem.projectParent);
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

                if(foundProject) {
                    // Clear Task Array and match back tasks
                    foundProject.taskArray = [];
                    ManageTask.matchContent(ManageTask.tasks);
                    generateMainUI.renderTasks(foundProject.taskArray, 'task-box');
                }
            }
        }
    }

    rebootMainContent(projectParent) {
        const contents = document.querySelectorAll('.main-container div');
        // Clear content first
        contents.forEach((item => {
            item.remove();
        }));

        const foundItem = ManageProject.projects.find((itemProject) => {
            return itemProject.title === projectParent.value;
        });

        if (foundItem) {
            generateMainUI.renderContent('div', 'project-main-title', 'h1', foundItem.title);
            generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
            generateMainUI.renderContent('div', 'project-main-description', 'p', foundItem.description);
            generateMainUI.renderTasks(foundItem.taskArray, 'task-box');
        }
    }
}

export const generateMainUI = new MainUI('.content', 'main-container');