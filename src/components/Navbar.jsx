import HomeIcon from "@mui/icons-material/Home";
import GridViewIcon from "@mui/icons-material/GridView";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Theme Toggle
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  // Search
  const [searchInput, setSearchInput] = useState("");

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      navigate(`/friendprof?term=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await makeRequest.post("/auth/logout");
      localStorage.removeItem("user"); // optional for testing
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">CircleUp</Link>

          <Link to="/">
            <HomeIcon />
          </Link>

          <label className="swap swap-rotate ml-2">
            <input onClick={handleToggle} type="checkbox" className="theme-controller" />
            {/* Sun Icon */}
            <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17...Z" />
            </svg>
            {/* Moon Icon */}
            <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13...Z" />
            </svg>
          </label>

          <GridViewIcon className="ml-4" />

          {/* Search Input and Button */}
          <div className="navbar-center form-control flex flex-row gap-2 items-center ml-4">
            <input
              type="text"
              placeholder="Search users"
              className="input input-bordered w-24 md:w-auto"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
            />
            <button
              onClick={handleSearchClick}
              className="btn btn-ghost btn-circle"
              title="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        <div className="flex-none gap-2">
          <PermIdentityIcon />
          <NotificationsNoneIcon />
          <MailOutlineIcon />

          <span>{currentUser?.username || "Guest"}</span>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    currentUser?.profilePic
                      ? `http://localhost:5173/uploads/posts/${currentUser.profilePic}`
                      : "http://localhost:5173/default/default_profile.png"
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <NavLink to={`/profile/${currentUser?.id}`}>
                  <a className="justify-between">Profile</a>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/profile/${currentUser?.id}`}>
                  <a className="justify-between">Settings</a>
                </NavLink>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
