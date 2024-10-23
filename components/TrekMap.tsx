'use client'

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { trekData, Destination } from '@/lib/trekData';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const TrekMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [showAllTooltips, setShowAllTooltips] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCSC30Ez6D5pDvIFoI4tEeMmAl_mX9btSY',
      version: 'weekly',
    });

    loader.load().then(() => {
      if (mapRef.current) {
        try {
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat: 28.2000, lng: 85.5000 },
            zoom: 11,
            mapTypeId: 'satellite',
            tilt: 45,
          });

          setMap(newMap);

          const bounds = new google.maps.LatLngBounds();
          const newMarkers: google.maps.Marker[] = [];
          const newInfoWindows: google.maps.InfoWindow[] = [];

          const addMarker = (location: Destination, index: number, isSubDestination: boolean = false, distance: string = '') => {
            const marker = new google.maps.Marker({
              position: { lat: location.lat, lng: location.lng },
              map: newMap,
              title: location.name,
              label: {
                text: `${location.name}\n${distance ? distance + 'km' : ''}`,
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                className: 'marker-label'
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: isSubDestination ? 6 : 10,
                fillColor: isSubDestination ? '#FF8C00' : '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              },
            });

            bounds.extend(marker.getPosition()!);
            newMarkers.push(marker);

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div>
                  <h3 class="font-bold">${location.name}</h3>
                  <p>Elevation: ${location.elevation}m</p>
                  ${location.description ? `<p>${location.description}</p>` : ''}
                  ${location.timeFromPrevious ? `<p>Time from previous: ${location.timeFromPrevious}</p>` : ''}
                  ${distance ? `<p>Distance from previous: ${distance}km</p>` : ''}
                </div>
              `,
            });
            newInfoWindows.push(infoWindow);

            marker.addListener('click', () => {
              newInfoWindows.forEach(iw => iw.close());
              infoWindow.open(newMap, marker);
            });
          };

          trekData.forEach((location, index) => {
            const distance = index > 0 ? calculateDistance(
              trekData[index - 1].lat, trekData[index - 1].lng,
              location.lat, location.lng
            ) : '';
            addMarker(location, index, false, distance);
          });

          setMarkers(newMarkers);
          setInfoWindows(newInfoWindows);

          // Main trek path
          const mainPath = new google.maps.Polyline({
            path: trekData.map(location => ({ lat: location.lat, lng: location.lng })),
            geodesic: true,
            strokeColor: '#4285F4',
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });
          mainPath.setMap(newMap);

          // Sub-destinations paths
          const lastDestination = trekData[trekData.length - 1];
          if (lastDestination.subDestinations) {
            lastDestination.subDestinations.forEach((subDest, index) => {
              const subPath = new google.maps.Polyline({
                path: [
                  { lat: lastDestination.lat, lng: lastDestination.lng },
                  { lat: subDest.lat, lng: subDest.lng },
                ],
                geodesic: true,
                strokeColor: index === 0 ? '#FFFF00' : '#FFA500', // Yellow for Tserko Ri, Orange for others
                strokeOpacity: 1.0,
                strokeWeight: 3,
              });
              subPath.setMap(newMap);

              const distance = calculateDistance(
                lastDestination.lat, lastDestination.lng,
                subDest.lat, subDest.lng
              );
              addMarker(subDest, index, true, distance);
            });

            // Additional line for Kyanjin Ri to Kyanjin Ri Peak
            const kyanjinRi = lastDestination.subDestinations[1];
            const kyanjinRiPeak = lastDestination.subDestinations[2];
            if (kyanjinRi && kyanjinRiPeak) {
              const peakPath = new google.maps.Polyline({
                path: [
                  { lat: kyanjinRi.lat, lng: kyanjinRi.lng },
                  { lat: kyanjinRiPeak.lat, lng: kyanjinRiPeak.lng },
                ],
                geodesic: true,
                strokeColor: '#FFA500',
                strokeOpacity: 1.0,
                strokeWeight: 3,
              });
              peakPath.setMap(newMap);
            }
          }

          newMap.fitBounds(bounds);

          // Add user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setUserLocation(pos);
                new google.maps.Marker({
                  position: pos,
                  map: newMap,
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/man.png',
                    scaledSize: new google.maps.Size(32, 32)
                  },
                  title: 'Your Location'
                });
                bounds.extend(pos);
                newMap.fitBounds(bounds);
              },
              () => {
                console.error('Error: The Geolocation service failed.');
              }
            );
          } else {
            console.error('Error: Your browser doesn\'t support geolocation.');
          }

        } catch (error) {
          console.error('Error initializing map:', error);
          setMapError('Failed to initialize the map. Please try again later.');
        }
      }
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      setMapError('Failed to load Google Maps. Please check your internet connection and try again.');
    });
  }, []);

  useEffect(() => {
    if (showAllTooltips) {
      infoWindows.forEach((infoWindow, index) => {
        infoWindow.open(map, markers[index]);
      });
    } else {
      infoWindows.forEach(infoWindow => infoWindow.close());
    }
  }, [showAllTooltips, map, markers, infoWindows]);

  const toggleTooltips = () => {
    setShowAllTooltips(!showAllTooltips);
  };

  if (mapError) {
    return <div className="w-full h-full flex items-center justify-center bg-red-100 rounded-lg shadow-lg text-red-600 p-4">{mapError}</div>;
  }

  return (
    <>
      <div className="relative w-full h-full">
        <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
        <div className="absolute bottom-1 left-2 z-10">
          <Button onClick={toggleTooltips} variant="outline" size="sm">
            {showAllTooltips ? <EyeOffIcon className="w-4 h-4 mr-2" /> : <EyeIcon className="w-4 h-4 mr-2" />}
            {showAllTooltips ? 'Hide All' : 'Show All'}
          </Button>
        </div>
      </div>

      <div className="relative mt-4 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
        <h3 className="font-bold mb-2">Trek Summary</h3>
        <ul className="text-sm">
          {trekData.map((location, index) => (
            <li key={index} className="mb-1">
              {location.name} - {location.elevation}m
              {index > 0 && ` (${calculateDistance(
                trekData[index - 1].lat, trekData[index - 1].lng,
                location.lat, location.lng
              )}km from previous)`}
              {location.subDestinations && (
                <ul className="ml-4 mt-1">
                  {location.subDestinations.map((subDest, subIndex) => (
                    <li key={subIndex} className="text-orange-600">
                      • {subDest.name} - {subDest.elevation}m
                      ({calculateDistance(location.lat, location.lng, subDest.lat, subDest.lng)}km from {location.name})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TrekMap;