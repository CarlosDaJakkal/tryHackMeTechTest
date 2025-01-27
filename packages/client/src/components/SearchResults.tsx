import { Link } from "react-router-dom"
import { useSearch } from "../context/SearchContext"
import { useApi } from "../hooks/useApi"
import { ReactNode } from "react";
import { CityCollection, CountryCollection, HotelCollection } from "../../../common/types/collectionTypes";

function ResultSection({
    title,
    items,
    renderItem,
}: {
    title: string;
    items: any[];
    renderItem: (item: any) => ReactNode
}) {
    return (
        <>
            <h2>{title}</h2>
            {items.length ? (
                <ul className="list-group list-group-flush">
                    {items.map((item, index) => (
                        <li key={index}>{renderItem(item)}</li>
                    ))}
                </ul>
            ) : (
                <p>No {title.toLowerCase()} matched</p>
            )}
        </>
    )
}

export function SearchResults() {
    const { searchQuery } = useSearch()
    const { data: hotels } = useApi<HotelCollection>("/hotels", searchQuery)
    const { data: countries } = useApi<CountryCollection>("/countries", searchQuery)
    const { data: cities } = useApi<CityCollection>("/cities", searchQuery)

    if (!searchQuery) return null

    return (
        <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
            <ResultSection
                title="Hotels"
                items={hotels}
                renderItem={(hotel: HotelCollection) => (
                    <>
                        <Link to={`/hotels/${hotel._id}`} className="dropdown-item">
                            <i className="fa fa-building mr-2"></i>
                            {hotel.hotel_name}
                        </Link>
                        <hr className="divider" />
                    </>
                )}
            />
            <ResultSection
                title="Countries"
                items={countries}
                renderItem={(country: CountryCollection) => (
                    <>
                        <Link to={`/countries/${country._id}`} className="dropdown-item">
                            <i className="fa fa-map-pin mr-2"></i>
                            {country.country} ({country.countryisocode})
                        </Link>
                        <hr className="divider" />
                    </>
                )}
            />
            <ResultSection
                title="Cities"
                items={cities}
                renderItem={(city: CityCollection) => (
                    <>
                        <Link to={`/cities/${city._id}`} className="dropdown-item">
                            <i className="fa fa-map-pin mr-2"></i>
                            {city.name}
                        </Link>
                        <hr className="divider" />
                    </>
                )}
            />
        </div>
    )
}
