import { FC, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import type { RootState, AppDispatch } from "../../store/store"
import { useSignUpMutation } from "./authApi"
import type { UserSignUp } from "./types/User"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { showMessage } from "../../components/layout/message/messageSlice"
import FormContainer from "../../components/ui/containers/FormContainer"
import TextField from "../../components/ui/form/TextField"
import PasswordField from "../../components/ui/form/PasswordField"
import PageTitle from "../../components/ui/PageTitle"
import Link from "../../components/ui/Link"
import SubmitButton from "./components/SubmitButton"

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

type SignUpFormData = UserSignUp & { confirmationPassword: string }

const SignUp: FC = () => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<SignUpFormData>()

  const [signUp, { error, isSuccess }] = useSignUpMutation()
  const handle = useAPIErrorHandler()

  // only render the sign up screen if the user is not already logged in
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
      // redirect to the log in screen so the user can log in
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
      // sign up failed so let's handle the error
      handle(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error])

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    await signUp(data)
  }

  if (!canRender) {
    return null
  }

  return (
    <FormContainer>
      <PageTitle>Sign Up</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
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
            required
          />
          <TextField
            {...register("name", {
              required: "Name is required.",
            })}
            label="Name"
            error={errors.name?.message}
            required
          />
          <PasswordField
            {...register("password", {
              required: "Password is required.",
            })}
            label="Password"
            error={errors.password?.message}
            required
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
            required
          />
        </section>
        <section>
          <SubmitButton disabled={isSubmitting}>Sign Up</SubmitButton>
        </section>
      </form>
      <footer>
        <p>Already have an account?</p>
        <Link to="/login">Log In</Link>
      </footer>
    </FormContainer>
  )
}

export default SignUp
