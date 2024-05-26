import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import NotFound from "./components/NotFound"
import Login from "./features/auth/Login"
import Signup from "./features/auth/Signup"
import ErrorBoundary from "./components/ErrorBoundary"
import AuthGuard from "./features/auth/AuthGuard"

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
                  <div>App</div>
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
