import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../../Services/api-login";
import CreateNewTeacherService from "../../Services/createNewTeacher";
import axios from "axios";

const schema = z.object({
  teacherName: z.string().min(4).max(100),
  username: z.string().min(5).max(100),
  grades: z.string().min(4).max(10000),
  subject: z.string().min(5).max(10000),
});

export type NewTeacherForm = z.infer<typeof schema>;

function CreateNewTeacher() {
  const [teacherName, setTeacherName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [grade, setGrade] = useState<Array<{ _id: string; gradeName: string }>>(
    []
  );
  const [subjects, setSubjects] = useState<
    Array<{ _id: string; subjectName: string }>
  >([]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTeacherForm>({ resolver: zodResolver(schema) });

  const handNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    setTeacherName(fullName);

    const formattedUsername = fullName.replace(/\s+/g, "").toLowerCase();
    setUsername(formattedUsername);
  };
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("grade/listofgrade");
        setGrade(response.data);
        const r = await api.get("/subject/listsubject");
        setSubjects(r.data);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchGrades();
  }, []);

  const run = async (data: NewTeacherForm) => {
    try {
      await CreateNewTeacherService(data);
      alert("Successfully registered " + data.teacherName);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data);
      } else {
        setError(err.message);
      }
    }
  };
  const handleFormSubmit = (data: NewTeacherForm) => {
    run(data);
    reset();
    setTeacherName("");
    setUsername("");
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                Teacher Creation
              </div>
              <div className="card-body">
                <form
                  onSubmit={handleSubmit((date) => {
                    console.log(date);
                    handleFormSubmit(date);
                  })}
                >
                  <div className="form-group">
                    <label htmlFor="teacherName">Teacher Name</label>
                    <input
                      {...register("teacherName")}
                      type="text"
                      className="form-control"
                      id="teacherName"
                      placeholder="Enter teacher name"
                      value={teacherName}
                      onChange={handNameChange}
                      required
                    />
                  </div>
                  {errors.teacherName && (
                    <p className="text-danger">{errors.teacherName.message}</p>
                  )}
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      {...register("username")}
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      readOnly
                    />
                  </div>
                  {errors.username && (
                    <p className="text-danger">{errors.username.message}</p>
                  )}

                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <select
                      className="form-control"
                      id="grade"
                      {...register("grades")}
                      required
                    >
                      <option value="">Select grade</option>
                      {grade.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.gradeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="grade">Subject</label>
                    <select
                      className="form-control"
                      id="subject"
                      {...register("subject")}
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-3 btn btn-primary btn-block"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateNewTeacher;
