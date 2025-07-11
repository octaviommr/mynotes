import { Component } from "react"
import GlobalError from "./GlobalError"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
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

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
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
