import { useSearch } from "../context/SearchContext"

export function SearchInput() {
    const { searchQuery, setSearchQuery } = useSearch()

    return (
        <div className="form">
            <i className="fa fa-search"></i>
            <input
                type="text"
                className="form-control form-input "
                placeholder="Search accommodation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <span className="left-pan" onClick={() => setSearchQuery("")}>
                    <i className="fa fa-close"></i>
                </span>
            )}
        </div>
    )
}
