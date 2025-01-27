import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Country as CountryType } from "../../../common/types/country"

export function Country() {
    const { id } = useParams<{ id: string }>()
    const [country, setCountry] = useState<CountryType | null>(null)

    useEffect(() => {
        async function fetchCountry() {
            try {
                const response = await fetch(`http://localhost:3001/countries/${id}`)

                if (!response.ok) {
                    throw new Error("Country not found")
                }

                const data = await response.json()
                setCountry(data)
            } catch (error) {
                console.error("Error fetching country:", error)
            }
        }

        fetchCountry()
    }, [id])

    if (!country) {
        return <div>Loading...</div>
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">{country.country}</h1>
            <p className="text-xl mb-2">Country Code: {country.countryisocode}</p>
        </div>
    )
}

