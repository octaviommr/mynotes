import { FC } from "react"
import { Link } from "react-router-dom"

const NotFound: FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl">Ooops...</h1>
      <p className="mt-2 text-slate-700">Page not found!</p>
      <span className="mt-10 text-sm/6">
        Back to{" "}
        <Link to="/" className="font-medium text-sky-700">
          homepage
        </Link>
      </span>
    </div>
  )
}

export default NotFound
