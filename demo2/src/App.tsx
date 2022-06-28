import {useEffect, useState} from 'react'
import * as L from 'leaflet'
import { Layer } from 'leaflet'
import { Feature } from 'geojson';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'

function App() {
    const [map, setMap] = useState({
        geoJSON: null,
        reference: null,
    })

    useEffect( () => {
        fetch('/data/ubicaciones-fuentes-agua-potable-EPSG4326-v1.0.0.json')
          .then(response => response.json())
          .then(data => { setMap({
              geoJSON: data,
              reference: null,
          })})
    }, [])

    const position = {
        lat: 36.51672,
        lng: -6.2891
    }

    const mapStyle = {
      height: '100vh'
    }

    const featureStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    }

    const onEachFeature = (feature:Feature, layer:Layer) => {
        if (feature.properties?.DES) {
          layer.bindTooltip(feature.properties.DES)
        }
    }

    return (
      <div className="container">
          <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom={true}
            style={mapStyle}
            crs={L.CRS.EPSG3857}
          >
              {map.geoJSON && (
                <GeoJSON
                  key={'mapa-geojson-2'}
                  attribution={'Ayuntamiento de Cádiz'}
                  data={map.geoJSON}
                  style={featureStyle}
                  onEachFeature={onEachFeature}
                />
              )}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
      </div>
    )
}

export default App

