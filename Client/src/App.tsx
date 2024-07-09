import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import Admin from "./Components/Admin/Admin";
import CreateNewStudent from "./Components/Admin/CreateNewStudent";
import CreateNewTeacher from "./Components/Admin/CreateNewTeacher";
import StudentLogin from "./Components/Student/StudentLogin";
import MyPage from "./Components/Student/Student";
import TeacherLogin from "./Components/Teacher/TeacherLogin";
import Teacher from "./Components/Teacher/Teacher";
import Student from "./Components/Student/Student";

function App() {
  return (
    <ChakraProvider>
      <>
        <BrowserRouter>
          <div>
            <NavBar />
            <Routes>
              <Route
                path="/adminlogin"
                element={<AdminLogin></AdminLogin>}
              ></Route>
              <Route path="/admin" element={<Admin></Admin>}></Route>
              <Route
                path="/createstudent"
                element={<CreateNewStudent></CreateNewStudent>}
              ></Route>
              <Route
                path="/createteacher"
                element={<CreateNewTeacher></CreateNewTeacher>}
              ></Route>
              <Route
                path="/studentlogin"
                element={<StudentLogin></StudentLogin>}
              ></Route>
              <Route
                path="/student/:username"
                element={<Student></Student>}
              ></Route>
              <Route
                path="/teacher/:username"
                element={<Teacher></Teacher>}
              ></Route>
              <Route
                path="/loginteacher"
                element={<TeacherLogin></TeacherLogin>}
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </>
    </ChakraProvider>
  );
}

export default App;
