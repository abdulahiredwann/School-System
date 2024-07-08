import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  useState();
  useEffect(() => {
    try {
      const token = localStorage.getItem("x-auth-token");
      if (!token) throw new Error("No Token found");
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <>
      <div className="justify-content-between ">
        <button
          onClick={() => navigate("/createstudent")}
          className="btn btn-primary m-5"
        >
          Create Student
        </button>
        <button
          onClick={() => navigate("/createteacher")}
          className="btn btn-primary"
        >
          Create Teacher
        </button>
      </div>
    </>
  );
}

export default Admin;
