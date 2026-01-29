import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

function App() {
  const path = window.location.pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Only when /admin path
  if (path === "/admin") {
    return isLoggedIn ? (
      <AdminPanel />
    ) : (
      <AdminLogin onLogin={() => setIsLoggedIn(true)} />
    );
  }

  // Normal Website
  return <HomePage />;
}

export default App;
