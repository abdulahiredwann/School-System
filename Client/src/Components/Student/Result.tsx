import { useEffect, useState } from "react";
import api from "../../Services/api-login";

interface Exam {
  midExam1: number;
  midExam2: number;
  finalExam: number;
}

interface Subject {
  _id: string;
  subjectName: string;
}

interface Result {
  exams: Exam;
  subject: Subject;
  _id: string;
}

interface Props {
  username: string;
}

function Result({ username }: Props) {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/student/${username}/results`);
        setResults(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchResults();
  }, [username]);

  return (
    <>
      <h2>Student Results</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Subject</th>
              <th scope="col">Mid Exam 1</th>
              <th scope="col">Mid Exam 2</th>
              <th scope="col">Final Exam</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{result.subject.subjectName}</td>
                <td>{result.exams.midExam1}</td>
                <td>{result.exams.midExam2}</td>
                <td>{result.exams.finalExam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Result;
