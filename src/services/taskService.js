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
        })
    }
}