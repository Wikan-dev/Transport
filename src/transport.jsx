import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hapus from './assets/cancel.svg';
import { data } from "react-router-dom";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam kilometer 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = 
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos((lat1 * Math.PI) / 180) *
  Math.cos((lat2 * Math.PI) / 180) *
  Math.sin (dLon/2) * Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function SearchBox({onSelect, userLocation, setStart, setEnd, setRoute, start, end , setSearchLocation}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [selected, setSelected] = useState(null); 

 useEffect(() => {
  if (!query) {
    setResult([]);
    return;
  }

  const timeout = setTimeout(async () => {
    const delta = 0.11;
    // base url
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&viewbox=${userLocation.lng-delta},${userLocation.lat+delta},${userLocation.lng+delta},${userLocation.lat-delta}&bounded=1&limit=20`;

    // kalau ada lokasi user, tambahin parameter supaya fokus di sekitar user
    if (userLocation) {
      url += `&lat=${userLocation.lat}&lon=${userLocation.lng}&bounded=1`;
    }

    const res = await fetch(url);
    let data = await res.json();

    if (userLocation) {
      // tambahin jarak ke tiap hasil
      data = data.map((place) => ({
        ...place,
        distance: haversine(
          userLocation.lat,
          userLocation.lng,
          parseFloat(place.lat),
          parseFloat(place.lon)
        ),
      }));

      // urutin biar yg terdekat muncul di atas
      data.sort((a, b) => a.distance - b.distance);
    }

    setResult(data);
  }, 500);

  return () => clearTimeout(timeout);
}, [query, userLocation]);

async function handleEnterLocation() {
  if (!query) {
    alert("Please enter a location");
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.length > 0) {
    const place = data[0];
    const loc = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      label: place.display_name,
    };

    if (!start) {
      setStart(loc);
    } else if (!end) {
      setEnd(loc);
    } else {
      setStart(loc);
      setEnd(null);
      setRoute(null);
    }

    setSearchLocation(loc);
    onSelect(loc);
    setQuery(place.display_name);
    setResult([]);
  } else {
    alert("Location not found");
  }
}

// function handleSelect() {
//   if (query != "") {
//     setSelected(query);
//     console.log("Selected location:", query);
//   } else {
//     alert("Please select a location");
//   }
// }
// console.log(query);

// console.log(start, end, route);

  return (
    <div className="absolute z-20 bg-white w-[90%] left-[50%] right-[50%] translate-x-[-50%] mt-10 rounded-2xl pb-4">
      <img src={hapus} alt="cancel" onClick={() => {setQuery(""), setResult([])}} className={`absolute w-10 right-4 top-6  ${result.length > 0 ? 'block' : 'hidden'}`} />
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cari lokasi..." className="px-5 w-[85%] h-15 mt-3 focus:outline-none font-bold text-[20px] truncate" />
     <div className={`transition-all duration-300 ease-in-out overflow-auto ${result.length > 0 ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
      {result.length > 0 && (
        <ul className="px-5 font-bold text-[20px]">
          {result.map((place, i) => (
            <li className="w-80 truncate bg-white my-3 p-2 rounded-xl border-b-2 drop-shadow-xl" key={i} onClick={() => {            
            const loc = {
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
              label: place.display_name,
            };

            if (!start) {
              setStart(loc);
            } else if (!end) {
              setEnd(loc);
            } else {
              setStart(loc);
              setEnd(null);
              setRoute(null);
            }

            onSelect(loc);
            setResult([])
            setQuery(place.display_name);
            setSearchLocation(loc);
          }}>
              {place.distance && (
                    <span className="block text-sm text-gray-500">
                      {place.distance.toFixed(2)} km
                    </span>
              )}
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
     </div>

     <div className="absolute flex flex-row">
      {/* <button className=" w-50 h-10 bg-green-500 top-50 text-white font-bold" onClick={() => handleEnterLocation()}>enter</button> */}
      {/* <button className=" w-50 h-10 bg-green-500 top-50 text-white font-bold" onClick={() => {setEnd(null), setRoute(null), setStart(null)}}>hapus tanda</button> */}
     </div>

     <div className='w-full h-50 absolute top-120 bg-white p-5 rounded-tl-xl rounded-tr-xl'>
      <div>
        <h1>lokasi jemput</h1>
        <input value={query} type="text" readOnly className="bg-white w-full h-10 pl-5 rounded-xl mt-2" placeholder="lokasi awal" />
      </div>
     </div>
    </div> 
  )
}

function ChangeView({ center, zoom = 15}) {
  const map = useMap();

  useEffect(() => {
    if (!center || !Array.isArray(center)) return;
    map.flyTo(center, zoom, { duration : 0.6})
  }, [center, map, zoom]);

  return null;
}

function LocationMarker({ setStart, setEnd, start, end}) {
  useMapEvents({
    click(e) {
      if (!start) {
        setStart(e.latlng);
      } else if (!end) {
        setEnd(e.latlng);
    } else {
      setStart(e.latlng);
      setEnd(null);
    }
  }});
}

const Shuttle = () => {
  const [position, setPosition] = useState({
    lat: -8.65,
    lng: 115.82
  });
  const [userLocation, setUserLocation] = useState(null);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null); 
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setUserLocation(coords);
          setPosition(coords);
        },
        (err) => {
          console.error(err);
          alert("Gagal mendapatkan lokasi Anda. Menggunakan lokasi default.");
        }
      );
    }
  }, [])

  useEffect(() => {
    if (start && end) {
      const jarak = haversine(start.lat, start.lng, end.lat, end.lng);
      setDistance(jarak);

      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]));
          }
        })
        .catch(err => console.eror("Gagal mendapatkan rute:", err));
    }
  }, [start, end]);

  // console.log(coords);

  return (
    <div className={`h-[100vh] w-[100%]`}>
      <SearchBox onSelect={(loc) => setPosition(loc)} userLocation={userLocation} setStart={setStart} setEnd={setEnd} setRoute={setRoute} start={start} end={end} setSearchLocation={setSearchLocation} />

      <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} zoomControl={false} className={`h-[100%] w-[100%] relative z-10`}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={position ? [position.lat, position.lng] : initial} zoom={15} />

        

        <LocationMarker setStart={setStart} setEnd={setEnd} start={start} end={end} />

        {start && (
          <Marker position={[start.lat, start.lng]}>
            <Popup>Start Point</Popup>
          </Marker>
        )}
        {end && (
          <Marker position={[end.lat, end.lng]}>
            <Popup>Start Point</Popup>
          </Marker>
        )}
        {start && end && !route && (
          <Polyline positions={[[start.lat, start.lng], [end.lat, end.lng]]} color="blue" />
        )}

        {route && (
          <Polyline positions={route} color="blue" />
        )}

        {distance && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg font-bold">
            jarak: {distance.toFixed(2)} km
          </div>
        )}

        {/* {searchLocation && (
          <Marker position={[searchLocation.lat, searchLocation.lng]}>
            <Popup>{searchLocation.label}</Popup>
          </Marker>
        )} */}
      </MapContainer>
    </div>
  )
}

export default Shuttle;