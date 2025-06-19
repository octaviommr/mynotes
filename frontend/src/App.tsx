import { Routes, Route } from "react-router-dom"
import ErrorBoundary from "./features/errors/ErrorBoundary"
import NotFound from "./features/errors/NotFound"
import Layout from "./features/layout/Layout"
import LogIn from "./features/auth/LogIn"
import SignUp from "./features/auth/SignUp"
import AuthGuard from "./features/auth/AuthGuard"
import NoteBoard from "./features/notes/NoteBoard"
import NoteDetail from "./features/notes/NoteDetail"
import NewNote from "./features/notes/NewNote"

function App() {
  return (
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

          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
