import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN =
  'pk.eyJ1IjoibHVjamFuc3Vza2kiLCJhIjoiY2wwMWhoeXQ4MG1oODNpbWV2OXJubWU3dCJ9.jmOsK1sdt5OkeKVpB7v8YQ'

export default function Map() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  // Wroclaw by default
  const [lng, setLng] = useState(17.0385)
  const [lat, setLat] = useState(51.1079)
  const [zoom, setZoom] = useState(9)
  useEffect(() => {
    if (map.current == null) {
      map.current = new mapboxgl.Map({
        accessToken: TOKEN,
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      })
    }
  })
  useEffect(() => {
    if (map.current) {
      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4))
        setLat(map.current.getCenter().lat.toFixed(4))
        setZoom(map.current.getZoom().toFixed(2))
      })
    }
  })

  return (
    <div style={{ height: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%' }} />
    </div>
  )
}
