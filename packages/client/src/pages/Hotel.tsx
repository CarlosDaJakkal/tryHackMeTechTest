import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Hotel as HotelType } from "../../../common/types/hotel"

export function Hotel() {
    const { id } = useParams<{ id: string }>()
    const [hotel, setHotel] = useState<HotelType | null>(null)

    useEffect(() => {
        async function fetchHotel() {
            try {
                const response = await fetch(`http://localhost:3001/hotels/${id}`)

                if (!response.ok) {
                    throw new Error("Hotel not found")
                }

                const data = await response.json()

                setHotel(data)
            } catch (error) {
                console.error("Error fetching hotel:", error)
            }
        }

        fetchHotel()
    }, [id])

    if (!hotel) {
        return <div>Loading...</div>
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">{hotel.hotel_name}</h1>
            <p className="text-xl mb-2">{hotel.chain_name}</p>
            <p className="text-lg">
                {hotel.city}, {hotel.country}
            </p>
        </div>
    )
}

