import { FC } from "react"

type GlobalErrorProps = {
  onRetry: () => void
}

const GlobalError: FC<GlobalErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-3xl">Ooops...</h1>
      <p className="text-center text-slate-500 mt-2">Something went wrong!</p>
      <button className="text-sky-500 mt-6" onClick={() => onRetry()}>
        Try again
      </button>
    </div>
  )
}

export default GlobalError
