import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CartIcon = ({ totalItems }: { totalItems: number }) => {
  return (
    <div className="relative flex z-30">
      <FontAwesomeIcon icon={faCartShopping} size="2x" />
      <div className="absolute top-[-8px] right-[-10px] rounded-full w-5 h-5 bg-white/60 border border-black">
        <span className="text-sm font-semibold leading-tight">{totalItems}</span>
      </div>
    </div>
  )
}

export default CartIcon
