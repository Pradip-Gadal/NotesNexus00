import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { SuspenseWrapper } from "./components/SuspenseWrapper";
import { AuthRoute } from "./components/AuthRoute";
import { RootLayout } from "./layouts/RootLayout";
import { DarkLayout } from "./layouts/DarkLayout";

// Lazy load pages
const App = lazy(() => import("./pages/App.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileDetails = lazy(() => import("./pages/ProfileDetails.tsx"));
const UploadedFiles = lazy(() => import("./pages/UploadedFiles.tsx"));
const SavedFiles = lazy(() => import("./pages/SavedFiles.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const UploadNotes = lazy(() => import("./pages/UploadNotes.tsx"));
const NotesList = lazy(() => import("./pages/NotesList.tsx"));
const BrowseNotes = lazy(() => import("./pages/BrowseNotes.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(
  () => import("./pages/SomethingWentWrongPage"),
);

export const router = createBrowserRouter([
  // Root layout with nested routes
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <SuspenseWrapper>
        <SomethingWentWrongPage />
      </SuspenseWrapper>
    ),
    children: [
      // Profile and browse notes pages
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <Profile />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/details",
        element: (
          <SuspenseWrapper>
            <ProfileDetails />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/uploaded-files",
        element: (
          <SuspenseWrapper>
            <UploadedFiles />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/saved-files",
        element: (
          <SuspenseWrapper>
            <SavedFiles />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/settings",
        element: (
          <SuspenseWrapper>
            <Settings />
          </SuspenseWrapper>
        ),
      },
      {
        path: "upload-note",
        element: (
          <SuspenseWrapper>
            <AuthRoute>
              <UploadNotes />
            </AuthRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: "selected-notes/:levelId/:gradeIds",
        element: (
          <SuspenseWrapper>
            <NotesList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "browse-notes",
        element: (
          <SuspenseWrapper>
            <BrowseNotes />
          </SuspenseWrapper>
        ),
      },
      // Auth pages
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: "signup",
        element: (
          <SuspenseWrapper>
            <Signup />
          </SuspenseWrapper>
        ),
      },
      {
        path: "auth",
        element: (
          <SuspenseWrapper>
            <Auth />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Dark layout for landing page
  {
    path: "/landing",
    element: <DarkLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <App />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Root path redirects to landing
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <App />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // 404 page
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);
