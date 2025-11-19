# **Cloudflare Workflows – Complete Guide**

Cloudflare Workflows adalah platform otomatisasi modern berbasis JavaScript yang berjalan di jaringan global Cloudflare. Workflow dapat dipicu melalui HTTP, Cron, Scheduled Events, Queue, atau integrasi internal lainnya.
Proyek ini menyediakan contoh dasar untuk membangun, menjalankan, dan mendeploy Workflow secara cepat.

---

## 🚀 **1. Fitur Utama**

* ⚡ **Eksekusi ultra cepat**—berjalan di Cloudflare Edge Network
* 🧩 **Mendukung runtime JavaScript modern (Node ≥ 18)**
* ⏱ **Cron & schedule triggers**
* 🌐 **Integrasi ke Cloudflare Workers**
* 🧪 **Dapat dijalankan lokal sebelum deploy**
* 🔒 **Environment Variables & Secrets**
* 📡 **Support HTTP + Event-driven model**

---

## 📦 **2. Prasyarat**

Pastikan Anda memiliki:

### **Akun dan Tools**

* Akun Cloudflare
* Akses ke Cloudflare Dashboard
* Cloudflare Workers aktif
* Node.js **>= 18**
* npm / pnpm / yarn
* Wrangler CLI

Install Wrangler jika belum ada:

```bash
npm install -g wrangler
```

Login:

```bash
wrangler login
```

---

## 🛠 **3. Instalasi & Setup Project**

### **Buat project baru (cara paling cepat)**

```bash
npm create cloudflare@latest my-workflow
cd my-workflow
```

Atau install manual di proyek Anda:

```bash
npm install @cloudflare/workflows
```

Struktur project akan otomatis terbentuk.

---

## 📁 **4. Struktur Direktori**

Default struktur akan tampak seperti berikut:

```
/
├── workflows/
│   ├── example.js          # Workflow utama
│   └── ... (workflow lain)
├── package.json
├── wrangler.json           # Config Worker/Workflow
├── .gitignore
└── README.md
```

Penjelasan inti:

| File/Folder     | Fungsi                                   |
| --------------- | ---------------------------------------- |
| `workflows/`    | Tempat seluruh kode workflow             |
| `example.js`    | Workflow default                         |
| `wrangler.json` | Konfigurasi Cloudflare Worker & Workflow |
| `package.json`  | Dependency + script build/dev/deploy     |

---

## 🧩 **5. Membuat Workflow Baru**

### **Contoh file workflow: `workflows/example.js`**

```js
export default {
  async run(event, steps) {
    return { message: "Hello from Cloudflare Workflows!" };
  }
}
```

Workflow memiliki dua parameter default:

* `event` → data pemicu workflow
* `steps` → hasil step-step sebelumnya

---

## 🧪 **6. Menjalankan Workflow Secara Lokal**

Gunakan script dev:

```bash
npm run dev
```

Atau jika memakai Wrangler langsung:

```bash
wrangler dev
```

Kamu dapat memanggil endpoint seperti Worker biasa:

```
http://localhost:8787
```

Logs lokal:

```bash
wrangler tail
```

---

## 🚀 **7. Deploy Workflow ke Cloudflare**

Jalankan:

```bash
npm run deploy
```

Atau:

```bash
wrangler deploy
```

Setiap deploy akan:

* Build project
* Upload script
* Update Worker
* Sync automation triggers

---

## ⏱ **8. Menjalankan Workflow Dengan Cron**

Tambahkan cron di `wrangler.json`:

```json
{
  "name": "my-workflow",
  "workflows": {
    "example": {
      "triggers": {
        "crons": [
          "*/5 * * * *"
        ]
      }
    }
  }
}
```

Makna:

* Workflow `example` akan berjalan tiap 5 menit.

Deploy ulang setelah perubahan.

---

## 🔒 **9. Environment Variables & Secrets**

### Menambahkan environment variable:

```bash
wrangler secret put API_KEY
```

Workflow bisa mengakses:

```js
const apiKey = env.API_KEY;
```

---

## 📡 **10. Memanggil Workflow (HTTP Trigger)**

Tambahkan handler HTTP:

```js
export default {
  async run(event, steps) {
    return steps.fetch("call", {
      method: "GET",
      url: "https://api.example.com",
    });
  }
}
```

Atau gunakan Step API:

```js
await steps.shell("example", {
  command: ["echo", "Running Workflow"]
});
```

---

## 🖥 **11. Logs dan Monitoring**

### Jalankan logging realtime:

```bash
wrangler tail
```

### Lihat detail di dashboard:

Cloudflare Dashboard → Workers → Workflows → Logs

---

## 🌐 **12. Konfigurasi wrangler.json**

Contoh lengkap:

```json
{
  "name": "my-workflow",
  "main": "workflows/example.js",
  "compatibility_date": "2024-01-01",
  "workflows": {
    "example": {
      "triggers": {
        "crons": ["*/5 * * * *"]
      }
    }
  }
}
```

---

## 🧹 **13. Membersihkan & Rebuild**

```bash
rm -rf .wrangler state/
npm run build
```

Untuk dependency:

```bash
npm install
```

---

## ☁️ **14. Dokumentasi Tambahan**

Dokumentasi resmi lengkap:
👉 [https://developers.cloudflare.com/workflows](https://developers.cloudflare.com/workflows)

---

# **Lisensi**

MIT License — bebas digunakan dalam proyek personal maupun komersial.

---
