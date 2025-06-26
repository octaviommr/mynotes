import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { store } from "./store/store"
import theme from "./styles/theme"
import GlobalStyle from "./styles/GlobalStyle"
import ErrorBoundary from "./error/ErrorBoundary"
import Layout from "./components/layout/Layout"
import Routes from "./routes/Routes"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GlobalStyle />
          <ErrorBoundary>
            <Layout>
              <Routes />
            </Layout>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
