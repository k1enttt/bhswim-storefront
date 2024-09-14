"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button, clx } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"

import MyMobileActions from "../mobile-actions/my-index"
import MyProductPrice from "../product-price/my-index"
import MyOptionSelect from "../option-select/my-index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faQuestion,
  faTruck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import Quantity from "../quantity"
import ShippingAddress from "../shipping-addess"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
  disabled?: boolean
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function MyProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const countryCode = useParams().countryCode as string

  const variants = product.variants

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }

    setOptions(optionObj)
  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (variant && !variant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (variant && variant.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (variant?.inventory_quantity && variant.inventory_quantity > 0) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: variant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <MyOptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <MyProductPrice product={product} variant={variant} region={region} />

        <div className="flex gap-1">
          <div>
            <Quantity
              disabled={!inStock || !variant || !!disabled || isAdding}
              variant={variant}
              quantityState={{ quantity, setQuantity }}
            />
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !variant || !!disabled || isAdding}
            variant="primary"
            className="w-full h-10"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!variant
              ? "Chọn biến thể"
              : !inStock
              ? "Hết hàng"
              : "Thêm vào giỏ hàng"}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex gap-1 items-center">
            <FontAwesomeIcon
              icon={!variant ? faQuestion : inStock ? faCheck : faXmark}
              color={!variant ? "blue" : inStock ? "#70e000" : "red"}
              className="w-5 h-5"
            />
            <div>
              <span>Trạng thái: </span>
              <span
                className={clx(
                  "font-semibold",
                  variant ? "text-black" : "text-gray-500"
                )}
              >
                {!variant
                  ? "Chưa chọn biến thể"
                  : inStock
                  ? "Còn hàng"
                  : "Hết hàng"}
              </span>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <FontAwesomeIcon
              icon={faTruck}
              color="#0077b6"
              className="w-5 h-5"
            />
            <div>
              <span>Thời gian vận chuyển: </span>
              <span className="font-semibold">8-12 ngày</span>
            </div>
          </div>
          {/* <ShippingAddress /> */}
        </div>

        <MyMobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
