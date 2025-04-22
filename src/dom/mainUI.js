import { ManageProject } from "../events/manageProjects";

class MainUI {
    constructor(outerSelector, mainSelector) {
        this.outerContainer = document.querySelector(outerSelector);
        this.mainSelector = mainSelector;
        this.mainContainer = null;
    }

    clearMainUI() {
        const container = document.querySelector(`.${this.mainSelector}`);
        if(container) {
            container.remove();
        }
    }

    renderMainContainer() {
        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add(this.mainSelector);

        this.outerContainer.appendChild(this.mainContainer);
    }

    renderAddBtn(type, selectorName, nameContent) {
        const addBtnContainer = document.createElement('div');
        addBtnContainer.classList.add(selectorName);

        const addBtn = document.createElement(type);
        addBtn.textContent = nameContent;

        // Prevent duplication
        const existingBtn = document.querySelector(`.${selectorName}`);
        if (existingBtn) {
            existingBtn.remove();
        }

        addBtnContainer.appendChild(addBtn);
        this.mainContainer.appendChild(addBtnContainer);
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
                    this.renderAddBtn('button', 'project-main-button', 'Add Task');
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
}

export const generateMainUI = new MainUI('.content', 'main-container');