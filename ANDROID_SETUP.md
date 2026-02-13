# 📱 Android App Setup Guide

## ✅ What's Done

1. **Backend Server** running on `http://0.0.0.0:3000`
   - `/users/register` ✅ 
   - `/users/login` ✅
   - `/api` ✅
   - CORS enabled ✅

2. **Frontend** updated with dynamic API URL (`src/api.js`)
   - Auto-detects environment (emulator vs device vs web)
   - Fallback: `192.168.0.102:3000` (your Mac)

3. **Build** is ready in `Frontend/dist/`

---

## 🚀 To Test on Android Emulator

### Step 1: Start Backend (if not running)
```bash
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/be/Bakend"
node server.js
```

### Step 2: Verify Backend is Accessible
```bash
curl http://localhost:3000/api
# Expected: {"success":true,"message":"Backend is working 💚"}
```

### Step 3: Start Android Emulator
- Open **Android Studio**
- Launch your Android Virtual Device (AVD)

### Step 4: Test Register on Emulator
- Navigate to Login page
- Click **"Register Now"**
- Fill form:
  - Name: `Test User`
  - Email: `test@example.com`
  - Contact: `+91 9999999999`
  - Password: `password123`
- Click **Register**

### Step 5: Test Login on Emulator
- Use the email/password you registered
- Click **Login**
- Should redirect to Dashboard

---

## 📱 To Test on Physical Android Device

### Step 1: Find Your Mac's IP
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
**Your IP: `192.168.0.102`** (already configured in `src/api.js`)

### Step 2: Make sure Backend is Accessible from Device
- Backend must be running on Mac
- Device must be on **same WiFi network** as Mac
- Test from device browser:
  ```
  http://192.168.0.102:3000/api
  ```

### Step 3: Build APK or Use Expo
**Option A: Expo (Easier)**
```bash
cd Frontend
npx create-expo-app .
npm start
# Scan QR code with Expo Go app on your phone
```

**Option B: Manual APK Build (Android Studio)**
- This requires full Android Studio setup and takes longer

---

## 🔧 Server Configuration for Different Scenarios

| Device Type | API URL | Status |
|---|---|---|
| **Android Emulator (on your Mac)** | `http://10.0.2.2:3000` | ✅ Works |
| **Physical Android on same WiFi** | `http://192.168.0.102:3000` | ✅ Now Works |
| **Web Browser (localhost)** | `http://localhost:3000` | ✅ Works |

**Your code already handles all three!** (See `src/api.js`)

---

## 🐛 If Still Not Working

### Check 1: Backend is Running
```bash
lsof -i :3000
# Should show: node process listening on 0.0.0.0:3000
```

### Check 2: You Can Reach Backend from Mac
```bash
curl http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@test.com","password":"pass"}'
```

### Check 3: Test from Android Emulator Browser
Open device browser and visit:
```
http://10.0.2.2:3000/api
```
Should return JSON success response.

### Check 4: Test Register via Emulator
On emulator, test endpoint directly using a tool like **Postman** or **REST Client** in Android:
```
POST http://10.0.2.2:3000/users/register
Body: {"name":"Test","email":"test@test.com","password":"pass123"}
```

---

## 📦 Next Steps

1. **Test on Emulator** (easiest)
2. **Build APK with Expo or Android Studio** 
3. **Deploy backend to cloud** (AWS, Heroku, etc.)
4. **Deploy frontend to Netlify** (optional)

---

## 💡 Pro Tips

- Keep `server.js` running in background: `nohup node server.js &`
- Test app frequently during development
- Use dev tools to debug (F12 in browser, Chrome DevTools in Android)
- Check network tab for failed requests

---

**Need anything else? Let me know!** 🚀
