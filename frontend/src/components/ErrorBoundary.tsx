import { Component, ReactNode, ErrorInfo } from "react"
import GlobalError from "./GlobalError"

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
    this.onRetry = this.onRetry.bind(this)
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  onRetry() {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <GlobalError onRetry={this.onRetry} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
