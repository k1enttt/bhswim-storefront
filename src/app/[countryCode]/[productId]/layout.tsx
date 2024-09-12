import BackButton from "@modules/common/components/back-button"
import Cart from "@modules/layout/components/cart"
import Logo from "@modules/layout/components/logo"
import Search from "@modules/layout/components/search"

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="relative p-3 space-y-2">
      <div className="flex items-center">
        <div className="flex-1 h-full flex items-center">
          <BackButton className="" />
        </div>
        <Logo className="flex-1" />
        <div className="flex-1 flex items-center justify-end">
          <Search className="" />
          <Cart className="" />
        </div>
      </div>
      {props.children}
    </div>
  )
}
