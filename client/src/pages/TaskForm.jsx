import { Formik, Form } from "formik";
import { useTasks } from "../context/TaskProvider";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";


function TaskForm() {
  const { createTask, getTask, updateTask } = useTasks();
  const [task, setTask] = useState({
    title: "",
    description: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTask = async () => {
      if (params.id) {
        const task = await getTask(params.id);
        setTask({
          title: task.title,
          description: task.description,
        });
      }
    };
    loadTask();
  }, []);

  return (
    <div>
      <h1>{params.id ? "Edit Task" : "New Task"}</h1>

      <Formik
        initialValues={task}
        enableReinitialize={true}
        onSubmit={async (values, actions) => {
          console.log(values);
          if (params.id) {
            await updateTask(params.id, values);
            navigate("/");
          } else {
            await createTask(values);
          }
          setTask({
            title: "",
            description: "",
          });
        }}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Type a text"
              name="title"
              onChange={handleChange}
              value={values.title}
            />

            <label>Description</label>
            <textarea
              placeholder="Write a description"
              rows="3"
              name="description"
              onChange={handleChange}
              value={values.description}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saiving..." : "Save"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TaskForm;
