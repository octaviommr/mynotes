import { FC, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../store"
import { closeMessage } from "./messageSlice"
import Alert from "./Alert"

const Messenger: FC = () => {
  const messageState = useSelector((state: RootState) => state.message)

  const dispatch = useDispatch<AppDispatch>()

  // auto dismiss messages after 6 seconds
  useEffect(() => {
    if (messageState.open) {
      setTimeout(() => dispatch(closeMessage()), 6000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageState.open])

  return (
    <div className="fixed bottom-8 left-8 w-full">
      {messageState.open && (
        <Alert
          severity={messageState.message.severity}
          message={messageState.message.content}
        />
      )}
    </div>
  )
}

export default Messenger
