import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/api-login";
import useValidation from "../../hooks/useValidation";
import { ListGroup, Button, Modal } from "react-bootstrap";
import Result from "./Result";
import ProgressChart from "./Progreess";

interface Grade {
  _id: string;
  gradeName: string;
}

interface StudentInfo {
  studentName: string;
  grade: Grade;
  subjects: string[]; // Assuming subjects are an array of strings
}

function Student() {
  useValidation();
  const { username } = useParams<{ username: string | any }>();
  const [info, setInfo] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [showChart, setShowChart] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]); // Add state for results

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await api.get(`/student/${username}`);
        setInfo(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred!");
      }
    };

    const fetchResults = async () => {
      try {
        const response = await api.get(`/student/${username}/results`);
        setResults(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred!");
      }
    };

    fetchStudentInfo();
    fetchResults(); // Fetch results
  }, [username]);

  const handleCloseChart = () => setShowChart(false);
  const handleShowChart = () => setShowChart(true);

  return (
    <div className={`container mt-4 ${showChart ? "blurred" : ""}`}>
      <div className="row">
        <div className="col-md-3">
          <h4>Welcome: {info?.studentName}</h4>
          {error && <p className="text-danger">{error}</p>}
          <hr />
          <Button onClick={handleShowChart}>See chart</Button>
        </div>
        <div className="col-md-9">
          <div className="text-center">
            <h4>Results Details</h4>
            <hr />
            <Result username={username}></Result>
          </div>
        </div>
      </div>

      <Modal show={showChart} onHide={handleCloseChart} centered>
        <Modal.Header closeButton>
          <Modal.Title>Student Progress Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProgressChart results={results} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Student;
