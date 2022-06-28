import {useEffect, useState} from 'react'
import * as L from 'leaflet'
import {geoJSON, Layer} from 'leaflet'
import { Feature } from 'geojson';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'

function App() {
    const [map, setMap] = useState({
        geoJSON: null,
        reference: null,
    })

    const [maxDensity, setMaxDensity] = useState(0);

    useEffect( () => {
        fetch('/data/cartografia_secciones_cadiz_2022.json')
          .then(response => response.json())
          .then(data => { setMap({
                geoJSON: data,
                reference: null,
          })})
    }, [])

    //setMaxDensity(map.geoJSON.features.reduce((p, c) => p.properties.DEN > c.properties.DEN ? p : c))
    //console.log(map.geoJSON.features.reduce((p, c) => p.properties.DEN > c.properties.DEN ? p : c))

    const position = {
        lat: 36.51672,
        lng: -6.2891
    }

    const mapStyle = {
      height: '100vh'
    }

    const featureStyle = (feature: any) => ({
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillColor: '#ff0000',
        fillOpacity: feature.properties?.DEN.replace(/,/g, '.') / 34884.61
    })

    const onEachFeature = (feature:Feature, layer:Layer) => {
        if (feature.properties?.DEN) {
            layer.bindTooltip(`Extensión: ${feature.properties.EXT.replace(/,/g, '.')} km2 | Población: ${feature.properties.POB.replace(/,/g, '.')} hab. | Densidad de población: ${feature.properties.DEN.replace(/,/g, '.')} hab/km2`);
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
                  key={'mapa-geojson-1'}
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

