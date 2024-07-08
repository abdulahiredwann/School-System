import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CreateNewStudentService from "../../Services/createNewStudent";
import axios from "axios";
import api from "../../Services/api-login";

interface RegisterStudentProps {}

const schema = z.object({
  studentName: z.string().min(4).max(1000),
  username: z.string().min(5).max(1000),
  grade: z.string().max(1000).min(5),
  gender: z.string().min(2).max(1000),
});

export type NewStudentForm = z.infer<typeof schema>;

const CreateNewStudent: React.FC<RegisterStudentProps> = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<Array<{ _id: string; gradeName: string }>>(
    []
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewStudentForm>({ resolver: zodResolver(schema) });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    setStudentName(fullName);

    // Convert full name to username
    const formattedUsername = fullName.replace(/\s+/g, "").toLowerCase();
    setUsername(formattedUsername);
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("grade/listofgrade");
        setGrade(response.data);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchGrades();
  }, []);

  const run = async (data: NewStudentForm) => {
    try {
      await CreateNewStudentService(data);
      alert("Successfully registered " + data.studentName);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data);
      } else {
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = (data: NewStudentForm) => {
    run(data);
    reset();
    setStudentName("");
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
                Student Registration
              </div>
              <div className="card-body">
                <form
                  onSubmit={handleSubmit((date) => {
                    handleFormSubmit(date);
                    console.log(date);
                  })}
                >
                  <div className="form-group">
                    <label htmlFor="studentName">Student Name</label>
                    <input
                      {...register("studentName")}
                      type="text"
                      className="form-control"
                      id="studentName"
                      placeholder="Enter student name"
                      value={studentName}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  {errors.studentName && (
                    <p className="text-danger">{errors.studentName.message}</p>
                  )}
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      {...register("username")}
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Generated username"
                      value={username}
                      readOnly
                    />
                  </div>
                  {errors.username && (
                    <p className="text-danger">{errors.username.message}</p>
                  )}

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="form-control"
                      id="gender"
                      {...register("gender")}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-danger">{errors.gender.message}</p>
                  )}

                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <select
                      className="form-control"
                      id="grade"
                      {...register("grade")}
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
                  {errors.grade && (
                    <p className="text-danger">{errors.grade.message}</p>
                  )}

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
};

export default CreateNewStudent;
