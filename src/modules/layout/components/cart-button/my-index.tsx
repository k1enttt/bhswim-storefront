import { LineItem } from "@medusajs/medusa"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "../cart-dropdown"
import MyCartDropdown from "../cart-dropdown/my-index"

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }

  return cart
}

export default async function MyCartButton() {
  const cart = await fetchCart()

  return <MyCartDropdown cart={cart} />
}
