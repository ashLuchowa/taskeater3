import "./styles.css";
import { ManageProject } from "./events/manageProjects";
import { ManageTask } from "./events/manageTasks";
import { generateSideUI } from "./dom/sideUI";
import { generateMainUI } from "./dom/mainUI";


function initialiseApp() {
    // Push default projects and tasks into related arrays
    ManageProject.pushDefaultProjects();
    ManageProject.pushNewProjects();
    ManageTask.pushTasks(ManageTask.defaultTasks);

    // Init Sidebar
    generateSideUI.renderSideContainer();
    generateSideUI.renderLogo('Logo');
    generateSideUI.renderAddBtn('button', 'add-project-btn', 'Add Project');
    generateSideUI.renderProjectList();
    generateSideUI.initialiseForm();

    // Init Main Content
    generateMainUI.renderMainContainer();
    generateMainUI.matchProject();
}

export function restartProjectList() {
    // Sidebar
    generateSideUI.clearSideUI();
    generateSideUI.renderProjectList();

    // Main
    generateMainUI.matchProject();
}

initialiseApp();