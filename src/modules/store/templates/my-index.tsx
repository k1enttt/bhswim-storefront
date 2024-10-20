import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Filter from "../components/filter"

const MyStoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1

  const handleFilterClick = () => {

  }

  return (
    <div className="content-container">
      {/* Filters */}
      <Filter />

      {/* Sorts */}

      {/* Product grid - 20 products per page */}

      {/* Pagination */}

      {/* Categories */}

      {/* Manufacturers */}

    </div>
  )
}

export default MyStoreTemplate
