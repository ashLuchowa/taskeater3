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
        this.mainContainer.textContent = 'test';

        this.outerContainer.appendChild(this.mainContainer);
    }

    matchProject() {
        const targetList = document.querySelectorAll('.project-list-item');
        targetList.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetItem = ManageProject.projects.find((itemProject) => {
                    return itemProject.title === e.target.textContent;
                });

                if(targetItem) {
                    console.log(targetItem);
                }
            });
        });
    }
}

export const generateMainUI = new MainUI('.content', 'main-container');