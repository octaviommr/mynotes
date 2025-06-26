import { FC, ReactNode } from "react"
import styled from "styled-components"
import Header from "./header/Header"
import Message from "./message/Message"
import Modal from "./modal/Modal"

interface LayoutProps {
  children: ReactNode
}

// styles
const LayoutContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const ContentContainer = styled.main`
  flex: 1;
  overflow: auto;
`

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <LayoutContainer>
        <Header />
        <ContentContainer>{children}</ContentContainer>
      </LayoutContainer>
      <Message />
      <Modal />
    </>
  )
}

export default Layout
