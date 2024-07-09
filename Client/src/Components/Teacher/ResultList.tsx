import React, { useEffect, useState } from "react";
import api from "../../Services/api-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UpdateResults from "./UpdateResults"; // Adjust the path as necessary

interface Props {
  gradeId: string;
  subjectId: string;
}

interface Exam {
  midExam1: number | null;
  midExam2: number | null;
  finalExam: number | null;
}

interface SubjectResult {
  exams: Exam;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  subjectResult: SubjectResult;
}

const ResultList: React.FC<Props> = ({ gradeId, subjectId }) => {
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(
    null
  );

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const response = await api.get(`/result/${gradeId}/${subjectId}`);
        if (Array.isArray(response.data)) {
          setStudentResults(response.data);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (err) {
        console.log("Error fetching student results:", err);
      }
    };
    fetchStudentResults();
  }, [gradeId, subjectId]);

  const handleEditClick = (student: StudentResult) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  const handleResultsUpdated = (updatedExams: {
    midExam1: number | null;
    midExam2: number | null;
    finalExam: number | null;
  }) => {
    if (selectedStudent) {
      setStudentResults((prevResults) =>
        prevResults.map((result) =>
          result.studentId === selectedStudent.studentId
            ? {
                ...result,
                subjectResult: {
                  ...result.subjectResult,
                  exams: updatedExams,
                },
              }
            : result
        )
      );
      handleCloseModal();
    }
  };

  const updateResults = async (exams: {
    midExam1: number | null;
    midExam2: number | null;
    finalExam: number | null;
  }) => {
    if (selectedStudent) {
      try {
        const response = await api.put("/result", {
          studentId: selectedStudent.studentId,
          subjectId,
          ...exams,
        });
        if (response.status === 200) {
          handleResultsUpdated(exams);
        } else {
          console.error("Failed to update results");
        }
      } catch (error) {
        console.error("Error updating results:", error);
      }
    }
  };

  return (
    <div className="">
      <h2>Student Results</h2>
      {studentResults.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">Student Name</th>
                <th scope="col">Mid Exam 1</th>
                <th scope="col">Mid Exam 2</th>
                <th scope="col">Final Exam</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {studentResults.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentName}</td>
                  <td>
                    {student.subjectResult.exams?.midExam1 !== null
                      ? `${student.subjectResult.exams?.midExam1}%`
                      : "N/A"}
                  </td>
                  <td>
                    {student.subjectResult.exams?.midExam2 !== null
                      ? `${student.subjectResult.exams?.midExam2}%`
                      : "N/A"}
                  </td>
                  <td>
                    {student.subjectResult.exams?.finalExam !== null
                      ? `${student.subjectResult.exams?.finalExam}%`
                      : "N/A"}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      onClick={() => handleEditClick(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedStudent && (
            <UpdateResults
              studentId={selectedStudent.studentId}
              subjectId={subjectId}
              studentName={selectedStudent.studentName}
              exams={selectedStudent.subjectResult.exams}
              closeModal={handleCloseModal}
              updateResults={updateResults}
            />
          )}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default ResultList;
