import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import FileInfoPage from "./components/FileInfoPage";
import BucketPage from "./components/BucketPage";
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import {useState} from "react";
import {Context} from "./Context";

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/signin",
      element: <SignInPage />,
    },
    {
      path: "bucket/:bucketName",
      element: <BucketPage />,
    },
    {
      path: "bucket/:bucketName/file/:fileId",
      element: <FileInfoPage />,
    },
  ]);

  return (
      <Context.Provider value={{
        isUserAuthenticated: isUserAuthenticated,
        setIsUserAuthenticated: setIsUserAuthenticated,
      }}>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </Context.Provider>
  );
}

export default App;
