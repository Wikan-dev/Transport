import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hapus from './assets/cancel.svg';
import { data } from "react-router-dom";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ZONA_BALI = [
  { id: 1, name: "Tuban", lat: -8.739, lng: 115.166 },
  { id: 2, name: "Kuta, Jimbaran", lat: -8.780, lng: 115.167 },
  { id: 3, name: "Nusa Dua, Tanjung Benoa", lat: -8.805, lng: 115.229 },
  { id: 4, name: "Legian, Seminyak, Kerobokan, Batubelig", lat: -8.678, lng: 115.162 },
  { id: 5, name: "Sanur, Denpasar", lat: -8.670, lng: 115.244 },
  { id: 6, name: "Pecatu, Uluwatu", lat: -8.829, lng: 115.086 },
  { id: 7, name: "Seseh Cemagi, Pererenan, Canggu", lat: -8.647, lng: 115.122 },
  { id: 8, name: "Mengwi, Tanah Lot", lat: -8.551, lng: 115.117 },
  { id: 9, name: "Sukawati, Ubud, Gianyar", lat: -8.509, lng: 115.265 },
  { id: 10, name: "Tegallalang, Keliki, Payangan", lat: -8.442, lng: 115.282 },
  { id: 11, name: "Tabanan, Kerambitan", lat: -8.535, lng: 115.038 },
  { id: 12, name: "Penebel, Jatiluwih, Bangli, Klungkung, Padangbai", lat: -8.414, lng: 115.357 },
  { id: 13, name: "Selemadeg, Bedugul, Plaga", lat: -8.369, lng: 115.108 },
  { id: 14, name: "Sidemen, Candidasa, Amed, Kintamani, Singaraja, Jembrana", lat: -8.305, lng: 115.205 },
];

const ZONE_PRICES = [
  { from: 1, to: 2, price: 90000 },
  { from: 1, to: 3, price: 105000 },
  { from: 4, to: 5, price: 130000 },
  { from: 6, to: 9, price: 260000 },
  { from: 7, to: 8, price: 250000 },
  { from: 12, to: 13, price: 550000 },
  { from: 13, to: 14, price: 600000 },
  // ...dan seterusnya, nanti tinggal dilengkapi
];



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

const Pesanan = ({ awal, akhir, distance, setAwal, setAkhir, setStart, setEnd, setRoute, setDistance, zonaAwal, zonaAkhir, hargaZona, setZonaAkhir, setZonaAwal, setHargaZona }) => {
  const location = useLocation();
  const dataInput = location.state;
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    pickup: "",
    destination: ""
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: dataInput.userName,
      pickup: awal,
      destination: akhir,
    }))
  }, [awal, akhir, dataInput]);

  const [status, setStatus] = useState("");
  // let harga = Math.round(distance) * 3000;
  let harga = 0;
  console.log(awal, akhir, "nama: ", dataInput.userName);

  //untuk pesan wa

  //untuk harga
  if (hargaZona != null) {
    harga = hargaZona;
  } else if (distance >= 10) {
    harga = 200000;
  } else if (distance) {
    harga = 100000;
  }

  let jarak = Math.round(distance);

  // console.log(show);
  // console.log("dari shuttle: ", dataInput);
  // console.log(dataInput.userName);

  useEffect(() => {
    if (akhir !== "" ) {
      setShow(true);
    }
  }, [akhir]);

  const navigate = useNavigate();

  const handleClick = async (e) => {
    //untuk fungsi wa
    e.preventDefault();
    setStatus("Mengirim");

    try {
      const res = await axios.post("http://localhost:5000/order", form);
      if (res.data.success) {
        setStatus("Pesanan dikirim ke admin wa");
        if (awal && akhir != "") {
          navigate('/struk', { state: { awal, akhir, jarak, harga, zonaAwal, zonaAkhir } });    
        } else {
          alert("Titik jemput dan titik antar harus diisi");
        }
      } else {
        setStatus("Gagal meengirim pesanan");
      }
    } catch (err) {
      console.error(err);
      setStatus("Terjadi kesalahan saat mengirim pesanan");
    }
    //-----------------batas wa

  }


  // console.log(distance)
  return (
    <div className="absolute z-50 bottom-0 w-full bg-white p-5 rounded-t-3xl drop-shadow-2xl transition-all duration-200 trnsition-ease-in" style={{ height: show ? '450px' : '50px'}}>
      <div onClick={() => setShow(!show)} className="w-full h-5">
        <div className="w-20 bg-gray-300 h-3 rounded-xl mx-auto"></div>

        {/* {zonaAwal && zonaAkhir && (
        <div className="mt-4 p-3 bg-gray-100 rounded-xl text-gray-700">
          <p><b>Zona Jemput:</b> {zonaAwal.name}</p>
          <p><b>Zona Antar:</b> {zonaAkhir.name}</p>
          {hargaZona && <p className="font-bold text-lg mt-2">Harga zona: Rp {hargaZona.toLocaleString()}</p>}
        </div>
      )} */}
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
        <div className="mt-5 text-sm text-gray-600">
          {zonaAwal && <p>Zona Jemput: {zonaAwal.name}</p>}
          {zonaAkhir && <p>Zona Antar: {zonaAkhir.name}</p>}
        </div>
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
        <button className="h-12 w-1/2 bg-[#EF7721] font-bold text-white rounded-xl mt-3 leading-4" onClick={() => {setAwal(""), setStart(null), setRoute(null), setDistance(null), setZonaAwal(null), setHargaZona(null)}} style={{ opacity: awal ? '1' : '0.5'}} >kosongkan titik jemput</button>
        <button className="h-12 w-1/2 bg-[#EF7721] font-bold text-white rounded-xl mt-3 px-3 leading-4 " onClick={() => {setAkhir(""), setEnd(null), setRoute(null), setDistance(null), setZonaAkhir(null), setHargaZona(null)}} style={{ opacity: akhir ? '1' : '0.5'}}>kosongkan titik antar</button>
      </div>
      <button onClick={handleClick} className="h-12 w-full bg-[#EF7721] font-bold text-white rounded-xl mt-3">Konfirmasi</button>
    </div>
  )
}


function SearchBox({
  map,
  onSelect,
  userLocation,
  setStart,
  setEnd,
  setRoute,
  start,
  end,
  setSearchLocation,
  awal,
  setAwal,
  akhir,
  setAkhir,
  onManualSelect,
  enableFollowMode
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  // const map = useMap();
  // const { map } = props;
  

  useEffect(() => {
    if (!query) {
      setResult([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        // build URL only if userLocation exists, otherwise search global
        let url;
        const encoded = encodeURIComponent(query);
        if (userLocation) {
          const delta = 1;
          url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&viewbox=${userLocation.lng-delta},${userLocation.lat+delta},${userLocation.lng+delta},${userLocation.lat-delta}&bounded=1&limit=20&lat=${userLocation.lat}&lon=${userLocation.lng}`;
        } else {
          url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=20`;
        }

        const res = await fetch(url);
        const data = await res.json();

        let mapped = data;
        if (userLocation && Array.isArray(data)) {
          mapped = data.map((p) => ({
            ...p,
            distance: haversine(userLocation.lat, userLocation.lng, parseFloat(p.lat), parseFloat(p.lon))
          }));
          mapped.sort((a, b) => a.distance - b.distance);
        }

        setResult(mapped);
      } catch (err) {
        console.error("SearchBox fetch error:", err);
        setResult([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, userLocation]);

  // handle selection in one place so `place` is always defined inside this function
  const handleSelect = (place) => {
    if (!place) return;
    const loc = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      label: place.display_name
    };

    // Prioritaskan start, lalu end
    if (!start) {
      setStart(loc);
    } else if (!end) {
      setEnd(loc);
    } else {
      // kalau keduanya sudah ada, replace start (atau ubah sesuai kebutuhan)
      setStart(loc);
      setEnd(null);
      if (setRoute) setRoute(null);
    }
    
    // atur text label awal/akhir
    if (!awal) setAwal(place.display_name);
    else if (!akhir) setAkhir(place.display_name);
    else {
      setAwal(place.display_name);
      setAkhir("");
      if (setRoute) setRoute(null);
    }

    // inform parent
    onSelect && onSelect(loc);
    if (onManualSelect) onManualSelect();
    setSearchLocation && setSearchLocation(loc);
    
    // UI updates
    setQuery(place.display_name);
    setResult([]);

    //untuk kamera map
    // map.flyTo([loc.lat, loc.lng], 17, {duration: 1});
  };
  
  return (
    <div className="absolute z-20 bg-white w-[90%] left-[50%] right-[50%] translate-x-[-50%] mt-10 rounded-2xl pb-4">
      <img src={hapus} alt="cancel" onClick={() => { setQuery(""); setResult([]); }} className={`absolute w-10 right-4 top-6 ${result.length > 0 ? 'block' : 'hidden'}`} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cari lokasi..." className="px-5 w-[85%] h-15 mt-3 focus:outline-none font-bold text-[20px] truncate" />

      <div className={`transition-all duration-300 ease-in-out overflow-auto ${result.length > 0 ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
        {result.length > 0 && (
          <ul className="px-5 font-bold text-[20px]">
            {result.map((place, i) => (
              <li key={i} className="w-full truncate bg-white my-3 p-2 rounded-xl border-b-2 drop-shadow-xl cursor-pointer"
                onClick={() => handleSelect(place)}
              >
                {place.distance != null && <span className="block text-sm text-gray-500">{place.distance.toFixed(2)} km</span>}
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <button onClick={enableFollowMode}>Ikuti Lokasi Saya</button> */}

    </div>
  );
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
      if (!start) setStart(e.latlng);
      else if (!end) setEnd
  }});
  return null;
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
              // console.log(show);

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


function getZonePrice(zoneStart, zoneEnd) {
  if (!zoneStart || !zoneEnd) return null;

  const found = ZONE_PRICES.find(
    (z) => 
    (z.from === zoneStart.id && z.to === zoneEnd.id) ||
    (z.to === zoneStart.id && z.from === zoneEnd.id)
  );

  return found ? found.price : null;
}

function getNearestZone(lat, lng) {
  let nearest = null;
  let minDistance = Infinity;
  ZONA_BALI.forEach((zone) => {
    const d = haversine(lat, lng, zone.lat, zone.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = zone;
    }
  });
  return nearest;
}

const Shuttle = () => {
  const [awal, setAwal] = useState("");
  const [akhir, setAkhir] = useState(""); 
  const [position, setPosition] = useState({
    lat: -8.65,
    lng: 115.82
  });
  const [userLocation, setUserLocation] = useState(null);
  //untuk harga
  const [zonaAwal, setZonaAwal] = useState(null);
  const [zonaAkhir, setZonaAkhir] = useState(null);
  const [hargaZona, setHargaZona] = useState(null);

  //untuk bug kamera
  const initializedRef = useRef(false);
  const manualInitializedRef = useRef(false);

  
  
  
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null); 
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  
  const notifyManualSelect = () => {
    manualInitializedRef.current = true
  };

  const enableFollowMode = () => {
    manualInitializedRef.current = false;
    initializedRef.current = false;
    if (userLocation) {
      setPosition(userLocation);
    }
  }

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
    if (!navigator.geolocation) return;

    const succes = (pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserLocation(loc);

      if (!initializedRef.current && !manualInitializedRef.current) {
        setPosition(loc);
        initializedRef.current = true;
      }
    };

    const err = (e) => {
      console.error("Geolocation eror: ", e);
    };

    const watchId = navigator.geolocation.watchPosition(succes, err, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 100000
    });

    //cleanup
    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (zonaAwal && zonaAkhir) {
      const price = getZonePrice(zonaAwal, zonaAkhir);
      setHargaZona(price);
    }
  }, [zonaAwal, zonaAkhir])

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

  useEffect(() => {
    if (start && end) {
      const nearestStartZone = getNearestZone(start.lat, start.lng);
      const nearestEndZone = getNearestZone(end.lat, end.lng);

      setZonaAwal(nearestStartZone);
      setZonaAkhir(nearestEndZone);

      const price = getZonePrice(nearestStartZone, nearestEndZone);
      setHargaZona(price);
    } else {
      setHargaZona(null);
    }
  }, [start, end]);

  // console.log(coords);

  const mapRef = useRef();

  return (
    <div className={`h-[100vh] w-[100%]`}>
      <Pesanan awal={awal} akhir={akhir} distance={distance} setAwal={setAwal} setAkhir={setAkhir} setStart={setStart} setEnd={setEnd} setRoute={setRoute} setDistance={setDistance} zonaAwal={zonaAwal} zonaAkhir={zonaAkhir} hargaZona={hargaZona} setZonaAwal={setZonaAwal} setZonaAkhir={setZonaAkhir} setHargaZona={setHargaZona} />

      <LocateButton setAwal={setAwal} setPosition={setPosition} userLocation={userLocation} setUserMarker={setUserMarker} setStart={setStart} start={start} fetchNearbyPlaces={fetchNearbyPlaces} />

      <SearchBox onSelect={(loc) => setPosition(loc)} userLocation={userLocation} setStart={setStart} setEnd={setEnd} setRoute={setRoute} start={start} end={end} setSearchLocation={setSearchLocation} awal={awal} setAwal={setAwal} akhir={akhir} setAkhir={setAkhir} map={mapRef.current} onManualSelect={notifyManualSelect} enableFollowMode={enableFollowMode} />

      <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} zoomControl={false} className={`h-[100%] w-[100%] relative z-10`} whenCreated={(mapInstance) => (mapRef.current = mapInstance)}>
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