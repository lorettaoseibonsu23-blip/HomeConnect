async function loadTasks() {
  const taskTableWrap = document.getElementById('taskTableWrap');
  if (!taskTableWrap) return;

  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Unable to load tasks');
    const tasks = await response.json();

    taskTableWrap.innerHTML = `
      <table class="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Due date</th>
          </tr>
        </thead>
        <tbody>
          ${tasks
            .map(
              (task) => `
                <tr>
                  <td>${task.title}</td>
                  <td>${task.category}</td>
                  <td><span class="status-badge">${task.status}</span></td>
                  <td>${task.assignee}</td>
                  <td>${task.dueDate}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    taskTableWrap.innerHTML = '<p>Unable to load task records.</p>';
  }
}

loadTasks();
