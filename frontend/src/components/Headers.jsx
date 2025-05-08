import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); 

    // Load user from localStorage on mount & when it changes
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage changes (for multiple tabs)
        window.addEventListener("storage", checkUser);
        return () => window.removeEventListener("storage", checkUser);
    }, []);

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleSignOut = () => {
        localStorage.clear();
        setUser(null); 
        setDropdownOpen(false);
        window.dispatchEvent(new Event("storage")); 
        navigate("/");
        window.location.reload() 
    };

    return (
        <>
            <>
  {/* Topbar Start */}
  <div className="container-fluid bg-light ps-5 pe-0 d-none d-lg-block">
    <div className="row gx-0">
      <div className="col-md-6 text-center text-lg-start mb-2 mb-lg-0">
        <div className="d-inline-flex align-items-center">
          <small className="py-2">
            <i className="far fa-clock text-primary me-2" />
            Opening Hours: Mon - Tues : 6.00 am - 10.00 pm, Sunday Closed{" "}
          </small>
        </div>
      </div>
      <div className="col-md-6 text-center text-lg-end">
        <div className="position-relative d-inline-flex align-items-center bg-primary text-white top-shape px-5">
          <div className="me-3 pe-3 border-end py-2">
            <p className="m-0">
              <i className="fa fa-envelope-open me-2" />
              info@example.com
            </p>
          </div>
          <div className="py-2">
            <p className="m-0">
              <i className="fa fa-phone-alt me-2" />
              +012 345 6789
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Topbar End */}
  {/* Navbar Start */}
  <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
    <a href="/" className="navbar-brand p-0">
      <h1 className="m-0 text-primary">Lab AI</h1>
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarCollapse"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarCollapse">
      <div className="navbar-nav ms-auto py-0">
        <a href="/" className="nav-item nav-link active">
          Home
        </a>
        <a href="/about" className="nav-item nav-link">
          About
        </a>
        <a href="/service" className="nav-item nav-link">
          Service
        </a>
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Pages
          </a>
          <div className="dropdown-menu m-0">
            <a href="/price" className="dropdown-item">
              Pricing Plan
            </a>
            <a href="/team" className="dropdown-item">
              Team
            </a>
            <a href="/testimonial" className="dropdown-item">
              Testimonial
            </a>
            <a href="/appointment" className="dropdown-item">
              Appointment
            </a>
          </div>
        </div>
        <a href="/contact" className="nav-item nav-link">
          Contact
        </a>
      </div>
      <button
        type="button"
        className="btn text-dark"
        data-bs-toggle="modal"
        data-bs-target="#searchModal"
      >
        <i className="fa fa-search" />
      </button>
      <a href="/appointment" className="btn btn-primary py-2 px-4 ms-3">
        Appointment
      </a>
    </div>
    <div className="relative" ref={dropdownRef}>
                    {user ? (
                        <div>
                            <button 
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500" 
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            >
                                <span>{user.name || "User"}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                                        <a 
                                            href={`/dashboard/${user.role}`} 
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </a>
                                    <a href="/account" className="block px-4 py-2 hover:bg-gray-100">Account</a>
                                    <button 
                                        onClick={handleSignOut}  
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <a href="/login" className="text-gray-700 hover:text-blue-500">Login</a>
                            <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</a>
                        </div>
                    )}
                </div>
  </nav>
  {/* Navbar End */}
</>

        </>
    );
};

export default Header;
