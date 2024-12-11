import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard.jsx";
import { useTasks } from "../context/TaskProvider.jsx";
import { ChevronDown, ChevronUp, Plus, X, Save } from "lucide-react";
import Swal from 'sweetalert2';

import "../style/tasks.css";

function TasksPage() {
  const { tasks, loadTask, createTask } = useTasks(); // Add createTask here
  const [activeIndex, setActiveIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setNewTask({ title: "", description: "" }); // Reset task form when opening
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCreateTask = async () => {
    if (newTask.title.trim() === "") return Swal.fire({
      title: 'Title cannot be empty.',
      text: 'Please provide a title before proceeding.',
      icon: 'warning',
      confirmButtonText: 'Okay',
      customClass: {
        popup: 'custom-popup',
        icon: 'custom-icon'
      },
    });
    try {
      await createTask(newTask); // Save task to DB
      loadTask(); // Reload tasks
      handleModalToggle(); // Close modal
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  function renderDone() {
    const doneTasks = tasks.filter((task) => task.done === 1);
    if (doneTasks.length === 0) return <h1>No Done Tasks Yet</h1>;
    return doneTasks.map((task) => <TaskCard task={task} key={task.id} />);
  }

  function renderStill() {
    const stillTasks = tasks.filter((task) => task.done === 0);
    if (stillTasks.length === 0) return <h1>Not Tasks Yet</h1>;
    return stillTasks.map((task) => <TaskCard task={task} key={task.id} />);
  }

  return (
    <div className="taskview">
      <div className="full-header">
        <h1>Task</h1>
        <button onClick={handleModalToggle}>
          <Plus />
        </button>
      </div>
      <div className="container">{renderStill()}</div>
      <div className="accordion">
        <hr />
        {["Done Tasks"].map((title, index) => (
          <div key={index} className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => toggleSection(index)}
            >
              {title}
            </div>
            <div
              className={`accordion-content ${
                activeIndex === index ? "open" : ""
              }`}
            >
              <div className="contentAcc">{renderDone()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleModalToggle}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <div className="modal-header">
              <h2
                className="editable-title"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTitle(true);
                }}
              >
                {editingTitle ? (
                  <input
                    type="text"
                    name="title" // Add this line
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    autoFocus
                  />
                ) : (
                  newTask.title || "Untitled Task"
                )}
              </h2>
              <div className="buttonsModal">
                <button onClick={handleCreateTask}>
                  <Save />
                </button>
                <button onClick={() => handleModalToggle()}>
                  <X />
                </button>
              </div>
            </div>
            <textarea
              name="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
