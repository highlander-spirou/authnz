export const getLocationFromOSM = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

  try {
    const response = await fetch(url)
    const data = await response.json()

    // Extracting necessary details
    const district = data.address.suburb || null
    const city =
      data.address.city || data.address.town || data.address.village || null

    return { district, city }
  } catch (error) {
    console.error("Error fetching location from OSM:", error)
    return null
  }
}
