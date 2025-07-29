import React, { useState } from "react";
import { apiCreateCategory } from "../api";

// PUBLIC_INTERFACE
function CategoryModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setErr("");
    try {
      await apiCreateCategory({ name });
      onClose();
      window.dispatchEvent(new CustomEvent("task-filters", { detail: {} }));
    } catch {
      setErr("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>New Category</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </label>
          {err && <div className="error">{err}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CategoryModal;
