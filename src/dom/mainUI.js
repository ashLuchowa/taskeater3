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

    matchProject() {
        const targetList = document.querySelectorAll('.project-list-item');
        targetList.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetItem = ManageProject.projects.find((itemProject) => {
                    return itemProject.title === e.target.textContent;
                });

                if (targetItem) {
                    this.renderContent('div', 'project-title', targetItem.title);
                    this.renderContent('div', 'project-description', targetItem.description);
                }
            });
        });
    }

    renderContent(elementType, className, target) {
        const contentContainer = document.createElement(elementType);
        contentContainer.classList.add(className);
        contentContainer.textContent = target;

        // Clear content first
        const existingContent = document.querySelector(`.${className}`);
        if (existingContent) {
            existingContent.remove();
        }

        // Append content
        this.mainContainer.appendChild(contentContainer);
    }
}

export const generateMainUI = new MainUI('.content', 'main-container');