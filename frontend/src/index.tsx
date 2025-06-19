import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import { store } from "./store/store"
import App from "./App"
import theme from "./theme"
import reportWebVitals from "./reportWebVitals"

const container = document.getElementById("root")!
const root = createRoot(container)

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul {
    margin: 0;
  }

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  /* remove extra space below images */
  img,
  svg {
    display: block; 
  }

  /* inherit font from the body */
  button,
  input, 
  textarea {
    font-family: inherit;
  }

  ul {
    list-style: none;
  }
`

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GlobalStyle />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
