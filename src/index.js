import "./styles.css";
import { greeting } from "./dom/sideUI";
import { ManageProject } from "./events/manageProjects";


function initialiseApp() {
    const result = ManageProject.projects;
    ManageProject.pushDefaultProjects();
    console.log(result);
}

initialiseApp();