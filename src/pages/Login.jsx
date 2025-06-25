import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome To CircleUp!!</h1>
          <p className="py-6">
          CircleUp is a sleek social networking app that lets you share Stories and permanent posts to keep your friends and family updated.
Discover new connections through search and follow, then engage with likes, comments, and direct messages in a personalized feed.
Customize your experience with light/dark themes, profile personalization, and privacy settings to control who sees your content.          </p>
          <Link to="/register">
            <button className="btn btn-neutral">Register</button>
          </Link>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                className="input input-bordered"
                required
              />
              <label className="label">
                <Link to="/forget-password" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              {err && <p className="text-red-500">{err}</p>}
              <button onClick={handleLogin} className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
