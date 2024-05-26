import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { signup as signupAction } from "./authSlice"
import { showMessage } from "../messenger/messageSlice"
import TextField from "../../components/form/TextField"
import PasswordField from "../../components/form/PasswordField"

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

type SignupFormData = {
  email: string
  username: string
  password: string
  confirmationPassword: string
}

const Signup = () => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmationPassword: "",
    },
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const signup: SubmitHandler<SignupFormData> = async (data) => {
    const { email, username, password } = data

    const resultAction = await dispatch(
      signupAction({ email, username, password }),
    )

    if (signupAction.fulfilled.match(resultAction)) {
      // signup was successful so let's redirect to the login screen so the user can log in
      navigate("/login")

      // also show a success message
      dispatch(
        showMessage({
          severity: "success",
          message: "Account created successfully! Please log in to start.",
        }),
      )

      return
    }

    // signup failed so let's show the error message returned from the API for any known error
    if (resultAction.payload) {
      dispatch(
        showMessage({
          severity: "error",
          message: resultAction.payload.message,
        }),
      )
    }
  }

  // only render the signup screen if the user is not already logged in
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
      <h2 className="text-center text-2xl font-bold">Sign up</h2>
      <div className="mx-auto w-full max-w-sm">
        <form onSubmit={handleSubmit(signup)}>
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
            <TextField
              {...register("username", {
                required: "Username is required.",
              })}
              label="Username"
              error={errors.username?.message}
            />
            <PasswordField
              {...register("password", {
                required: "Password is required.",
              })}
              label="Password"
              error={errors.password?.message}
            />
            <PasswordField
              {...register("confirmationPassword", {
                required: "Confirmation password is required.",
                validate: (value) => {
                  const password = getValues("password")

                  return value === password || "Passwords don't match."
                },
              })}
              label="Confirm password"
              error={errors.confirmationPassword?.message}
            />
            <Button
              type="submit"
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white"
              disabled={isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <span className="text-slate-700">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-700">
            Log in
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Signup
