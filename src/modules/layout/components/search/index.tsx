import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"

const Search = ({className}: {className?: string}) => {
  return <div className={clx("w-8 h-8 p-1", className)}>
    <FontAwesomeIcon icon={faSearch} className="w-full h-full" />
  </div>
}

export default Search