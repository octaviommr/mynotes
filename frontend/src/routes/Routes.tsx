import { Routes as RouterRoutes, Route } from "react-router-dom"
import LogIn from "../features/auth/LogIn/LogIn"
import SignUp from "../features/auth/SignUp/SignUp"
import NoteBoard from "../features/notes/NoteBoard/NoteBoard"
import NoteDetail from "../features/notes/NoteDetail/NoteDetail"
import NewNote from "../features/notes/NewNote/NewNote"
import NotFound from "./NotFound"
import AuthGuard from "./AuthGuard"

const Routes: React.FC = () => {
  return (
    <RouterRoutes>
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
    </RouterRoutes>
  )
}

export default Routes
