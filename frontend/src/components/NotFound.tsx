import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-3xl">Ooops...</h1>
      <p className="text-center text-slate-500 mt-2">Page not found!</p>
      <span className="mt-6">
        Back to{" "}
        <Link to="/" className="text-sky-500">
          homepage
        </Link>
      </span>
    </div>
  )
}

export default NotFound
