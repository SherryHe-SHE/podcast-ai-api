const tasks = new Map();

module.exports = {
  createTask: (id, data) => {
    tasks.set(id, { id, ...data, createdAt: new Date().toISOString() });
    return tasks.get(id);
  },
  getTask: (id) => tasks.get(id),
  updateTask: (id, data) => {
    const task = tasks.get(id);
    if (task) Object.assign(task, data, { updatedAt: new Date().toISOString() });
    return task;
  },
  getCompletedTasks: (limit) => []
};
