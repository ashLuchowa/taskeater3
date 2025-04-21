import "./styles.css";
import { greeting } from "./dom/sideUI";
import { ManageProject } from "./events/manageProjects";
import { ManageTask } from "./events/manageTasks";
import { generateSideUI } from "./dom/sideUI";


function initialiseApp() {
    // Push default projects and tasks into related arrays
    const result = ManageProject.projects;
    ManageProject.pushDefaultProjects();
    ManageProject.pushNewProjects();
    ManageTask.pushTasks(ManageTask.defaultTasks);
    console.log(result);

    // Init Sidebar
    generateSideUI.renderSideContainer();
    generateSideUI.renderLogo('Logo');
    generateSideUI.renderAddBtn('button', 'add-project-btn', 'Add Project');
    generateSideUI.renderProjectList();
}

initialiseApp();