import React, { useEffect, useState, useCallback } from "react";
import { apiGetTasks, apiDeleteTask, apiUpdateTask } from "../api";

// PUBLIC_INTERFACE
function TaskList({ onAddTask, onEditTask }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(() => {
    setLoading(true);
    apiGetTasks(filters)
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const handler = (e) => { setFilters(e.detail); };
    window.addEventListener("task-filters", handler);
    return () => window.removeEventListener("task-filters", handler);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filters, fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await apiDeleteTask(id);
    fetchTasks();
  };

  return (
    <div className="tasklist">
      <div className="tasklist-header">
        <h2>Tasks</h2>
        <button className="btn-primary" onClick={onAddTask}>+ Add Task</button>
      </div>
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="empty">No tasks found.</div>
      ) : (
        <ul className="tasklist-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className="task-category">{task.category}</span>
                  <span className="task-date">
                    Due: {task.due_date?.slice(0, 10) || "None"}
                  </span>
                </div>
                <div className="task-desc">{task.description}</div>
              </div>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={async (e) => {
                    await apiUpdateTask(task.id, { status: e.target.value });
                    fetchTasks();
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button className="btn-edit" onClick={() => onEditTask(task)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
