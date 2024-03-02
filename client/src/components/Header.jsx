import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Close the dropdown when the route changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogoutConfirmation = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <header className="bg-slate-200 shadow-md relative z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Prop</span>
            <span className="text-slate-700">Sphere</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="flex items-center focus:outline-none"
              >
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-md w-48 z-50">
                  <ul className="py-2">
                    <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">
                      <Link to="/profile">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        My Account
                      </Link>
                    </li>
                    <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">
                      <Link to="/my-listing">
                        <FontAwesomeIcon icon={faHome} className="mr-2" />
                        My Properties
                      </Link>
                    </li>
                    <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">
                      <Link to="/create-listing">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Property
                      </Link>
                    </li>
                    <li
                      className="py-2 px-4 hover:bg-slate-100 cursor-pointer"
                      onClick={handleLogoutConfirmation}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </li>
                    {showLogoutConfirmation && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-5 rounded-md">
                          <p className="mb-3">
                            Are you sure you want to logout?
                          </p>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={handleSignOut}
                              className="bg-slate-800 text-white px-3 py-1 rounded-md"
                            >
                              OK
                            </button>
                            <button
                              onClick={handleLogoutCancel}
                              className="bg-gray-300 px-3 py-1 rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <li className="text-slate-700 hover:underline"> Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
