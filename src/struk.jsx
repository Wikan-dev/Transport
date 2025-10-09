import { data, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Struk = () => {
    const [loading, setLoading] = useState(false);
    

    const { state } = useLocation();
    let awal = state?.awal || [];
    let akhir = state?.akhir || [];
    let jarak = state?.jarak || [];
    let harga = state?.harga || [];
    let dataInput = state?.dataInput || JSON.parse(localStorage.getItem("userinfo")) || {};
    console.log("dari struk: ", dataInput);
    console.log(dataInput.userName);
    // const navigate = useNavigate(); 

    // const handlePay = async () => {
    //     setLoading(true);
    //     const res = await axios.post("http://localhost:5000/api/create-checkout", {
    //         name: "John Doe",
    //         email: "testEmail@email.com",
    //         amoutn: harga,
    //     });
    //     window.location.href = res.data.invoice_url; // redirect ke halaman pembayar
    //     setLoading(false);
    // };

    const handlePay = async () => {
    setLoading(true);

    localStorage.setItem("userinfo", JSON.stringify(dataInput));
    const user = JSON.parse(localStorage.getItem("userinfo"));

    const res = await axios.post("http://localhost:5000/api/create-checkout", {
      name: dataInput.userName,
      email: dataInput.email,
      amount: harga,
      success_redirect_url: "http://localhost:5173/Transport/succes",
    });
    window.location.href = res.data.invoice_url; // redirect ke halaman pembayaran
    setLoading(false);
  };

    return (
        <div className="p-5 bg-[#F0F0F0]">
            <h1 className="relative z-20 acumalaka text-[25px]">Confirm your payment</h1>
            
            <div>
                <div>
                    <h1 className="acumalaka mb-3 mt-7">Titik jemput: </h1>
                    <div>
                        <input type="text" value={awal} 
                        readOnly className='focus:outline-0 bg-white rounded-xl drop-shadow w-full h-10 px-5 ' />
                    </div>
                </div>
                <div>
                    <h1 className="acumalaka mb-3 mt-5">Titik antar: </h1>
                    <div>
                        <input type="text" value={akhir} className='focus:outline-0 bg-white rounded-xl drop-shadow w-full h-10 px-5 truncate' />
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h1 className="acumalaka">Promo</h1>
                <div className="flex gap-3">
                    <input type="text" className="bg-white w-[70%] h-10 rounded-xl drop-shadow px-5" placeholder="input promo code" />
                    <button className="w-[30%] h-10 bg-[#EF7721] text-white rounded-xl">enter</button>
                </div>
            </div>
            
            <div className="mt-5">
                <h1 className="acumalaka">main struk</h1>
                <div>
                    <h1>Jarak yang di tempuh: <span className="font-bold">{jarak} km</span></h1>
                    <h1>Grand Total: <span className="font-bold">Rp{harga}</span></h1>
                </div>
            </div>
            <h1 className="mt-4">Metode pembayaran akan di pilih di halaman selanjutnya</h1>
            <button className="w-full bg-[#EF7721] h-10  rounded-xl text-white" onClick={handlePay} disabled={loading}>{loading ? "Membuka halaman pembayaran" : "Bayar sekarang" }</button>
        </div>
    )
}

export default Struk;