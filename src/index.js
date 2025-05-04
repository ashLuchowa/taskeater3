import "./styles.css";
import { ManageProject } from "./events/manageProjects";
import { ManageTask } from "./events/manageTasks";
import { generateSideUI } from "./dom/sideUI";
import { generateMainUI } from "./dom/mainUI";
import { addProjectForm } from "./dom/sideUI";


function initialiseApp() {
    // Push default projects and tasks into related arrays
    ManageProject.pushDefaultProjects();
    ManageTask.pushDefaultTask();
    ManageProject.pushNewProjects();
    ManageTask.matchContent(ManageTask.defaultTasks);

    // Init Sidebar
    generateSideUI.renderSideContainer();
    generateSideUI.renderLogo('logo-container', 'TASKEATER', '#');
    const addProjectButton = generateSideUI.renderAddBtn('button', 'add-project-btn', 'Add Project');
    addProjectButton.addEventListener('click', (e) => addProjectForm.appendBody(e));
    generateSideUI.renderProjectList();

    // Init Main Content
    generateMainUI.renderMainContainer();
    generateMainUI.matchProject();

    // Render Initial Project
    generateMainUI.renderContent('div', 'project-main-title', 'h1', ManageProject.projects[0].title);
    generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
    generateMainUI.renderContent('div', 'project-main-description', 'p', ManageProject.projects[0].description);
    generateMainUI.renderTasks(ManageProject.projects[0].taskArray, 'task-box');

    const containerTitle = document.querySelector('.project-main-title');
    const buttonContainer = document.querySelector('.add-btn');
    containerTitle.appendChild(buttonContainer);
}

initialiseApp();