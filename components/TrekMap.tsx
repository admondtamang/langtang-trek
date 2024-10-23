'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { trekData, Destination } from '@/lib/trekData';

const TrekMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          try {
            const map = new google.maps.Map(mapRef.current, {
              center: { lat: 28.2, lng: 85.5 },
              zoom: 11,
              mapTypeId: 'satellite',
              tilt: 45,
            });

            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();

            const addMarker = (
              location: Destination,
              index: number,
              isSubDestination: boolean = false
            ) => {
              const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.name,
                label: isSubDestination
                  ? undefined
                  : {
                      text: (index + 1).toString(),
                      color: 'white',
                      fontSize: '14px',
                    },
                icon: location.isHotel
                  ? {
                      path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
                      fillColor: '#4285F4',
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: '#FFFFFF',
                      scale: 1.5,
                      anchor: new google.maps.Point(12, 22),
                    }
                  : {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: isSubDestination ? 6 : 10,
                      fillColor: isSubDestination ? '#FF8C00' : '#4285F4',
                      fillOpacity: 1,
                      strokeColor: 'white',
                      strokeWeight: 2,
                    },
              });

              bounds.extend(marker.getPosition()!);

              marker.addListener('click', () => {
                infoWindow.setContent(`
                <div>
                  <h3 class="font-bold">${location.name}</h3>
                  <p>Elevation: ${location.elevation}m</p>
                  ${
                    location.description ? `<p>${location.description}</p>` : ''
                  }
                  ${
                    location.timeFromPrevious
                      ? `<p>Time from previous: ${location.timeFromPrevious}</p>`
                      : ''
                  }
                </div>
              `);
                infoWindow.open(map, marker);
              });
            };

            trekData.forEach((location, index) => {
              addMarker(location, index);
              if (location.subDestinations) {
                location.subDestinations.forEach((subDest) =>
                  addMarker(subDest, index, true)
                );
              }
            });

            // Create gradient for the polyline
            const gradientColors = [
              '#4285F4',
              '#42A5F5',
              '#42F5E3',
              '#42F5A5',
              '#42F562',
            ];
            const gradientSteps = gradientColors.map((color, index) => {
              return {
                color: color,
                offset: index / (gradientColors.length - 1),
              };
            });

            const path = new google.maps.Polyline({
              path: trekData.map((location) => ({
                lat: location.lat,
                lng: location.lng,
              })),
              geodesic: true,
              strokeOpacity: 0,
              icons: [
                {
                  icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    scale: 3,
                  },
                  repeat: '1px',
                },
              ],
              strokeColor: '#4285F4',
              strokeWeight: 30,
            });

            path.setMap(map);

            // Add gradient to the polyline
            // path.set('strokeColor', null);
            // path.set('icons', gradientSteps.map((step, index) => ({
            //   icon: {
            //     path: 'M 0,-1 0,1',
            //     strokeOpacity: 1,
            //     strokeColor: step.color,
            //     strokeWeight: 3,
            //     scale: 3,
            //   },
            //   offset: (index / (gradientSteps.length - 1) * 100) + '%',
            // })));

            map.fitBounds(bounds);

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
                    map: map,
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/man.png',
                      scaledSize: new google.maps.Size(32, 32),
                    },
                    title: 'Your Location',
                  });
                  bounds.extend(pos);
                  map.fitBounds(bounds);
                },
                () => {
                  console.error('Error: The Geolocation service failed.');
                }
              );
            } else {
              console.error("Error: Your browser doesn't support geolocation.");
            }
          } catch (error) {
            console.error('Error initializing map:', error);
            setMapError(
              'Failed to initialize the map. Please try again later.'
            );
          }
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setMapError(
          'Failed to load Google Maps. Please check your internet connection and try again.'
        );
      });
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-100 rounded-lg shadow-lg text-red-600 p-4">
        {mapError}
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />;
};

export default TrekMap;
