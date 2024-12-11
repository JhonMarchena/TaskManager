import React from "react";
import { Route, Routes } from "react-router";
import TasksPage from "./pages/TasksPage";
import TaskForm from "./pages/TaskForm";
import NotFound from "./pages/NotFound";
import { TaskContextProvider } from "./context/TaskProvider";
import "./style/App.css"

import Mainpage from "./components/Mainpage";

function App() {
  return (
    <TaskContextProvider>
      <Routes>
        <Route path="/" element={<Mainpage Main={TasksPage}/>} />
        <Route path="/new" element={<Mainpage Main={TaskForm}/>}  />
        <Route path="/edit/:id" element={<Mainpage Main={TaskForm}/>}  />
        <Route path="*" element={<Mainpage Main={NotFound}/>}  />
      </Routes>
    </TaskContextProvider>
  );
}

export default App;
