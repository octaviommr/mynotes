import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import type { AppDispatch } from "../../../store/store"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import TextField from "../../../components/ui/form/TextField"
import PasswordField from "../../../components/ui/form/PasswordField"
import { UserCredentials } from "../types/User"
import { useLogInMutation } from "../authApi"
import { logIn as runLogInThunk } from "../authSlice"
import { EMAIL_REGEX } from "../validation"
import {
  AuthFormActionsContainer,
  AuthFormFieldsContainer,
  AuthFormSubmitButton,
} from "../components/AuthForm.styles"

interface LogInFormProps {
  "aria-labelledby": string
}

type LogInFormData = UserCredentials

const LogInForm: React.FC<LogInFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LogInFormData>()

  const [logIn, { data, error }] = useLogInMutation()
  const handle = useAPIErrorHandler()

  const dispatch = useDispatch<AppDispatch>()
  const [params] = useSearchParams()
  const navigate = useNavigate()

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby={props["aria-labelledby"]}
    >
      <AuthFormFieldsContainer>
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
          required when logging in.
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
      </AuthFormFieldsContainer>
      <AuthFormActionsContainer>
        <AuthFormSubmitButton type="submit" disabled={isSubmitting}>
          Log In
        </AuthFormSubmitButton>
      </AuthFormActionsContainer>
    </form>
  )
}

export default LogInForm
