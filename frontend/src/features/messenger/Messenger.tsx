import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../store"
import { closeMessage } from "./messageSlice"
import Alert from "./Alert"

const Messenger = () => {
  const { open, config } = useSelector((state: RootState) => state.message)

  const dispatch = useDispatch<AppDispatch>()

  // auto dismiss messages after 6 seconds
  useEffect(() => {
    if (open) {
      setTimeout(() => dispatch(closeMessage()), 6000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className="fixed bottom-4 left-4 w-full">
      {open && <Alert severity={config!.severity} message={config!.message} />}
    </div>
  )
}

export default Messenger
