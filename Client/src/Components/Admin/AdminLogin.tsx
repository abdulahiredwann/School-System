import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AdminLoginService from "../../Services/adminLoginService";

const schema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be more than 5 characters." })
    .max(100),
  password: z
    .string()
    .min(6, { message: "Password must be more than 6 characters." })
    .max(100),
});

type LoginFormData = z.infer<typeof schema>;

function AdminLogin() {
  const navigate = useNavigate();
  const {
    reset,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const run = async (data: LoginFormData) => {
    try {
      await AdminLoginService(data);
      navigate("/admin");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h3 className="card-header text-center">Admin Login</h3>
            <div className="card-body">
              <form
                onSubmit={handleSubmit((data) => {
                  run(data);
                  reset();
                })}
              >
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    {...register("username")}
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    required
                  />
                  <p>{errors.username && errors.username?.message}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    {...register("password")}
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    required
                  />
                  <p>{errors.password && errors.password?.message}</p>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
