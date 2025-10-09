import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173", // alamat React kamu
  methods: ["GET", "POST"],
}));

// ==== WHATSAPP BOT SETUP ====
const client = new Client({
  authStrategy: new LocalAuth(),
});

let orders = {};

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
  console.log("Scan QR dari WhatsApp admin 📱");
});

let isReady = false;

client.on("ready", () => {
  console.log("WhatsApp bot siap jalan 🚀");
  console.log("Bot login dengan nomor:", client.info.wid.user);
  isReady = true;

  if (!isReady) {
  console.log("⚠️ WhatsApp client belum siap, coba lagi nanti.");
  return res.status(503).json({ error: "WhatsApp belum siap, coba lagi nanti." });
}
});

client.initialize();

let isOpen = true;

// === ROUTE KIRIM PESAN WA ===
app.post("/order", async (req, res) => {
  const { name, pickup, destination } = req.body;
  const orderId = Date.now();
  orders[orderId] = { name, pickup, destination, status: "pending" };

  const adminNumber = "6281338085555@c.us"; // ubah ke nomor WA admin

  if (!isOpen) {
    //web tutup
    await client.sendMessage(adminNumber, `pesanan dari ${name} di tolak otomatis (web tutup)`);
    orders[orderId].status = "rejected";
    return res.json({ success: false, message: "web sedang tutup, pesanan di tolak"});
  } 

  //web buka
  await client.sendMessage(adminNumber, `pesanan dari ${name} di terima otomatis`);
  orders[orderId].status = "accepted";
  return res.json({ success: true, orderId});

  const message = `
🚌 *Pesanan Baru!*
Nama: ${name}
Dari: ${pickup}
Ke: ${destination}

Balas:
*oke ${orderId}* untuk terima
*tolak ${orderId}* untuk menolak
`;

  try {
    // pastikan client udah siap
    if (!client || !client.info) {
      console.log("⚠️ WhatsApp client belum siap, coba lagi nanti.");
      return res.status(503).json({ error: "WhatsApp belum siap, coba lagi nanti." });
    }

    await client.sendMessage(adminNumber, message);
    console.log(`✅ Pesanan ${orderId} dikirim ke admin ${adminNumber}`);
    res.json({ success: true, orderId });
  } catch (err) {
    console.error("❌ Gagal kirim pesan ke WA:", err);
    res.status(500).json({ error: "Gagal mengirim pesan WhatsApp." });
  }
});


// === HANDLE BALASAN DARI ADMIN ===
// client.on("message", msg => {
//   const text = msg.body.toLowerCase();
//   const [cmd, id] = text.split(" ");

//   if (cmd === "oke" && orders[id]) {
//     orders[id].status = "approved";
//     msg.reply("✅ Pesanan diterima, user bisa lanjut ke pembayaran.");
//   } else if (cmd === "tolak" && orders[id]) {
//     orders[id].status = "rejected";
//     msg.reply("❌ Pesanan ditolak.");
//   }
// });

// === CEK STATUS PESANAN ===
app.get("/order-status/:id", (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: "Order tidak ditemukan" });
  res.json({ status: order.status });
});

//=====AUTO BALES=====
client.on('message', async (msg) => {
  const chat = msg.body.toLowerCase();
  const sender = msg.from;
  
  const adminNumber = "6281338085555@c.us";

  if (sender === adminNumber) {
    if (chat === "web tutup") {
      isOpen = false;
      await client.sendMessage(sender, "web sedang tutup, semua pesanan akan di tolak otomatis");
    } else if (chat === "wen buka") {
      isOpen = true;
      await client.sendMessage(sender, "web sudah di buka, semua pesanan yang masuk akan diterima otomatis");
    }
  }
});

// ==== XENDIT CHECKOUT ====
app.post("/api/create-checkout", async (req, res) => {
  const { name, email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: `order-${Date.now()}`,
        payer_email: email,
        description: `Pembayaran oleh ${name}`,
        amount: amount,
        success_redirect_url: "http://localhost:5173/Transport/succes",
        failure_redirect_url: "https://yourapp.com/failed",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Basic " +
            Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64"),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Gagal membuat invoice" });
  }
});

// === JALANKAN SERVER ===
app.listen(5000, () => console.log("Server jalan di port 5000 🚀"));
