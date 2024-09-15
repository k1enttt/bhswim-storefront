import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"

const Search = ({className}: {className?: string}) => {
  return <div className={clx("p-1 flex items-center justify-center", className)}>
    <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
  </div>
}

export default Search