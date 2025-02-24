import { FC, ReactNode } from "react"
import { Provider } from "react-redux"
import { render, RenderOptions } from "@testing-library/react"
import { createStore } from "./store"
import { Session, SESSION_CACHE_KEY } from "./features/auth/authSlice"
import App from "./App"

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

  return <Provider store={store}>{children}</Provider>
}

const customRender = (
  route = "/",
  options?: Omit<RenderOptions, "wrapper">,
) => {
  window.history.pushState({}, "", route)

  return render(<App />, { wrapper: AllTheProviders, ...options })
}

export * from "@testing-library/react"
export { customRender as render }
