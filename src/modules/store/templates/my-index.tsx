import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Filter from "../components/filter"
import Sort from "../components/sort"
import Image from "next/image"

const sampleProducts = [
  {
    handle: "chan-vit-doi-dai-ist-fk30-lxl",
    title: "CHÂN VỊT ĐÔI DÀI IST FK30-L/XL",
    priceVnd: 650000,
    thumbnail:
      "https://bhswim.com/images/thumbs/0002556_chan-vit-doi-dai-ist-fk30-lxl.jpeg",
  },
  {
    handle:
      "day-keo-tay-tren-can-khang-luc-boi-loi-nguoi-lon-strechcordz-with-handles-s100",
    title:
      "Dây kéo tay trên cạn kháng lực bơi lội Người lớn StrechCordz with Handles S100",
    priceVnd: 1095000,
    thumbnail:
      "https://bhswim.com/images/thumbs/0002216_day-keo-tay-tren-can-khang-luc-boi-loi-nguoi-lon-strechcordz-with-handles-s100.jpeg",
  },
  {
    handle: "kinh-boi-view-v500s",
    title: "Kính bơi View V500S",
    priceVnd: 295000,
    thumbnail:
      "https://bhswim.com/images/thumbs/0000913_kinh-boi-view-v500s.jpeg",
  },
  {
    handle: "kinh-boi-view-v550a",
    title: "Kính bơi View V550A",
    priceVnd: 345000,
    thumbnail:
      "https://bhswim.com/images/thumbs/0000871_kinh-boi-view-v550a.jpeg",
  },
]

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

  const handleFilterClick = () => {}

  return (
    <div className="content-container space-y-4 min-w-[500px]">
      {/* Filters */}
      <div>
        <Filter />
      </div>
      <div className="border-b border-b-gray-300"></div>
      {/* Sorts */}
      <div>
        <Sort />
      </div>
      <div className="border-b border-b-gray-300"></div>
      {/* Product grid - 20 products per page */}
      <div className="w-full grid grid-cols-2 gap-4">
        {sampleProducts.map((product) => (
          <div
            key={product.handle}
            className="w-full bg-orange-100 rounded-lg shadow-sm p-4 space-y-4"
          >
            <div className="relative w-full aspect-square flex items-center justify-center">
              <Image fill={true} src={product.thumbnail} alt={product.title} />
            </div>
            <div>
              <div className="title">{product.title}</div>
              <div className="price">{product.priceVnd}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}

      {/* Categories */}

      {/* Manufacturers */}
    </div>
  )
}

export default MyStoreTemplate
