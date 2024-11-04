"use server"

import { cookies } from "next/headers"

import {
  addShippingMethod,
  completeCart,
  deleteDiscount,
  setPaymentSession,
  updateCart,
} from "@lib/data"
import {
  AddressPayload,
  GiftCard,
  StorePostCartsCartReq,
} from "@medusajs/medusa"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { CheckoutRequestType } from "@payos/node/lib/type"
import { payOS } from "@lib/config"

const X_PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function cartUpdate(data: StorePostCartsCartReq) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return "No cartId cookie found"

  try {
    await updateCart(cartId, data)
    revalidateTag("cart")
  } catch (error: any) {
    return error.toString()
  }
}

export async function applyDiscount(code: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return "No cartId cookie found"

  try {
    await updateCart(cartId, { discounts: [{ code }] }).then(() => {
      revalidateTag("cart")
    })
  } catch (error: any) {
    throw error
  }
}

export async function applyGiftCard(code: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return "No cartId cookie found"

  try {
    await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
      revalidateTag("cart")
    })
  } catch (error: any) {
    throw error
  }
}

export async function removeDiscount(code: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return "No cartId cookie found"

  try {
    await deleteDiscount(cartId, code)
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: GiftCard[]
) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return "No cartId cookie found"

  try {
    await updateCart(cartId, {
      gift_cards: [...giftCards]
        .filter((gc) => gc.code !== codeToRemove)
        .map((gc) => ({ code: gc.code })),
    }).then(() => {
      revalidateTag("cart")
    })
  } catch (error: any) {
    throw error
  }
}

export async function submitDiscountForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string

  try {
    await applyDiscount(code).catch(async (err) => {
      await applyGiftCard(code)
    })
    return null
  } catch (error: any) {
    return error.toString()
  }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  if (!formData) return "No form data received"

  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return { message: "No cartId cookie found" }

  const data = {
    shipping_address: {
      first_name: formData.get("shipping_address.first_name"),
      last_name: formData.get("shipping_address.last_name"),
      address_1: formData.get("shipping_address.address_1"),
      address_2: "",
      company: formData.get("shipping_address.company"),
      postal_code: formData.get("shipping_address.postal_code"),
      city: formData.get("shipping_address.city"),
      country_code: formData.get("shipping_address.country_code"),
      province: formData.get("shipping_address.province"),
      phone: formData.get("shipping_address.phone"),
    },
    email: formData.get("email"),
  } as StorePostCartsCartReq

  const sameAsBilling = formData.get("same_as_billing")

  if (sameAsBilling === "on") data.billing_address = data.shipping_address

  if (sameAsBilling !== "on")
    data.billing_address = {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      address_1: formData.get("billing_address.address_1"),
      address_2: "",
      company: formData.get("billing_address.company"),
      postal_code: formData.get("billing_address.postal_code"),
      city: formData.get("billing_address.city"),
      country_code: formData.get("billing_address.country_code"),
      province: formData.get("billing_address.province"),
      phone: formData.get("billing_address.phone"),
    } as StorePostCartsCartReq

  try {
    await updateCart(cartId, data)
    revalidateTag("cart")
  } catch (error: any) {
    return error.toString()
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

export async function setMyAddresses(formData: any) {
  if (!formData) return "No form data received"

  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) return { message: "No cartId cookie found" }

  const data = {
    shipping_address: {
      first_name: formData["shipping_address.first_name"],
      last_name: formData["shipping_address.last_name"],
      address_1: formData["shipping_address.address_1"],
      address_2: "",
      company: formData["shipping_address.company"],
      postal_code: formData["shipping_address.postal_code"],
      city: formData["shipping_address.city"],
      country_code: formData["shipping_address.country_code"],
      province: formData["shipping_address.province"],
      phone: formData["shipping_address.phone"],
      metadata: formData["shipping_address.metadata"],
    },
    email: formData["email"],
  } as StorePostCartsCartReq

  data.billing_address = data.shipping_address

  try {
    await updateCart(cartId, data)
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }
}

export async function setShippingMethod(shippingMethodId: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  try {
    await addShippingMethod({ cartId, shippingMethodId })
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }
}

async function updateVietQRPayment(value: boolean) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  try {
    const cart = await updateCart(cartId, {
      shipping_address: {
        metadata: {
          isVietQRPayment: value,
        },
      },
    })
    revalidateTag("cart")
    return cart
  } catch (error) {
    throw error
  }
}

export async function updatePaymentStatus(value: boolean) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  try {
    const cart = await updateCart(cartId, {
      shipping_address: {
        metadata: {
          isPaymentCompleted: value,
        },
      },
    })
    revalidateTag("cart")
    return cart
  } catch (error) {
    throw error
  }
}

export async function setPaymentMethod(providerId: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  try {
    if (providerId != "vietqr") {
      const cart = await setPaymentSession({ cartId, providerId }).then(
        async () => {
          const cart = await updateVietQRPayment(false)
          return cart
        }
      )
      revalidateTag("cart")
      return cart
    } else {
      const cart = await updateVietQRPayment(true)
      revalidateTag("cart")
      return cart
    }
  } catch (error: any) {
    throw error
  }
}

export async function placeOrder() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  let cart

  try {
    cart = await completeCart(cartId)
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }

  if (cart?.type === "order") {
    const countryCode = cart.data.shipping_address?.country_code?.toLowerCase()
    cookies().set("_medusa_cart_id", "", { maxAge: -1 })
    redirect(`/${countryCode}/order/confirmed/${cart?.data.id}`)
  }

  return cart
}

export async function placeMyOrder(paymentId: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  let cart

  try {
    cart = await completeCart(cartId)
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }

  if (cart?.type === "order") {
    const countryCode = cart.data.shipping_address?.country_code?.toLowerCase()
    cookies().set("_medusa_cart_id", "", { maxAge: -1 })

    try {
      if (paymentId == "vietqr") {
        await setPaymentCaptured(cart?.data.id)
      }
    } catch (error) {
      throw error
    }

    redirect(`/${countryCode}/order/confirmed/${cart?.data.id}`)
  }

  return cart
}

export async function setPaymentCaptured(orderId: string) {
  const LOCAL_BACKEND_URL = "http://localhost:9000"
  const PUBLIC_BACKEND_URL = "https://bhswimbackend.kienttt.site"
  try {
    await fetch(
      `${LOCAL_BACKEND_URL}/store/custom/order/${orderId}/capture/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error: any) {
    throw new Error(error)
  }
}

export const createVietQRPaymentLink = async ({
  amount,
  description,
  items,
}: {
  amount: number
  description: string
  items: { name: string; quantity: number; price: number }[]
}) => {
  const countryCode = cookies().get("country_code")?.value || "us"
  const pathname = "https://bhswimstorefront.kienttt.site"

  const body: CheckoutRequestType = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: amount,
    description: description,
    items: items,
    returnUrl: `${pathname}/${countryCode}/checkout`,
    cancelUrl: `${pathname}/${countryCode}/checkout`,
  }

  try {
    const response = await payOS.createPaymentLink(body)
    return { checkoutUrl: response.checkoutUrl }
  } catch (error) {
    console.error(error)
    throw error
  }
}
