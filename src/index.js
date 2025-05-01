import "./styles.css";
import { ManageProject } from "./events/manageProjects";
import { ManageTask } from "./events/manageTasks";
import { generateSideUI } from "./dom/sideUI";
import { generateMainUI } from "./dom/mainUI";
import { addProjectForm } from "./dom/sideUI";
import { submitAddProject } from "./dom/sideUI";


function initialiseApp() {
    // Push default projects and tasks into related arrays
    ManageProject.pushDefaultProjects();
    ManageTask.pushDefaultTask();
    ManageProject.pushNewProjects();
    ManageTask.matchContent(ManageTask.defaultTasks);

    // Init Sidebar
    generateSideUI.renderSideContainer();
    generateSideUI.renderLogo('Logo');
    const addProjectButton = generateSideUI.renderAddBtn('button', 'add-project-btn', 'Add Project');
    generateSideUI.renderProjectList();
    addProjectButton.addEventListener('click', (e) => addProjectForm.appendBody(e));

    // Init Main Content
    generateMainUI.renderMainContainer();
    generateMainUI.matchProject();

    // Render Initial Project
    generateMainUI.renderContent('div', 'project-main-title', 'h1', ManageProject.projects[0].title);
    generateMainUI.renderAddBtn('button', 'project-main-button', 'add-btn', 'Add Task');
    generateMainUI.renderContent('div', 'project-main-description', 'p', ManageProject.projects[0].description);
    generateMainUI.renderTasks(ManageProject.projects[0].taskArray, 'task-box');
}

initialiseApp();