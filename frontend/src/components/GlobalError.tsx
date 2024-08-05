import { FC } from "react"
import { Button } from "@headlessui/react"

interface GlobalErrorProps {
  onRetry: () => void
}

const GlobalError: FC<GlobalErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl">Ooops...</h1>
      <p className="mt-2 text-slate-700">Something went wrong!</p>
      <Button
        type="button"
        className="mt-10 rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white"
        onClick={() => onRetry()}
      >
        Try again
      </Button>
    </div>
  )
}

export default GlobalError
