import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import Admin from "./Components/Admin/Admin";

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
            </Routes>
          </div>
        </BrowserRouter>
      </>
    </ChakraProvider>
  );
}

export default App;
