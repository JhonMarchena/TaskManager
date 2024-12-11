import { useState } from "react";
import { useTasks } from "../context/TaskProvider.jsx";
import "../style/tasks.css";
import { Trash2, X, Check } from "lucide-react";

function TaskCard({ task }) {
  const { toggleTaskDone, updateTask, deleteTask } = useTasks(); // Add updateTask here
  const [isTemporaryDone, setIsTemporaryDone] = useState(task.done === 1);
  const [isPopping, setIsPopping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);

  const handleDone = async () => {
    setIsPopping(true);
    setTimeout(() => {
      setIsPopping(false);
      setIsTemporaryDone(!isTemporaryDone);
    }, 300);
    setTimeout(async () => {
      await toggleTaskDone(task.id);
    }, 2000);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleTitleChange = async (e) => {
    const updatedTitle = e.target.value;
    setNewTitle(updatedTitle);

  };

  const handleDescriptionChange = async (e) => {
    const updatedDescription = e.target.value;
    setNewDescription(updatedDescription);
  };

  const handleBlur = async () => {
    setEditingTitle(false);
    setEditingDescription(false);
    // Ensure the latest changes are saved to the DB
    await updateTask(task.id, { title: newTitle, description: newDescription });
  };

  return (
    <>
      <div
        className={`${isTemporaryDone ? "done" : "individualtask"} ${
          isPopping ? "pop" : ""
        }`}
        onClick={handleModalToggle}
      >
        <div className="header">
          <h2 className="editable">{newTitle || "Untitled Task"}</h2>
          <div className="actions">
            <span>{task.createAt.substring(0, 10)}</span>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isTemporaryDone}
                onChange={handleDone}
              />
              <span className="custom-checkbox"></span>
            </label>
          </div>
        </div>
        <p className="editable">
          {newDescription || "No description provided."}
        </p>
      </div>

      {/* Modal */}
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
                    value={newTitle}
                    onChange={handleTitleChange}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  newTitle || "Untitled Task"
                )}
              </h2>
              <div className="buttonsModal">
                <button  onClick={() => deleteTask(task.id)}>
                  <Trash2 />
                </button>
                <button onClick={() => handleModalToggle()}>
                  <X />
                </button>
              </div>
            </div>
            <textarea
              className="editable-description"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal closure
                setEditingDescription(true); // Enable editing mode
              }}
              value={newDescription} // Always bind to newDescription state
              onChange={handleDescriptionChange} // Update state and DB
              onBlur={handleBlur} // Save changes and exit editing
              autoFocus // Directly enable focus
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
