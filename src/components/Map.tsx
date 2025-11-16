
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import toGeoJSON from '@mapbox/togeojson';
import { Sauna } from '../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  listedSaunas: Sauna[];
  onListedSaunaClick: (saunaId: number) => void;
    visitedSaunaIds?: number[];
    userLocation?: { latitude: number; longitude: number } | null;
    centerSignal?: number;
}

const Map = ({ listedSaunas, onListedSaunaClick, visitedSaunaIds = [], userLocation = null, centerSignal }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(24.93);
  const [lat, setLat] = useState(60.17);
  const [zoom, setZoom] = useState(9);

    const createListedSaunasGeoJSON = (saunas: Sauna[], visitedIds: number[] = []): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
        type: 'FeatureCollection',
        features: saunas.map(sauna => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [sauna.longitude, sauna.latitude]
            },
            properties: {
                id: sauna.id,
                name: sauna.name,
                visited: visitedIds.includes(sauna.id),
                description: `
                    <div style="min-width:180px;max-width:220px;">
                        <div style="font-weight:bold;font-size:1.1em;">${sauna.name}</div>
                        <div style="color:#6D5A47;font-size:0.95em;">${sauna.address}</div>
                        <div style="margin-top:4px;font-size:0.95em;">
                            <span style="color:#3E2723;">${sauna.distance}</span> &bull; 
                            <span style="color:#8B7355;">⭐ ${sauna.rating} (${sauna.reviews})</span>
                        </div>
                        <div style="margin-top:2px;font-size:0.92em;">
                            <span style="color:${sauna.available ? '#228B22' : '#888'};font-weight:bold;">${sauna.available ? 'Available' : 'Full'}</span>
                            <span style="margin-left:8px;">${sauna.capacity}</span>
                        </div>
                    </div>
                `
            }
        }))
    });

    useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      attributionControl: false,
      zoom: zoom
    });

    map.current.on('move', () => {
        if(map.current) {
            setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current.getZoom().toFixed(2)));
        }
    });

    map.current.on('load', async () => {
        if(map.current) {
            const response = await fetch('/visitsauna.com.kml');
            const text = await response.text();
            const kml = new DOMParser().parseFromString(text, 'text/xml');
            const geojson = toGeoJSON.kml(kml);
            
            map.current.addSource('saunas', {
                type: 'geojson',
                data: geojson
            });
    
            map.current.addLayer({
                'id': 'sauna-locations',
                'type': 'circle',
                'source': 'saunas',
                'paint': {
                    'circle-radius': 6,
                    'circle-color': 'rgba(128, 128, 128, 0.7)'
                }
            });

            map.current.addSource('listed-saunas', {
                type: 'geojson',
                data: createListedSaunasGeoJSON(listedSaunas, visitedSaunaIds)
            });

            map.current.addLayer({
                'id': 'listed-sauna-locations',
                'type': 'circle',
                'source': 'listed-saunas',
                'paint': {
                    'circle-radius': ['case', ['==', ['get', 'visited'], true], 10, 8] as any,
                    'circle-color': ['case', ['==', ['get', 'visited'], true], '#4CAF50', 'rgba(63, 40, 5, 1)'] as any
                }
            });

            const setupInteractions = (layerId: string, onClick?: (properties: any) => void) => {
                if (!map.current) return;
                const currentMap = map.current;
        
                currentMap.on('click', layerId, (e: mapboxgl.MapLayerMouseEvent) => {
                    if (!e.features || e.features.length === 0) return;
        
                    const feature = e.features[0];
                    const coordinates = (feature.geometry as any).coordinates.slice();
                    const properties = feature.properties;
        
                    if (onClick && properties) {
                        onClick(properties);
                    }
        
                    if (properties?.description) {
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(properties.description)
                            .addTo(currentMap);
                    }
                });
        
                currentMap.on('mouseenter', layerId, () => {
                    currentMap.getCanvas().style.cursor = 'pointer';
                });
        
                currentMap.on('mouseleave', layerId, () => {
                    currentMap.getCanvas().style.cursor = '';
                });
            }
            
            setupInteractions('sauna-locations');
            setupInteractions('listed-sauna-locations', (properties) => {
                if (properties.id) {
                    onListedSaunaClick(properties.id);
                }
            });

                        // add an initial empty user-location source + layer (will update when provided)
                        if (!map.current.getSource('user-location')) {
                                map.current.addSource('user-location', {
                                        type: 'geojson',
                                        data: {
                                                type: 'FeatureCollection',
                                                features: []
                                        }
                                } as any);

                                map.current.addLayer({
                                        id: 'user-location-layer',
                                        type: 'circle',
                                        source: 'user-location',
                                        paint: {
                                                'circle-radius': 10,
                                                'circle-color': '#007AFF',
                                                'circle-stroke-color': '#fff',
                                                'circle-stroke-width': 2
                                        }
                                } as any);
                        }
        }
    });
  });

    // Fly to user location when provided or when centerSignal increments
    useEffect(() => {
        if (!map.current || !userLocation) return;
        try {
            map.current.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 13 });
        } catch (e) {}
    // intentionally depend on centerSignal so clicking 'center' re-triggers even if coords same
    }, [userLocation, centerSignal]);

    // update or add user-location geojson when it changes
    useEffect(() => {
        if (!map.current) return;
        const src = map.current.getSource('user-location') as mapboxgl.GeoJSONSource | undefined;
        const geo = userLocation
            ? ({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [userLocation.longitude, userLocation.latitude] } }] } as GeoJSON.FeatureCollection)
            : ({ type: 'FeatureCollection', features: [] } as GeoJSON.FeatureCollection);

        if (src) {
            try {
                src.setData(geo as any);
            } catch (e) {}
        } else if (map.current && userLocation) {
            try {
                map.current.addSource('user-location', { type: 'geojson', data: geo } as any);
            } catch (e) {}
        }
    }, [userLocation]);

    // keep the listed-saunas source updated when props change
    useEffect(() => {
        if (!map.current) return;
        const src = map.current.getSource('listed-saunas') as mapboxgl.GeoJSONSource | undefined;
        if (src) {
            try {
                (src as mapboxgl.GeoJSONSource).setData(createListedSaunasGeoJSON(listedSaunas, visitedSaunaIds));
            } catch (e) {
                // ignore if source not ready
            }
        }
    }, [listedSaunas, visitedSaunaIds]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }}/>
    </div>
  );
};

export default Map;
