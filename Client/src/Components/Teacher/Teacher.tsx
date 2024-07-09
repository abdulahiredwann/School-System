import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useValidation from "../../hooks/useValidation";
import api from "../../Services/api-login";
import ResultList from "./ResultList";
import useTeacherValidation from "../../hooks/useTeacherValidation";

export interface Info {
  teacherName: string;
  grades: { _id: string; gradeName: string }[];
  subject: { _id: string; subjectName: string }[];
}

function Teacher() {
  const [info, setInfo] = useState<Info | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  // const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { username } = useParams<{ username: string | any }>();
  const [sub, setSub] = useState<string>("");
  useValidation();
  useTeacherValidation({ username });
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get(`/teacher/${username}`);
        setInfo(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };
    fetchGrades();
  }, [username]);

  useEffect(() => {
    if (info && info.subject.length > 0) {
      setSub(info.subject[0].subjectName);
      setSelectedSubjectId(info.subject[0]._id);
    }
  }, [info]);

  return (
    <>
      <div className="container-fluid min-vh-100">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row min-vh-100">
          <div className="col-md-3 bg-light border-right p-4 d-flex flex-column">
            <h2 className="text-2xl font-bold">Grades</h2>
            <div className="list-group flex-grow-1">
              {info?.grades.map((grade) => (
                <button
                  key={grade._id}
                  className={`list-group-item list-group-item-action ${
                    selectedGrade === grade.gradeName ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedGrade(grade.gradeName);
                    setSelectedGradeId(grade._id);
                  }}
                >
                  {grade.gradeName}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-9 d-flex flex-column position-relative">
            <div className="position-absolute top-0 end-0 m-3">
              <small>Welcome {info?.teacherName}</small>
            </div>
            {selectedGradeId && selectedSubjectId && (
              <ResultList
                gradeId={selectedGradeId}
                subjectId={selectedSubjectId}
              ></ResultList>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Teacher;
