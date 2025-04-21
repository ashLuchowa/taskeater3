import { ManageProject } from "../events/manageProjects";

class SideUI {
    constructor(outerSelector, sideSelector) {
        this.outerContainer = document.querySelector(outerSelector);
        this.sideSelector = sideSelector;
        this.sideContainer = null;
    }

    renderSideContainer() {
        this.sideContainer = document.createElement('div');
        this.sideContainer.classList.add(this.sideSelector);

        this.outerContainer.appendChild(this.sideContainer);
    }

    renderLogo(projectTitle) {
        const logoContainer = document.createElement('div');
        logoContainer.classList.add('logo-container');

        const logoText = document.createElement('a');
        logoText.textContent = projectTitle;

        logoContainer.appendChild(logoText);

        this.sideContainer.appendChild(logoContainer);
    }

    renderAddBtn(type, selectorName, nameContent) {
        const addBtnContainer = document.createElement(type);
        addBtnContainer.classList.add(selectorName);
        addBtnContainer.textContent = nameContent;

        this.sideContainer.appendChild(addBtnContainer);
    }

    renderProjectList() {
        // prevent duplication
        const existingContainer = document.querySelector('.project-list-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        const projectListContainer = document.createElement('div');
        projectListContainer.classList.add('project-list-container');
        const projectItemMain = document.createElement('ul');

        ManageProject.projects.forEach(itemProject => {
            const projectItem = document.createElement('li');
            projectItem.classList.add('project-list-item');
            projectItem.textContent = itemProject.title;

            projectItemMain.appendChild(projectItem);
        });

        projectListContainer.appendChild(projectItemMain);
        this.sideContainer.appendChild(projectListContainer);
    }
}

export const generateSideUI = new SideUI('.content', 'side-container');