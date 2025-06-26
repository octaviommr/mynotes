import { createGlobalStyle } from "styled-components"

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

export default GlobalStyle
