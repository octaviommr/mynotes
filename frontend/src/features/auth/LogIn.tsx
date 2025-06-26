import { FC, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import type { RootState, AppDispatch } from "../../store/store"
import { useLogInMutation } from "./authApi"
import type { UserCredentials } from "./types/User"
import { useAPIErrorHandler } from "../../hooks/useAPIErrorHandler"
import { logIn as runLogInThunk } from "./authSlice"
import { EMAIL_REGEX } from "./SignUp"
import FormContainer from "../../components/ui/containers/FormContainer"
import TextField from "../../components/ui/form/TextField"
import PasswordField from "../../components/ui/form/PasswordField"
import PageTitle from "../../components/ui/PageTitle"
import Link from "../../components/ui/Link"
import SubmitButton from "./components/SubmitButton"

type LogInFormData = UserCredentials

const LogIn: FC = () => {
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

  const onSubmit: SubmitHandler<LogInFormData> = async (data) => {
    await logIn(data)
  }

  if (!canRender) {
    return null
  }

  return (
    <FormContainer>
      <PageTitle>Log In</PageTitle>
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
            NOTE: For security reasons, we want to give potential attackers as few hints as possible about the password.
            Therefore, we won't mark the field as required and we'll let the required validation happen only on the server
            (so we can provide a more generic error message, which is not password-specific).
          */}
        </section>
        <section>
          <SubmitButton disabled={isSubmitting}>Log In</SubmitButton>
        </section>
      </form>
      <footer>
        <p>Don't have an account yet?</p>
        <Link to="/signup">Sign Up</Link>
      </footer>
    </FormContainer>
  )
}

export default LogIn
