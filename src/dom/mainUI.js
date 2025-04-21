import { ManageProject } from "../events/manageProjects";

class MainUI {
    constructor(outerSelector, mainSelector) {
        this.outerContainer = document.querySelector(outerSelector);
        this.mainSelector = mainSelector;
        this.mainContainer = null;
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
}

export const generateMainUI = new MainUI('.content', 'main-container');