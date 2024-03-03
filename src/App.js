import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
// import { Fragment } from "react";

import "./app.css";
import ChatProvider from "./context/ChatProvider";

const router = createBrowserRouter([
  {
    element: <ChatProvider />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/chats", element: <ChatPage /> },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
