import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import NotFound from "./components/NotFound"
import Login from "./features/auth/Login"
import Signup from "./features/auth/Signup"
import ErrorBoundary from "./components/ErrorBoundary"
import AuthGuard from "./features/auth/AuthGuard"
import NoteBoard from "./features/notes/NoteBoard"
import NoteDetail from "./features/notes/NoteDetail"
import NewNote from "./features/notes/NewNote"

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <AuthGuard>
                  <NoteBoard />
                </AuthGuard>
              }
            />
            <Route
              path="/note/:id"
              element={
                <AuthGuard>
                  <NoteDetail />
                </AuthGuard>
              }
            />
            <Route
              path="/note/create"
              element={
                <AuthGuard>
                  <NewNote />
                </AuthGuard>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
