/**
 * Malaybalay City, Bukidnon coordinates and boundaries
 * For MVP: mock random location within Malaybalay City
 */
const MALAYBALAY_CITY_BOUNDS = {
  // Approximate bounds for Malaybalay City, Bukidnon
  north: 8.2000,
  south: 8.1100,
  east: 125.1600,
  west: 125.0900,
  center: {
    latitude: 8.1584,
    longitude: 125.1281,
  },
}

/**
 * Get mock random GPS location within Malaybalay City
 * Returns object with latitude and longitude
 */
export function getMockGPSLocation() {
  const lat =
    MALAYBALAY_CITY_BOUNDS.south +
    Math.random() *
      (MALAYBALAY_CITY_BOUNDS.north - MALAYBALAY_CITY_BOUNDS.south)

  const lon =
    MALAYBALAY_CITY_BOUNDS.west +
    Math.random() *
      (MALAYBALAY_CITY_BOUNDS.east - MALAYBALAY_CITY_BOUNDS.west)

  return {
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lon.toFixed(6)),
  }
}

/**
 * Get Malaybalay City center coordinates
 */
export function getMalaybalayCityCenter() {
  return MALAYBALAY_CITY_BOUNDS.center
}

/**
 * Try to get real GPS location (for future enhancement)
 * Falls back to mock location if not available
 */
export async function getRealOrMockGPSLocation() {
  try {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using mock location')
      return getMockGPSLocation()
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          console.log('Geolocation error, using mock location:', error)
          // Fall back to mock location
          resolve(getMockGPSLocation())
        },
        {
          timeout: 5000,
          enableHighAccuracy: false,
        }
      )
    })
  } catch (error) {
    console.error('Error getting GPS location:', error)
    return getMockGPSLocation()
  }
}
