import React, { useEffect, useState } from "react";
import { apiCreateTask, apiUpdateTask, apiGetCategories } from "../api";

// PUBLIC_INTERFACE
function TaskModal({ open, onClose, editTask }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    due_date: "",
    status: "open",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      apiGetCategories().then(setCategories); // Always refresh categories list
      if (editTask) {
        setForm({
          title: editTask.title || "",
          description: editTask.description || "",
          category: editTask.category || "",
          due_date: (editTask.due_date || "").slice(0, 10),
          status: editTask.status || "open",
        });
      } else {
        setForm({
          title: "",
          description: "",
          category: "",
          due_date: "",
          status: "open",
        });
      }
    }
  }, [open, editTask]);

  if (!open) return null;

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      if (editTask) {
        await apiUpdateTask(editTask.id, form);
      } else {
        await apiCreateTask(form);
      }
      onClose();
      window.dispatchEvent(new CustomEvent('task-filters', { detail: {} })); // Refresh task list
    } catch {
      setErr("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{editTask ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Due Date
            <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          {err && <div className="error">{err}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
