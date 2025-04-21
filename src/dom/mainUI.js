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
                    this.renderContent(targetItem.title);
                }
            });
        });
    }

    renderContent(target) {
        const mainContentContainer = document.createElement('div');
        mainContentContainer.classList.add('main-content');
        mainContentContainer.textContent = target;

        const existingContent = document.querySelector('.main-content');

        // Clear content first
        if (existingContent) {
            existingContent.remove();
        }

        // Append content
        this.mainContainer.appendChild(mainContentContainer);
    }
}

export const generateMainUI = new MainUI('.content', 'main-container');