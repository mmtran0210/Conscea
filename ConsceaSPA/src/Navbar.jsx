import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import UserContext from './context/userContext';

function Navbar() {
  // adding the states
  const [isActive, setIsActive] = useState(false);
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false);
  };

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const renderDashboardTab = () => {
    // Only show this tab if the current user is an admin
    if (user && user.role.toLowerCase() === 'admin') {
      return (
        <li onClick={removeActive}>
          <a
            onClick={() => {
              navigate('/Dashboard');
            }}
            className={`${styles.navLink}`}
          >
            DashBoard
          </a>
        </li>
      );
    }
  };

  const renderRightNav = () => {
    if (user) {
      return (
        <div style={{ display: 'flex', gap: '30px' }}>
          <li onClick={removeActive}>
            <a
              onClick={() => {
                navigate('/profile');
              }}
              className={`${styles.navLink}`}
            >
              Profile
            </a>
          </li>
          <li onClick={removeActive}>
            <a
              onClick={() => {
                navigate('/login');
                logout();
              }}
              className={`${styles.navLink}`}
            >
              Logout
            </a>
          </li>
        </div>
      );
    } else {
      return (
        <li onClick={removeActive}>
          <a
            onClick={() => {
              navigate('/login');
            }}
            className={`${styles.navLink}`}
          >
            Login
          </a>
        </li>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* logo */}
          <a
            onClick={() => {
              navigate('/home');
            }}
            className={`${styles.logo}`}
          >
            Conscea{' '}
          </a>
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            <div style={{ display: 'flex', gap: '60px' }}>
              {user && (
                <>
                  <li onClick={removeActive}>
                    <a
                      onClick={() => {
                        navigate('/home');
                      }}
                      className={`${styles.navLink}`}
                    >
                      Home
                    </a>
                  </li>
                  {renderDashboardTab()}
                  <li onClick={removeActive}>
                    <a
                      onClick={() => {
                        navigate('/CertificateCatalogue');
                      }}
                      className={`${styles.navLink}`}
                    >
                      Certificate Catalogue
                    </a>
                  </li>
                </>
              )}
            </div>
            <div>{renderRightNav()}</div>
          </ul>
          <div
            className={`${styles.hamburger} ${isActive ? styles.active : ''}`}
            onClick={toggleActiveClass}
          >
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}
export default Navbar;

// import React from 'react';
// import { Link } from 'react-router-dom';

// function Navbar() {
//   return (
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/about">About</Link></li>
//         <li><Link to="/services">Services</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;

// import { Outlet, Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/dashboard">DashBoard</Link>
//           </li>
//           <li>
//             <Link to="/profile">Profile</Link>
//           </li>
//         </ul>
//       </nav>

//       <Outlet />
//     </>
//   )
// };

// export default Navbar;
