import { FC, ReactNode } from "react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { render, RenderOptions } from "@testing-library/react"
import { createStore } from "../../store/store"
import theme from "../../styles/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import ErrorBoundary from "../../error/ErrorBoundary"
import Layout from "../../components/layout/Layout"
import Routes from "../../routes/Routes"
import { Session, SESSION_CACHE_KEY } from "../../features/auth/authSlice"

interface AllTheProvidersProps {
  children: ReactNode
}

const AllTheProviders: FC<AllTheProvidersProps> = ({ children }) => {
  const mockSession: Session = {
    token: "token",
    name: "name",
  }

  // set up a mock session in local storage
  localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(mockSession))

  // create a new store to make sure we always start each test with a clean state
  const store = createStore()

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

const customRender = (
  route = "/",
  options?: Omit<RenderOptions, "wrapper">,
) => {
  window.history.pushState({}, "", route)

  return render(
    <>
      <GlobalStyle />
      <ErrorBoundary>
        <Layout>
          <Routes />
        </Layout>
      </ErrorBoundary>
    </>,
    { wrapper: AllTheProviders, ...options },
  )
}

export * from "@testing-library/react"
export { customRender as render }
