export class Project {
    constructor(title, description, taskArray = []) {
        this.title = title;
        this.description = description;
        this.taskArray = taskArray;
    }
}

export class ManageProject {
    static projects = [];

    // Default Projects
    static defaultProjects = [
        new Project('Portfolio 2025', 'Website to feature all my work', []),
        new Project('Cleaning February', 'Cleaning duties around the house', []),
        new Project('Apply Jobs', 'Need to apply jobs', []),
        new Project('Hunting', 'I need to eat', []),
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
        const project1 = new Project('Apply TAFE', 'Diploma of IT (BackEnd)', []);
        this.projects.push(project1);
    }
}