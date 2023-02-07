import React, { useState } from "react";
import Container from "./screens/Container";
import Login from "./screens/Login";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const saveUser = (user: string) => {
    setUser(user);
    localStorage.setItem("user", user);
  };

  return (
    <div className="w-screen h-screen">
      {!user ? (
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
