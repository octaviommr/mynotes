import { FC, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { useLoginMutation } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { login as runLoginThunk } from "./authSlice"
import { EMAIL_REGEX } from "./Signup"
import InputField from "../../components/form/InputField"
import PasswordField from "../../components/form/PasswordField"

interface LoginFormData {
  email: string
  password: string
}

const Login: FC = () => {
  const [canRender, setCanRender] = useState(false)

  const authState = useSelector((state: RootState) => state.auth)
  const attemptedURL = authState.isLoggedIn ? undefined : authState.attemptedURL

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

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

  const [login, { data, error }] = useLoginMutation()
  const handle = useAPIErrorHandler()

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const { email, password } = data

    await login({ email, password })
  }

  // only render the login screen if the user is not already logged in
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
      dispatch(runLoginThunk(data))

      // redirect to any existing attempted URL or the homepage
      navigate(attemptedURL || "/")

      return
    }

    if (error) {
      // login failed so let's handle the error
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
            <InputField
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Email is not valid.",
                },
              })}
              type="email"
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
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
              disabled={isSubmitting}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <span className="text-sm/6 text-slate-700">
          Don't have an account yet?{" "}
          <Link to="/signup" className="font-medium text-sky-700">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Login
