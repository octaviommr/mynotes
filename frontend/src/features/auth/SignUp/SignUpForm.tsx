import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import type { AppDispatch } from "../../../store/store"
import { useAPIErrorHandler } from "../../../hooks/useAPIErrorHandler"
import TextField from "../../../components/ui/form/TextField"
import PasswordField from "../../../components/ui/form/PasswordField"
import { showMessage } from "../../../components/layout/message/messageSlice"
import { UserSignUp } from "../types/User"
import AuthForm from "../components/AuthForm"
import { useSignUpMutation } from "../authApi"
import { EMAIL_REGEX } from "../validation"

type SignUpFormProps = Pick<
  React.ComponentProps<typeof AuthForm>,
  "aria-labelledby"
>

type SignUpFormData = UserSignUp & { confirmationPassword: string }

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<SignUpFormData>()

  const [signUp, { error, isSuccess }] = useSignUpMutation()
  const handle = useAPIErrorHandler()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

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

  return (
    <AuthForm
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby={props["aria-labelledby"]}
      fields={
        <>
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
        </>
      }
      submitLabel="Sign Up"
      isSubmitting={isSubmitting}
    />
  )
}

export default SignUpForm
