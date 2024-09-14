"use client"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import { clx } from "@medusajs/ui"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

const Quantity = ({
  disabled,
  variant,
  quantityState
}: {
  disabled?: boolean
  variant: PricedVariant | undefined
  quantityState: {
    quantity: number
    setQuantity: Dispatch<SetStateAction<number>>
  }
}) => {
  const [quantity, setQuantity] = [quantityState.quantity, quantityState.setQuantity]
  const inventoryQuantity = variant?.inventory_quantity
  const isMaxQuantity = inventoryQuantity === quantity
  const isMinQuantity = quantity === 1

  const handleIncrease = () => {
    if (inventoryQuantity) {
      quantity < inventoryQuantity && setQuantity(quantity + 1)
    } else {
      quantity < 1 && setQuantity(quantity + 1)
    }
  }
  const handleDecrease = () => {
    quantity > 1 && setQuantity(quantity - 1)
  }

  useEffect(() => {
    if (variant) {
      setQuantity(1)
    }
  }, [variant])
  return (
    <div className="w-24 h-10 border border-gray-200 rounded-md p-1 text-sm flex items-center justify-between">
      <button
        disabled={disabled || isMinQuantity}
        className={clx(
          "flex-1 flex items-center justify-center p-1",
          disabled || isMinQuantity ? "text-black/30" : "text-black"
        )}
        onClick={handleDecrease}
      >
        <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
      </button>
      <div className="flex-1 w-4 text-center">{quantity}</div>
      <button
        disabled={disabled || isMaxQuantity}
        className={clx(
          "flex-1 flex items-center justify-center p-1",
          disabled || isMaxQuantity ? "text-black/30" : "text-black"
        )}
        onClick={handleIncrease}
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Quantity
