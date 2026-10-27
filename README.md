# High-Speed File Distribution Service

A lightweight, zero-dependency static file distribution server configured for seamless 1-click deployment on **Vercel**.

## 🚀 Key Features
- **Direct `/zip` Download**: Accessing `/zip` immediately downloads `file.zip` with `Content-Disposition: attachment`.
- **Works with `curl` & `wget`**: Tested with `curl -L "https://your-domain/file.zip" -o file.zip` and `curl -L "https://your-domain/zip" -o file.zip`.
- **Range & Resume Support**: Supports `Accept-Ranges: bytes` for partial downloads and resuming interrupted transfers.
- **Bypasses Vercel Serverless 4.5 MB Limit**: Serves `file.zip` directly as a static CDN asset (up to 100 MB on Vercel Edge).
- **Interactive Landing Page**: Modern, dark-mode web interface at root `/` with live domain detection, one-click copyable CLI commands, file specs, and SHA-256 verification.

---

## 📁 Project Structure

```text
push2/
├── file.zip          # Your uploaded zip archive (~9.5 MB)
├── index.html        # Interactive landing page with CLI copy snippets
├── vercel.json       # Vercel configuration (rewrites & HTTP headers)
├── server.js         # Optional local testing server (zero npm dependencies)
└── README.md         # Documentation and deployment instructions
```

---

## ⚡ Deployment to Vercel

### Option 1: Vercel CLI (Fastest - 30 seconds)
1. Open your terminal in this directory:
   ```bash
   npx vercel
   ```
2. Follow the prompt instructions (press `Enter` to accept defaults).
3. For production deployment:
   ```bash
   npx vercel --prod
   ```

### Option 2: Deploy via GitHub
1. Initialize a git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial file download server"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Framework Preset: **Other** (detected automatically).
4. Build Command: Leave blank / default.
5. Click **Deploy**.

---

## 💻 CLI Usage Examples

Replace `https://your-domain.vercel.app` with your deployed URL (or `http://localhost:3000` when testing locally):

### Using `curl`
```bash
# Direct /file.zip path
curl -L "https://your-domain.vercel.app/file.zip" -o file.zip

# Short /zip route
curl -L "https://your-domain.vercel.app/zip" -o file.zip

# Auto-detect filename from Content-Disposition header
curl -L -O -J "https://your-domain.vercel.app/zip"
```

### Using `wget`
```bash
# Standard download
wget "https://your-domain.vercel.app/file.zip"

# Download via /zip alias
wget "https://your-domain.vercel.app/zip" -O file.zip
```

### Using PowerShell
```powershell
Invoke-WebRequest -Uri "https://your-domain.vercel.app/zip" -OutFile "file.zip"
```

---

## 🧪 Local Testing

To test the server locally before deploying to Vercel:

```bash
node server.js
```

Then visit [http://localhost:3000](http://localhost:3000) or run:
```bash
curl -L "http://localhost:3000/zip" -o downloaded.zip
```
