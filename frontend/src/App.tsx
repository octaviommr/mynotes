import { BrowserRouter, Routes, Route } from "react-router-dom"
import ErrorHandler from "./components/ErrorHandler"
import Layout from "./components/Layout"
import NotFound from "./components/NotFound"

function App() {
  return (
    <BrowserRouter>
      <ErrorHandler>
        <Layout>
          <Routes>
            <Route path="/" element={<div>App</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ErrorHandler>
    </BrowserRouter>
  )
}

export default App
