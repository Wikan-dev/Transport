import { useState } from "react";
import axios from "axios";

const OrderForm = () => {
  const [form, setForm] = useState({
    name: "",
    pickup: "",
    destination: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Mengirim...");

    try {
      const res = await axios.post("http://localhost:5000/order", form);
      if (res.data.success) {
        setStatus("✅ Pesanan dikirim ke admin WA!");
      } else {
        setStatus("❌ Gagal mengirim pesanan.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Terjadi kesalahan saat mengirim pesanan.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-4">Form Pesanan Shuttle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          name="pickup"
          placeholder="Lokasi Penjemputan"
          value={form.pickup}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          name="destination"
          placeholder="Tujuan"
          value={form.destination}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition"
        >
          Kirim Pesanan
        </button>
      </form>
      <p className="text-center mt-4">{status}</p>
    </div>
  );
};

export default OrderForm;
