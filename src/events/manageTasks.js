import { ManageProject } from "./manageProjects";

export class Task {
    constructor(title, description, dueDate, priority, status, projectParent) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.projectParent = projectParent;
    }
}

export class ManageTask {
    static tasks = [];

    static defaultTasks = [
        // Default Tasks
        new Task('Create website', 'Website to show all featured works', '24 Feb 2025', 'high', 'In Progress', 'Portfolio 2025'),
        new Task('Remove Spiders', 'So many spider nets and dusts', '26 Mar 2025', 'Medium', 'In Progress', 'Cleaning February'),
        new Task('Create Logo', 'Logo for my brand identity', '02 Apr 2025', 'Medium', 'In Progress', 'Portfolio 2025'),
        new Task('Sharpen Knife', 'Learn butchering', '02 May 2025', 'Medium', 'In Progress', 'Hunting'),
    ];

    static pushDefaultTask() {
        this.defaultTasks.forEach(item => {
            this.tasks.push(item);
        });
    }

    // Match tasks (default or new) into appropriate projects
    static matchContent(taskType) {
        taskType.forEach(itemTask => {
            // Match task to their respective parent project
            const foundItem = ManageProject.projects.find((itemProject) => {
                return itemProject.title === itemTask.projectParent;
            });

            if (foundItem) {
                // check if the task already exists in the task array to prevent duplication
                const existingTask = foundItem.taskArray.find(task => {
                    return task.title === itemTask.title;
                });

                if (!existingTask) {
                    foundItem.taskArray.push(itemTask);
                }
            };
        });
    }
}