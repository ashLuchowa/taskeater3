class Project {
    constructor(title, description, button, taskArray = []) {
        this.title = title;
        this.description = description;
        this.button = button;
        this.taskArray = taskArray;
    }
}

export class ManageProject {
    static projects = [];

    // Default Projects
    static defaultProjects = [
        new Project('Portfolio 2025', 'Website to feature all my work', 'add-task-btn', []),
        new Project('Cleaning February', 'Cleaning duties around the house', 'add-task-btn', []),
        new Project('Apply Jobs', 'Need to apply jobs', 'add-task-btn', []),
        new Project('Hunting', 'I need to eat', 'add-task-btn', []),
    ];

    // Push Default Projects in projects Array
    static pushDefaultProjects() {
        this.defaultProjects.forEach(itemProject => {
            this.projects.push(itemProject);
        });
    }

    // Push New Projects (Demo)
    static pushNewProjects() {
        // Clear array first
        this.projects.length = 0;

        // Push default projects again
        ManageProject.pushDefaultProjects();

        // Push new project
        const project1 = new Project('Apply TAFE', 'Diploma of IT (BackEnd)', 'add-task-btn', []);
        this.projects.push(project1);
    }
}