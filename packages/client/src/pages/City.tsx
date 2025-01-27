import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { City as CityType } from "../../../common/types/city"

export function City() {
    const { id } = useParams<{ id: string }>()
    const [city, setCity] = useState<CityType | null>(null)

    useEffect(() => {
        async function fetchCity() {
            try {
                const response = await fetch(`http://localhost:3001/cities/${id}`)

                if (!response.ok) {
                    throw new Error("City not found")
                }

                const data = await response.json()
                setCity(data)
            } catch (error) {
                console.error("Error fetching city:", error)
            }
        }

        fetchCity()
    }, [id])

    if (!city) {
        return <div>Loading...</div>
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">{city.name}</h1>
        </div>
    )
}

