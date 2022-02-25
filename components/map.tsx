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
      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4))
        setLat(map.current.getCenter().lat.toFixed(4))
        setZoom(map.current.getZoom().toFixed(2))
      })
      map.current.on('click', (event) => {
        const features = map.current.queryRenderedFeatures(event.point, {
          layers: ['points'],
        })
        if (!features.length) {
          return
        }
        const feature = features[0]

        const popup = new mapboxgl.Popup({ offset: [0, -15] })
          .setLngLat(feature.geometry.coordinates)
          .setHTML(
            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`,
          )
          .addTo(map.current)
      })
      map.current.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error
          map.current.addImage('custom-marker', image)
          // Add a GeoJSON source with 2 points
          map.current.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: window.PLACES.map((place) => ({
                // feature for Mapbox SF
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [place.formdata.lng, place.formdata.lat],
                },
                properties: {
                  title: place.formdata.name,
                  description: 'miejsce',
                },
              })),
            },
          })

          // Add a symbol layer
          map.current.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
            },
          })
        },
      )
    }
  }, [setLat, setLng, setZoom, lat, lng, zoom])

  return (
    <div style={{ height: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%' }} />
    </div>
  )
}
