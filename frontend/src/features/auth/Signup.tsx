import { FC, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@headlessui/react"
import { RootState, AppDispatch } from "../../store"
import { User, useSignupMutation } from "../../api"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { showMessage } from "../messages/messageSlice"
import InputField from "../../components/form/InputField"
import PasswordField from "../../components/form/PasswordField"

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

type SignupFormData = Omit<User, "id"> & {
  password: string
  confirmationPassword: string
}

const Signup: FC = () => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<SignupFormData>()

  const [signup, { error, isSuccess }] = useSignupMutation()
  const handle = useAPIErrorHandler()

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    const { email, name, password } = data

    await signup({ email, name, password })
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

  // handle mutation results
  useEffect(() => {
    if (isSuccess) {
      // redirect to the login screen so the user can log in
      navigate("/login")

      // show a success message
      dispatch(
        showMessage({
          severity: "success",
          content: "Account created successfully! Please log in to start.",
        }),
      )

      return
    }

    if (error) {
      // signup failed so let's handle the error
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error])

  if (!canRender) {
    return null
  }

  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <h2 className="text-center text-2xl font-bold">Sign up</h2>
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
            <InputField
              {...register("name", {
                required: "Name is required.",
              })}
              label="Name"
              error={errors.name?.message}
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
              className="rounded-md bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white data-[disabled]:bg-gray-500"
              disabled={isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <span className="text-sm/6 text-slate-700">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-sky-700">
            Log in
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Signup
