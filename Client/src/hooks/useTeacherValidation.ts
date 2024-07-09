import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api-login";

interface Props {
  username: string | null;
}

const useTeacherValidation = ({ username }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("Username:", username); // Check username value

        const token = localStorage.getItem("x-auth-token");
        if (!token) throw new Error("No Token found");

        const response = await api.get(`/verify/teacher/${username}`);
        console.log("Response:", response); // Check response from API

        if (!response.data.validTeacher) throw new Error("Invalid Token");
      } catch (err) {
        console.error(err); // Log any errors for debugging
        navigate("/loginteacher"); // Redirect to login page if token is invalid
      }
    };

      verifyToken();
  }, []);
};

export default useTeacherValidation;
