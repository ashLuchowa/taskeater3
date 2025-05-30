import { ManageProject } from "../events/manageProjects";
import { Project } from "../events/manageProjects";
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

    renderLogo(containerName, projectTitle, link) {
        const logoContainer = document.createElement('div');
        logoContainer.classList.add(containerName);

        const logoText = document.createElement('a');
        logoText.setAttribute('href', link);
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
                    editProjectForm.appendBody(e);
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

    restartProjectList() {
        // Sidebar
        this.clearSideUI();
        this.renderProjectList();

        // Main
        generateMainUI.matchProject();
    }
}

class Form {
    constructor(mainType, formName, formTitle, mainTarget) {
        this.mainType = mainType;
        this.formName = formName;
        this.formTitle = formTitle;
        this.mainTarget = mainTarget;

        this.formContainer = this.createFormContainer();

        this.generateFormLegend();
        this.generateFormDetails();
        // this.submitForm();
    }

    createFormContainer() {
        const formContainer = document.createElement(this.mainType);
        formContainer.classList.add(this.formName);
        return formContainer;
    }

    generateFormLegend() {
        const formHeader = document.createElement('legend');
        formHeader.textContent = this.formTitle;
        this.formContainer.appendChild(formHeader);
    }

    formDetails(name, className, elementLabel, labelText, elementInput, inputType) {
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
        containerInput.required = true;

        outerFormItem.appendChild(containerLabel);
        outerFormItem.appendChild(containerInput);
        return outerFormItem;
    }

    generateFormDetails() {
        const title = this.formDetails('title', 'form-title', 'label', 'Title: ', 'input', 'text');
        const description = this.formDetails('description', 'form-description', 'label', 'Description: ', 'input', 'text');
        const submit = this.formDetails('submit', 'form-submit', 'label', '', 'input', 'submit');

        this.formContainer.appendChild(title);
        this.formContainer.appendChild(description);
        this.formContainer.appendChild(submit);
    }

    appendBody(e) {
        const targetContainer = e.target.closest(this.mainTarget);
        const existingContainer = document.querySelector(`.${this.formName}`);

        if (existingContainer) {
            existingContainer.remove();
        } else {
            targetContainer.appendChild(this.formContainer);
        }
    }
}

class SubmitEvent {
    constructor(mainForm) {
        this.mainForm = mainForm;
    }

    addProject() {
        this.mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formContainer = document.querySelector(`.${addProjectForm.formName}`);
            const getTitle = document.querySelector('#title');
            const getDescription = document.querySelector('#description');
            const project = new Project(getTitle.value, getDescription.value);

            // Clear form after submit
            formContainer.remove();

            // Push project into array
            ManageProject.projects.push(project);
            
            // local Storage
            let project_serialized = JSON.stringify(ManageProject.projects);

            localStorage.setItem('projects', project_serialized);

            const stored = localStorage.getItem('projects');
            // let project_deserialized = JSON.parse(stored);

            if(stored) {
                ManageProject.projects = JSON.parse(stored);
            }

            // Re-render SideUI
            generateSideUI.restartProjectList();
        });
    }

    editProject() {
        this.mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Target setting parent container title attribute
            const result = e.currentTarget.closest(editProjectForm.mainTarget).getAttribute('data-title');

            // Match project array title to target title attribute
            const foundItem = ManageProject.projects.find(item => {
                return item.title === result;
            });

            if (foundItem) {
                const formContainer = document.querySelector('.edit-form-container');
                const getProjectTitle = document.querySelector('#title');
                const getProjectDescription = document.querySelector('#description');

                // Clear form after submit
                formContainer.remove();

                foundItem.title = getProjectTitle.value;
                foundItem.description = getProjectDescription.value;

                // Re-render SideUI
                generateSideUI.restartProjectList();

                // Reboot Main UI
                const contents = document.querySelectorAll('.main-container div');
                // Clear content first
                contents.forEach((item => {
                    item.remove();
                }));
                generateMainUI.renderContent('div', 'project-main-title', 'h1', foundItem.title);
                generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
                generateMainUI.renderContent('div', 'project-main-description', 'p', foundItem.description);
                generateMainUI.renderTasks(foundItem.taskArray, 'task-box');
            }
        });
    }
}

export const generateSideUI = new SideUI('.content', 'side-container');

// Add Project
export const addProjectForm = new Form('form', 'add-form-container', 'New Project', '.side-container');
export const submitAddProject = new SubmitEvent(addProjectForm.formContainer);
submitAddProject.addProject();

// Edit Project
const editProjectForm = new Form('form', 'edit-form-container', 'Edit Project', '.project-list-item');
const submitEditProject = new SubmitEvent(editProjectForm.formContainer);
submitEditProject.editProject();
