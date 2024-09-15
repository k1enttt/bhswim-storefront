import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import MyNav from "@modules/layout/templates/nav/my-index"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8001"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <MyNav />
      {props.children}
      <Footer />
    </>
  )
}
