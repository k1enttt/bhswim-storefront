import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"

const Cart = ({ className }: { className?: string }) => {
  return <div className={clx("w-8 h-8 p-1", className)}>
    <FontAwesomeIcon icon={faCartShopping} className="w-full h-full" />
  </div>
}

export default Cart
