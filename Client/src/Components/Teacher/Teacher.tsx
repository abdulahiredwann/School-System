import { useEffect, useState } from "react";
import useValidation from "../../hooks/useValidation";
import api from "../../Services/api-login";
import { useParams } from "react-router-dom";

interface Info {
  teacherName: string;
  grades: [];
  subject: [];
}
function Teacher() {
  const [info, setInfo] = useState<Info | null>(null);

  const [error, setError] = useState<string>("");
  const { username } = useParams<{ username: string }>();

  useValidation();
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get(`/teacher/${username}`);
        setInfo(response.data);
      } catch (err: any) {
        setError(err);
      }
    };
    fetchGrades();
  }, []);

  return (
    <>
      <div>{info?.teacherName}</div>
      <div>
        {info?.grades.map((g) => (
          <p>{g}</p>
        ))}
      </div>
    </>
  );
}

export default Teacher;
