import { ManageProject } from "../events/manageProjects";
import { Project } from "../events/manageProjects";
import { restartProjectList } from "..";
import { generateMainUI } from "./mainUI";

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

        return addBtnContainer;
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
            projectItem.setAttribute('data-title', itemProject.title);

            // Titles
            const projectItemText = document.createElement('p');
            projectItemText.textContent = itemProject.title;

            // Setting
            const settingContainer = document.createElement('div');
            settingContainer.classList.add('side-setting');
            for (let i = 0; i < 3; i++) {
                const dotContainer = document.createElement('div');
                dotContainer.classList.add('side-dot');
                settingContainer.appendChild(dotContainer);
            }

            // Append setting and titles
            projectItem.appendChild(settingContainer);
            projectItem.appendChild(projectItemText);
            projectItemMain.appendChild(projectItem);

            settingContainer.addEventListener('click', this.renderSettingForm);
        });

        projectListContainer.appendChild(projectItemMain);
        this.sideContainer.appendChild(projectListContainer);
    }

    renderSettingForm = (e) => {
        // Outer container
        const settingForm = document.createElement('div');
        settingForm.classList.add('side-setting-container');

        const generateSettingItem = (className, settingText) => {
            const settingItem = document.createElement('p');
            settingItem.classList.add(className);
            settingItem.textContent = settingText;
            settingForm.appendChild(settingItem);

            // Delete event
            if (settingText === 'delete') {
                settingItem.addEventListener('click', (e) => {
                    this.deleteProject(e);
                });
            }

            // Edit event
            if (settingText === 'edit') {
                settingItem.addEventListener('click', (e) => {
                    alert('edit?');
                });
            }
        }

        generateSettingItem('edit-setting', 'edit');
        generateSettingItem('delete-setting', 'delete');

        // Avoid duplications
        const existingContainer = document.querySelector('.side-setting-container');
        const clickTarget = e.currentTarget.closest('.project-list-item');

        if (existingContainer) {
            existingContainer.remove();
        } else {
            clickTarget.appendChild(settingForm);
        }
    }

    deleteProject(e) {
        // Target setting parent container title attribute
        const result = e.currentTarget.closest('.project-list-item').getAttribute('data-title');

        // Match project array title to target title attribute
        const foundItem = ManageProject.projects.find(item => {
            return item.title === result;
        });

        if (foundItem) {
            // Get the position of the object
            const index = ManageProject.projects.indexOf(foundItem);

            // If object exists, remove the targeted object from array
            if (index !== -1) {
                ManageProject.projects.splice(index, 1);
                // reboot project list
                this.restartProjectList();

                // reboot main UI to first project
                generateMainUI.renderContent('div', 'project-main-title', 'h1', ManageProject.projects[0].title);
                generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
                generateMainUI.renderContent('div', 'project-main-description', 'p', ManageProject.projects[0].description);
                generateMainUI.renderTasks(ManageProject.projects[0].taskArray, 'task-box');
            }
        }
    }

    clearSideUI() {
        const container = document.querySelector('.project-list-container');
        if (container) {
            container.remove();
        }
    }

    initialiseForm() {
        const formContainer = document.createElement('form');
        formContainer.classList.add('project-form-container');

        // Form header
        const formHeader = document.createElement('legend');
        formHeader.textContent = 'Add Project';
        formContainer.appendChild(formHeader);

        function generateFormDetails(name, className, elementLabel, labelText, elementInput, inputType) {
            const outerFormItem = document.createElement('div');
            outerFormItem.classList.add(className);

            // Label
            const containerLabel = document.createElement(elementLabel);
            containerLabel.textContent = labelText;
            containerLabel.setAttribute('for', name);
            // Input
            const containerInput = document.createElement(elementInput);
            containerInput.setAttribute('type', inputType);
            containerInput.setAttribute('id', name);
            containerInput.setAttribute('name', name);
            containerInput.setAttribute('required', '');

            outerFormItem.appendChild(containerLabel);
            outerFormItem.appendChild(containerInput);
            formContainer.appendChild(outerFormItem);
        }

        // Prevent duplication
        const existingContainer = document.querySelector('.project-form-container');
        if (existingContainer) {
            existingContainer.remove();
        } else {
            this.outerContainer.appendChild(formContainer);
        }

        generateFormDetails('title', 'form-title', 'label', 'Title: ', 'input', 'text');
        generateFormDetails('description', 'form-description', 'label', 'Description: ', 'input', 'text');
        generateFormDetails('submit', 'form-submit', 'label', '', 'input', 'submit');

        // Form Submit
        formContainer.addEventListener('submit', (this.submitForm));
    }

    submitForm = (e) => {
        e.preventDefault();
        const formContainer = document.querySelector('.project-form-container');
        const getTitle = document.querySelector('#title');
        const getDescription = document.querySelector('#description');
        const project = new Project(getTitle.value, getDescription.value);

        // Clear form after submit
        formContainer.remove();

        // Push project into array
        ManageProject.projects.push(project);

        // // Re-render SideUI
        this.restartProjectList();

        console.log(project);
        console.log(ManageProject.projects);
    }

    restartProjectList() {
        // Sidebar
        this.clearSideUI();
        this.renderProjectList();

        // Main
        generateMainUI.matchProject();
    }
}

export const generateSideUI = new SideUI('.content', 'side-container');