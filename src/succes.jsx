import image from "./assets/SuccesImage.webp"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const Succes = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [userData, setUserData] = useState({});   

    useEffect(() => {
        let storedData = {};

        // cek dulu apakah ada state yang dikirim
        if (location.state && Object.keys(location.state).length > 0) {
            storedData = location.state;
            localStorage.setItem("userinfo", JSON.stringify(storedData)); // simpan ke localStorage
        } else {
            // kalau nggak ada, ambil dari localStorage (dengan pengecekan biar aman)
            const fromLocal = localStorage.getItem("userinfo");
            if (fromLocal) {
            try {
                storedData = JSON.parse(fromLocal);
            } catch (e) {
                console.error("Gagal parse localStorage:", e);
            }
            }
        }

        setUserData(storedData);
        console.log("dari succes:", storedData);
    }, [location.state]);
    
    const handlebackHome = () => {
        navigate('/home', { state: userData });
    }

    return (
        <div className="bg-[#EF7721] w-full h-screen px-10">
            <img src={image} alt="succes" className="mx-auto pt-30 w-70"/>
            <h1 className="text-white text-3xl font-bold pt-20 text-center">Pembayaran Berhasil!</h1>
            <button className="w-full bg-[#FAA433] text-white h-10 rounded-xl mt-10 acumalaka" onClick={handlebackHome} >Kembali ke halaman utama</button>
        </div>
    )
}

export default Succes;