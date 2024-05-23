import './App.css';
import Navbar from './Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import DashBoard from './DashBoard';
import Profile from './Profile';
import Login from './Login';
import CertificateCatalogue from './CertificateCatalogue';
import UserProvider from './context/userProvider';
import { ProtectedRoute } from './ProtectedRoute';

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
export default function App() {
  return (
    <BrowserRouter>
    <ReactNotifications />
      <UserProvider>
        <Navbar />
        <Routes>
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="certificatecatalogue"
            element={
              <ProtectedRoute>
                <CertificateCatalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <div className = "App" >
//     <header className="App-header">
//       <Navbar/>
//     </header>
//     </div>
//   )
// }
// export default App
