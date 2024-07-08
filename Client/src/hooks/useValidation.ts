import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useValidation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("x-auth-token");
        if (!token) throw new Error("No Token found");

        const response = await axios.post("http://localhost:3000/verify", { token });
        if (!response.data.valid) throw new Error("Invalid Token");
      } catch (err) {
        navigate("/adminlogin"); // Redirect to login page if token is invalid
      }
    };

    verifyToken();
  }, [navigate]);
}

export default useValidation;
