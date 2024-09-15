import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Suspense } from "react"
import CartButton from "../cart-button"
import CartIcon from "@modules/common/components/cart-icon"
import MyCartButton from "../cart-button/my-index"

const Cart = ({ className }: { className?: string }) => {
  return (
    <div className={clx("w-10 h-10 p-1 flex items-center justify-center", className)}>
      <Suspense
        fallback={
          <LocalizedClientLink
            className="hover:text-ui-fg-base flex gap-2"
            href="/checkout"
            data-testid="nav-cart-link"
          >
            <CartIcon totalItems={0} />  
          </LocalizedClientLink>
        }
      >
        <MyCartButton />
      </Suspense>
    </div>
  )
}

export default Cart


