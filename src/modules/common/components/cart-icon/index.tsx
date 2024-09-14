import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CartIcon = ({ totalItems }: { totalItems: number }) => {
  return (
    <>
      <FontAwesomeIcon icon={faCartShopping} className="w-6 h-6" />
      <div className="absolute top-[-12px] right-[-12px] rounded-full w-6 h-6 bg-white/90 border border-black">
        <span className="text-sm">{totalItems}</span>
      </div>
    </>
  )
}

export default CartIcon
