"use client"

import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text, clx } from "@medusajs/ui"

import CartItemSelect from "@modules/cart/components/cart-item-select"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { deleteLineItem, updateLineItem } from "@modules/cart/actions"
import Spinner from "@modules/common/icons/spinner"
import { useRef, useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MyLineItemOptions from "@modules/common/components/line-item-options/my-index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import MyLineItemPrice from "@modules/common/components/line-item-price/my-index"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
  type?: "full" | "preview"
}

const MyItem = ({ item, region, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(item.quantity)
  const [disabled, setDisabled] = useState(false)
  // The below variable is used to determine if the item is being deleted
  const [deleting, setDeleting] = useState(false)
  const [swipePosition, setSwipePosition] = useState(0)
  const startX = useRef(0)

  const { handle } = item.variant.product

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    const message = await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        return err.message
      })
      .finally(() => {
        setUpdating(false)
      })

    message && setError(message)
  }

  const onChangeComplete = async (updatedValue: number) => {
    await changeQuantity(updatedValue).then(() => {
      setDisabled(false)
    })
  }

  const handleDecrease = () => {
    setDisabled(true)
    if (quantity > 1) {
      const updatedValue = quantity - 1
      setQuantity(updatedValue)
      onChangeComplete(updatedValue)
    } else {
      handleDelete(item.id)
    }
  }

  const handleIncrease = () => {
    setDisabled(true)
    if (quantity < 10) {
      const updatedValue = quantity + 1
      setQuantity(updatedValue)
      onChangeComplete(updatedValue)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteLineItem(id).catch((err) => {
      setDeleting(false)
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX
    const deltaX = touchX - startX.current
    if (deltaX < 0) {
      setSwipePosition(Math.max(deltaX, -80))
    }
  }

  const handleTouchEnd = () => {
    if (swipePosition < -50) {
      setDeleting(true)
      handleDelete(item.id)
    }
    setSwipePosition(0)
  }

  return (
    <Table.Row
      className={clx(
        "relative overflow-hidden w-full",
        deleting && "opacity-50 pointer-events-none"
      )}
      data-testid="product-row"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* The red delete button at the background */}
      <Table.Cell className="absolute inset-0 h-full flex items-center justify-end bg-red-500 text-white">
        <FontAwesomeIcon icon={faTrash} className="mr-4" />
      </Table.Cell>
      {/* The white background of the item */}
      <Table.Cell
        className="absolute inset-0 h-full flex items-center justify-end bg-white"
        style={{ transform: `translateX(${swipePosition}px)` }}
      ></Table.Cell>
      {/* Item contents */}
      <Table.Cell
        className="!pl-0 p-4 w-24"
        style={{ transform: `translateX(${swipePosition}px)` }}
      >
        <LocalizedClientLink
          href={`/products/${handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell
        className="text-left"
        style={{ transform: `translateX(${swipePosition}px)` }}
      >
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.title}
        </Text>
        <MyLineItemOptions
          variant={item.variant}
          data-testid="product-variant"
        />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: Math.min(
                    item.variant.inventory_quantity > 0
                      ? item.variant.inventory_quantity
                      : 10,
                    10
                  ),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice item={item} region={region} style="tight" />
        </Table.Cell>
      )}

      <Table.Cell
        className="!pr-0"
        style={{ transform: `translateX(${swipePosition}px)` }}
      >
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <div
              className={clx(
                "flex items-center space-x-2",
                disabled ? "opacity-50" : ""
              )}
            >
              <button
                onClick={handleDecrease}
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={quantity <= 0 || disabled}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="px-2">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={quantity >= 10 || disabled}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          )}
          <MyLineItemPrice item={item} region={region} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default MyItem
