import { FC, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { useLogInMutation, UserCredentials } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { logIn as runLogInThunk } from "./authSlice"
import { EMAIL_REGEX } from "./Signup"
import TextField from "../../components/form/TextField"
import PasswordField from "../../components/form/PasswordField"

type LogInFormData = UserCredentials

const Login: FC = () => {
  const [canRender, setCanRender] = useState(false)

  const authState = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LogInFormData>()

  const [logIn, { data, error }] = useLogInMutation()
  const handle = useAPIErrorHandler()

  const onSubmit: SubmitHandler<LogInFormData> = async (data) => {
    await logIn(data)
  }

  // only render the log in screen if the user is not already logged in
  useEffect(() => {
    if (authState.isLoggedIn) {
      // redirect to homepage
      navigate("/")

      return
    }

    setCanRender(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle mutation results
  useEffect(() => {
    if (data) {
      dispatch(runLogInThunk(data))

      // redirect to any existing attempted URL or the homepage
      navigate(params.get("attemptedUrl") || "/")

      return
    }

    if (error) {
      // log in failed so let's handle the error
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  if (!canRender) {
    return null
  }

  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <h2 className="text-center text-2xl font-bold">Log in</h2>
      <div className="mx-auto w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {/* 
              NOTE: No need to mark this field as required, since it's already obvious for users that the email field is
              required when logging in
            */}

            <PasswordField
              {...register("password")}
              label="Password"
              error={errors.password?.message}
            />
            {/*
              NOTE: For security reasons, we want to give potential attackers as few hints as possible about the password,
              so we'll let the required validation happen only on the server side. This way, we can provide a more generic
              error message, which is not password-specific.
            */}

            <Button
              type="submit"
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
              disabled={isSubmitting}
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className=" text-slate-700">Don't have an account yet?</span>
        <Link to="/signup" className="text-sm/6 font-medium text-sky-700">
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default Login
