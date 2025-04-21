import "./styles.css";
import { greeting } from "./dom/sideUI";
import { ManageProject } from "./events/manageProjects";
import { ManageTask } from "./events/manageTasks";


function initialiseApp() {
    const result = ManageProject.projects;
    ManageProject.pushDefaultProjects();
    ManageProject.pushNewProjects();
    ManageProject.pushNewProjects();
    ManageTask.pushTasks(ManageTask.defaultTasks);
    console.log(result);
}

initialiseApp();