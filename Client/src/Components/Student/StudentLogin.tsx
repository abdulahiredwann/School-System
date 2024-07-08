import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoginStudentService from "../../Services/studentLoginService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z.object({
  username: z.string().min(4).max(100),
  password: z.string().min(8).max(100),
});

export type StudentLoginForm = z.infer<typeof schema>;

function StudentLogin() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<StudentLoginForm>({ resolver: zodResolver(schema) });

  const run = async (data: StudentLoginForm) => {
    try {
      await LoginStudentService(data);
      navigate("/mypage");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occured");
      } else {
        setError("An Unexpected error occured");
      }
      console.log(err);
    }
  };
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center mb-4">Student Login</h2>
            <form
              onSubmit={handleSubmit((date) => {
                run(date);
                console.log(date);
                reset();
              })}
            >
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  required
                />
                {errors.username && (
                  <p className="text-danger">{errors.username.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentLogin;
