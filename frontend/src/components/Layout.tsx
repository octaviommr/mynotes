import { FC, ReactNode } from "react"
import Messenger from "../features/messenger/Messenger"
import Header from "../features/header/Header"

type LayoutProps = {
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
    </>
  )
}

export default Layout
