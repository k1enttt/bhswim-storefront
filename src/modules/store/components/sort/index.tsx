import { sortByOptions } from "@lib/data/constants"

const Sort = () => {
  return (
    <div className="w-full rounded-lg bg-white flex items-center justify-end gap-2">
      <div>Sắp xếp theo</div>
      <select
        name="sortBy"
        id="sortby"
        className="w-36 h-10 bg-gray-200 rounded-md p-2"
      >
        {sortByOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Sort
