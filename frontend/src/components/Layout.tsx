import { FC, ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full flex-col">
      <div>Header</div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

export default Layout
