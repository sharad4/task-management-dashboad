class TaskService {
    static async getAllTasks() {
        // Simulate API call
        return new Promise((resolve) => {
         setTimeout(() => {
            resolve({
                sucess: true,
                data: []
            });
         }, 1000);
        });
    }

    static async createTask(taskData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {...taskData, id: Date.now(), createdAt: new Date() }
                });
            }, 500);
        });
    }

    static async updateTask(taskId, updates) {
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve({
                sucess: true,
                data: { id: taskId, ...updates }
            });
            }, 500)
        });
    }
}