import { Suspense } from "react"

import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MySideMenu from "@modules/layout/components/side-menu/my-index"
import CartIcon from "@modules/common/components/cart-icon"
import MyCartButton from "@modules/layout/components/cart-button/my-index"
import Logo from "@modules/layout/components/logo"
import Search from "@modules/layout/components/search"
import User from "@modules/common/icons/user"

export default async function MyNav() {
  const regions = await listRegions().then((regions) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-12 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <MySideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <Logo />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <div className="px-2">
                <User size={24} /></div>
              </LocalizedClientLink>
            </div>
            <div className="flex items-center gap-x-2">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  <Search />
                </LocalizedClientLink>
              )}
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
          </div>
        </nav>
      </header>
    </div>
  )
}
