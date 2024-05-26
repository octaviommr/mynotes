import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { login as loginAction, clearReturnURL } from "./authSlice"
import { showMessage } from "../messenger/messageSlice"
import { EMAIL_REGEX } from "./Signup"
import TextField from "../../components/form/TextField"
import PasswordField from "../../components/form/PasswordField"

type LoginFormData = {
  email: string
  password: string
}

const Login = () => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn, returnURL } = useSelector(
    (state: RootState) => state.auth,
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const login: SubmitHandler<LoginFormData> = async (data) => {
    const { email, password } = data

    const resultAction = await dispatch(loginAction({ email, password }))

    if (loginAction.fulfilled.match(resultAction)) {
      // login was successful so let's redirect to any existing stored URL or the homepage
      navigate(returnURL || "/")

      if (returnURL) {
        // clear any existing stored URL since we just returned to it
        dispatch(clearReturnURL())
      }

      return
    }

    // login failed so let's show the error message returned from the API for any known error
    if (resultAction.payload) {
      dispatch(
        showMessage({
          severity: "error",
          message: resultAction.payload.message,
        }),
      )
    }
  }

  // only render the login screen if the user is not already logged in
  useEffect(() => {
    if (isLoggedIn) {
      // redirect to homepage
      navigate("/")

      return
    }

    setCanRender(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!canRender) {
    return null
  }

  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <h2 className="text-center text-2xl font-bold">Log in</h2>
      <div className="mx-auto w-full max-w-sm">
        <form onSubmit={handleSubmit(login)}>
          <div className="flex flex-col gap-6">
            <TextField
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Email is not valid.",
                },
              })}
              label="Email"
              error={errors.email?.message}
            />
            <PasswordField
              {...register("password", {
                required: "Password is required.",
              })}
              label="Password"
              error={errors.password?.message}
            />
            <Button
              type="submit"
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white"
              disabled={isSubmitting}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <span className="text-slate-700">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-sky-700">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Login
