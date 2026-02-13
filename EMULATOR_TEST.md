# 📱 Android Emulator Testing Guide

## ✅ Setup Status
- ✅ Backend: Running on port 3000
- ✅ Frontend: Running on port 5173
- ✅ Both servers: Active and responding

---

## 🚀 STEP-BY-STEP: Test on Android Emulator

### **Step 1: Launch Android Emulator**
```
1. Open Android Studio
2. Click "Device Manager" (right sidebar)
3. Click Play button on your device (e.g., "Pixel 5")
4. Wait for emulator to fully load (2-3 minutes)
```

**Sign:** You should see Android home screen with time and apps

---

### **Step 2: Open Chrome in Emulator**

```
1. In emulator, look for "Chrome" app icon
2. Tap it to open browser
3. Wait for it to load
```

**Sign:** Chrome address bar appears at top

---

### **Step 3: Test Backend Connection First**

In emulator Chrome, type this address:
```
http://10.0.2.2:3000/api
```

**Expected Result:**
```
{"success":true,"message":"Backend is working 💚"}
```

If you see this → ✅ Backend connection working!
If you see error → ❌ Port issue or server down

---

### **Step 4: Open Frontend UI**

In emulator Chrome, type:
```
http://10.0.2.2:5173
```

**Expected Result:**
- Sees the home page with login button
- Page loads in < 3 seconds

---

### **Step 5: Test Register**

```
1. Click "Register Now" button
2. Fill form:
   - Name: "Test User"
   - Email: "emulator@test.com"
   - Contact: "+91 1234567890"
   - Password: "pass123"
3. Click "Register" button
4. See success message
```

**Expected:**
```
✅ Registration successful! Please login.
```

**If fails:** See error message (screenshot it for debugging)

---

### **Step 6: Test Login**

```
1. Click "Login Here" link
2. Fill:
   - Email: "emulator@test.com"
   - Password: "pass123"
3. Click "Login" button
4. Should redirect to Dashboard
```

**Expected:**
- Dashboard page loads
- See username and features
- No error message

---

## 🧪 Alternative: Test Debug Page

If register/login fails, use the debug page:

In emulator Chrome:
```
http://10.0.2.2:5173/debug.html
```

**On this page:**
1. Click "Show Environment"
   - Should show `Is Android: true`
   - Should show API URL as `10.0.2.2:3000`

2. Click "Test 10.0.2.2:3000"
   - Should show ✅ SUCCESS

3. Click "Test Register + Login Flow"
   - Tests automatically
   - Shows exactly what worked/failed

---

## 📸 If Something Fails

**Screenshot the error** and send me:
1. What page you were on
2. Error message shown
3. What you expected

Example:
```
On: Login page
Error: "Network error" or "Failed to connect" or "Invalid credentials"
Expected: Login success → Dashboard
```

---

## 🛠️ Troubleshooting Quick Fixes

### **Chrome shows "Can't reach this page"**
→ Backend server crashed
→ Run: `curl http://localhost:3000/api` on Mac
→ If fails, restart: `node server.js`

### **Page loads but buttons don't work**
→ Frontend has issue
→ Check Mac browser: `http://localhost:5173`
→ If broken there, restart frontend: `npm run dev`

### **Login says "wrong password" but you typed correct**
→ Database reset (in-memory)
→ Register again with same email
→ Then login

### **Emulator can't see Mac IP**
→ Make sure both on same WiFi
→ Check firewall not blocking port 3000/5173

---

## 📝 What to Tell Me If Broken

Send this info:
```
1. What page: (Register/Login/Dashboard/Debug)
2. Error message: (exact text shown)
3. Mac server status:
   curl http://localhost:3000/api
4. Expected vs Actual: (what should happen vs what happened)
5. Screenshot: (of error if possible)
```

---

## ✨ Success Signs

✅ You'll know it's working when:
- Register shows success message
- Login redirects to Dashboard
- Dashboard shows your name
- Features (SOS, Helpline, etc) load

---

**NOW GO TEST! 🚀 Tell me what happens!**
