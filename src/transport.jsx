import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hapus from './assets/cancel.svg';
import { data } from "react-router-dom";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


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

const Pesanan = ({ awal, akhir, distance, setAwal, setAkhir, setStart, setEnd, setRoute, setDistance }) => {
  const [show, setShow] = useState(false);
  let harga = Math.round(distance) * 3000;
  let jarak = Math.round(distance);
  // console.log(show);

  useEffect(() => {
    if (akhir !== "" ) {
      setShow(true);
    }
  }, [akhir]);

  const navigate = useNavigate();

  function handleClick() {
    navigate('/struk', { state: { awal: awal, akhir: akhir, jarak: jarak, harga: harga } });
  }

  return (
    <div className="absolute z-50 bottom-0 w-full bg-white p-5 rounded-t-3xl drop-shadow-2xl transition-all duration-200 trnsition-ease-in" style={{ height: show ? '450px' : '50px'}}>
      <div onClick={() => setShow(!show)} className="w-full h-5">
        <div className="w-20 bg-gray-300 h-3 rounded-xl mx-auto"></div>
      </div>
        <div>
          <div className="mt-5">
            <h1 className="font-bold text-[20px] mb-3">Titik jemput</h1>
            <input type="text" value={awal} readOnly className="truncate px-5 bg-white outline-1 w-full h-10 rounded-xl focus:outline-none" placeholder="input titik jemput" />
          </div>
          <div className="mt-5">
            <h1 className="font-bold text-[20px] mb-3">Titik antar</h1>
            <input type="text" value={akhir} readOnly className="truncate px-5 bg-white outline-1 w-full h-10 rounded-xl focus:outline-none" placeholder="input titik jemput" />
          </div>
        </div >
        <div className="flex justify-between mt-5">
          {distance && (
          <div>
            jarak: {distance.toFixed(2)} km
          </div>
        )}
        
        {harga > 1 && (
          <div>
            <h1 className="font-bold ">perkiraan harga: {harga}</h1>
          </div>
        )}
        </div>
      <div className="flex gap-2">
        <button className="h-12 w-1/2 bg-[#EF7721] font-bold text-white rounded-xl mt-3 leading-4" onClick={() => {setAwal(""), setStart(null), setRoute(null), setDistance(null)}} style={{ opacity: awal ? '1' : '0.5'}} >kosongkan titik jemput</button>
        <button className="h-12 w-1/2 bg-[#EF7721] font-bold text-white rounded-xl mt-3 px-3 leading-4 " onClick={() => {setAkhir(""), setEnd(null), setRoute(null), setDistance(null)}} style={{ opacity: akhir ? '1' : '0.5'}}>kosongkan titik antar</button>
      </div>
      <button onClick={handleClick} className="h-12 w-full bg-[#EF7721] font-bold text-white rounded-xl mt-3 ">Konfirmasi</button>
    </div>
  )
}
function SearchBox({onSelect, userLocation, setStart, setEnd, setRoute, start, end , setSearchLocation, awal, setAwal, akhir, setAkhir}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  

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

// async function handleEnterLocation() {
//   if (!query) {
//     alert("Please enter a location");
//     return;
//   }

//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
//   const res = await fetch(url);
//   const data = await res.json();

//   if (data.length > 0) {
//     const place = data[0];
//     const loc = {
//       lat: parseFloat(place.lat),
//       lng: parseFloat(place.lon),
//       label: place.display_name,
//     };

//     if (!start) {
//       setStart(loc);
//     } else if (!end) {
//       setEnd(loc);
//     } else {
//       setStart(loc);
//       setEnd(null);
//       setRoute(null);
//     }

    

//     setSearchLocation(loc);
//     onSelect(loc);
//     setQuery(place.display_name);
//     setResult([]);
//   } else {
//     alert("Location not found");
//   }
//   // console.log(awal, akhir);
// }a


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
      <div className="hidden">
        {/* <Pesanan awal={awal} akhir={akhir} /> */}
      </div>

      <img src={hapus} alt="cancel" onClick={() => {setQuery(""), setResult([])}} className={`absolute w-10 right-4 top-6  ${result.length > 0 ? 'block' : 'hidden'}`} />
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cari lokasi..." className="px-5 w-[85%] h-15 mt-3 focus:outline-none font-bold text-[20px] truncate" />
     <div className={`transition-all duration-300 ease-in-out overflow-auto ${result.length > 0 ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
      {result.length > 0 && (
        <ul className="px-5 font-bold text-[20px]">
          {result.map((place, i) => (
            <li className="w-full truncate bg-white my-3 p-2 rounded-xl border-b-2 drop-shadow-xl" key={i} onClick={() => {            
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

            if (!awal) {
              setAwal(place.display_name);
            } else if (!akhir) {
              setAkhir(place.display_name);
            } else {
              setAwal(place.display_name);
              setAkhir("");
              setRoute(null);
            }

            console.log("awal: ", awal, "Akhir: ", akhir);

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

function LocateButton({ userLocation, setUserMarker, setStart, setAwal, fetchNearbyPlaces, setPosition }) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      {/* {show ? (
        <div className="absolute z-20 w-[90%]  right-1/2 translate-x-1/2 h-17 p-2 bg-white bottom-33 rounded-xl transition-all duration-300 ease-in" style={{ opacity: show ? 1 : 0 }}>
          <h1 className="text-[12px] text-red-500">warning : place that your input is not recognized by the system, we will use other benchmark to find your exact location, you can also message the driver to speedup the process</h1>
        </div>
      ) : null} */}

      <div className="absolute z-20 w-[90%]  right-1/2 translate-x-1/2 h-17 p-2 bg-white bottom-33 rounded-xl transition-all duration-300 ease-in" style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)' }}>
          <h1 className="text-[12px] text-red-500">warning : place that your input is not recognized by the system, we will use other benchmark to find your exact location, you can also message the driver to speedup the process</h1>
        </div>
        <button
        onClick={async () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
              const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              };
              setUserMarker(coords);
              setPosition(coords);
              setShow(true);
              console.log(show);

              const places = await fetchNearbyPlaces(coords.lat, coords.lng);

              if (places && places.length > 0) {
                const nearest = places[0];
                const loc = {
                  lat: nearest.lat,
                  lng: nearest.lng,
                  label: nearest.name,
                };

                setStart(loc);
                setAwal(nearest.name);
              } else {
                alert("No nearby places found");
                setStart(coords);
                setAwal("Current Location");
              }
            });
          } else {
            alert("Geolocation is not supported by your browser");
          }
        }}
        className="absolute z-20 bottom-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md"
      >Use Current User Location</button>
    </div>
  )
}



const Shuttle = () => {
  const [awal, setAwal] = useState("");
  const [akhir, setAkhir] = useState(""); 
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
  const [userMarker, setUserMarker] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

    async function fetchNearbyPlaces(lat, lng) {
    const radius = 500;
    const query = `
    [out:json];
    (
      node["amenity"~"cafe|restaurant|fast_food|bar|pub"](around:${radius},${lat},${lng});
      node["shop"~"supermarket|convenience|mall"](around:${radius},${lat},${lng});
      node["tourism"="hotel"](around:${radius},${lat},${lng});
    );
    out center 10;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.elements) {
      const places = data.elements.map((el) => ({
        id: el.id,
        lat: el.lat,
        lng: el.lon,
        name: el.tags.name || "Unnamed",
        type: el.tags.amenity || el.tags.shop || el.tags.tourism || "Unknown",
      }));

      setNearbyPlaces(places);
      return places;
    }
    return [];
  } 

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
      <Pesanan awal={awal} akhir={akhir} distance={distance} setAwal={setAwal} setAkhir={setAkhir} setStart={setStart} setEnd={setEnd} setRoute={setRoute} setDistance={setDistance} />

      <LocateButton setAwal={setAwal} setPosition={setPosition} userLocation={userLocation} setUserMarker={setUserMarker} setStart={setStart} start={start} fetchNearbyPlaces={fetchNearbyPlaces} />

      <SearchBox onSelect={(loc) => setPosition(loc)} userLocation={userLocation} setStart={setStart} setEnd={setEnd} setRoute={setRoute} start={start} end={end} setSearchLocation={setSearchLocation} awal={awal} setAwal={setAwal} akhir={akhir} setAkhir={setAkhir} />

      <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} zoomControl={false} className={`h-[100%] w-[100%] relative z-10`}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={[position.lat, position.lng]} zoom={18} />

        

        <LocationMarker setStart={setStart} setEnd={setEnd} start={start} end={end} />

        {start && (
          <Marker position={[start.lat, start.lng]}>
            <Popup>Start Point</Popup>
          </Marker>
        )}
        {end && (
          <Marker position={[end.lat, end.lng]}>
            <Popup>End Point</Popup>
          </Marker>
        )}
        {start && end && !route && (
          <Polyline positions={[[start.lat, start.lng], [end.lat, end.lng]]} color="blue" />
        )}

        {route && (
          <Polyline positions={route} color="blue" />
        )}

        {userMarker && (
          <Marker position={[userMarker.lat, userMarker.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* {nearbyPlaces.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <b>{place.name}</b><br />
              {place.type}
            </Popup>
          </Marker>
        ))} */}
        

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