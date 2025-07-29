import React, { useState, useEffect } from "react";
import "./App.css";
import {
  AuthProvider,
  useAuth,
} from "./components/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import CategoryModal from "./components/CategoryModal";
import LoginPage from "./components/LoginPage";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null); // For editing existing task

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // User session & UI routing
  return (
    <AuthProvider>
      <AppLayout
        theme={theme}
        toggleTheme={toggleTheme}
        taskModalOpen={taskModalOpen}
        setTaskModalOpen={setTaskModalOpen}
        categoryModalOpen={categoryModalOpen}
        setCategoryModalOpen={setCategoryModalOpen}
        editTask={editTask}
        setEditTask={setEditTask}
      />
    </AuthProvider>
  );
}

// Layout, sidebar/main, modal structure,
// keeps all contexts/providers & UI hierarchy in one spot.
function AppLayout({
  theme,
  toggleTheme,
  taskModalOpen,
  setTaskModalOpen,
  categoryModalOpen,
  setCategoryModalOpen,
  editTask,
  setEditTask,
}) {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="App app-flex">
      <Header toggleTheme={toggleTheme} theme={theme} />
      <div className="app-flex-body">
        <Sidebar
          onCreateCategory={() => setCategoryModalOpen(true)}
        />
        <main className="main-content">
          <TaskList
            onAddTask={() => { setEditTask(null); setTaskModalOpen(true); }}
            onEditTask={(task) => { setEditTask(task); setTaskModalOpen(true); }}
          />
        </main>
      </div>
      <TaskModal
        open={taskModalOpen}
        onClose={() => { setEditTask(null); setTaskModalOpen(false); }}
        editTask={editTask}
      />
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
}

export default App;
