import { FC, ReactNode } from "react"
import Messenger from "../features/messages/Messenger"
import Header from "../features/header/Header"
import ModalPresenter from "../features/modals/ModalPresenter"

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-full flex-col">
        <Header />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      <Messenger />
      <ModalPresenter />
    </>
  )
}

export default Layout
