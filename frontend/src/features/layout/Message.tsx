import { FC, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import type { RootState, AppDispatch } from "../../store/store"
import { closeMessage } from "../../store/messageSlice"
import Alert from "./Alert"

// styles
const MessageContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing[8]};
  left: ${({ theme }) => theme.spacing[8]};
  width: 100%;
`

const Message: FC = () => {
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
    <MessageContainer>
      {messageState.open && (
        <Alert
          severity={messageState.message.severity}
          message={messageState.message.content}
        />
      )}
    </MessageContainer>
  )
}

export default Message
