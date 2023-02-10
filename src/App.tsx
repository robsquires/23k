import React, { useState } from "react";
import Container from "./screens/Container";
import Login from "./screens/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { Install } from "./screens/Install";

const client = new QueryClient();
const isInstalled =
  location.search.includes("debug") ||
  window.matchMedia("(display-mode: standalone)").matches;

const savedUser = localStorage.getItem("user");
function App() {
  const [user, setUser] = useState(savedUser);
  const saveUser = (user: string) => {
    setUser(user);
    localStorage.setItem("user", user);
  };

  return (
    <div className="w-screen h-screen">
      {!isInstalled ? (
        <Install />
      ) : !user ? (
        <Login onSelect={saveUser} />
      ) : (
        <QueryClientProvider client={client}>
          <Container user={user} />
        </QueryClientProvider>
      )}
    </div>
  );
}

export default App;
