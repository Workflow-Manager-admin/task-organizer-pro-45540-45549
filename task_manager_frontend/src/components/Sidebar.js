import React, { useEffect, useState } from "react";
import { apiGetCategories } from "../api";

// PUBLIC_INTERFACE
function Sidebar({ onCreateCategory }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiGetCategories().then(setCategories).catch(() => {});
  }, []);

  // Forward filters through global event (simple singleton) - in a real app use a state lib.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('task-filters', {
      detail: { category: selectedCategory, status, sort, search },
    }));
  }, [selectedCategory, status, sort, search]);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">Categories</div>
        <ul className="sidebar-list">
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory("")}
          >All</li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={selectedCategory === cat.name ? "active" : ""}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
        <button className="sidebar-add" onClick={onCreateCategory}>+ New Category</button>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Status</div>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Sort</div>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Default</option>
          <option value="due_asc">Due Soonest</option>
          <option value="due_desc">Due Latest</option>
          <option value="created_desc">Newest</option>
          <option value="created_asc">Oldest</option>
        </select>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Search</div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
