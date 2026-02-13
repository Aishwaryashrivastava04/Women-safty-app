# 🔍 Debug Guide - Login/Register Not Working

## ✅ Status Check
- ✅ Backend running: http://localhost:3000
- ✅ Frontend running: http://localhost:5173
- ✅ Endpoints responding: verified with curl

---

## 🧪 Step 1: Test on Desktop First

Open in your Mac browser:
```
http://localhost:5173/debug.html
```

You'll see:
- Your User Agent
- Detected API URL
- Test buttons for all backends
- Test Register + Login

**Click "Show Environment" first** → you should see:
```
User Agent: Mozilla/5.0 (Macintosh...
Is Android: false
Is Mobile: false
Detected API URL: http://localhost:3000
```

Then click **"Test Localhost:3000"** → should see:
```
✅ SUCCESS: {"success":true,"message":"Backend is working 💚"}
```

---

## 🤖 Step 2: Test on Android Emulator

### In Android Emulator Browser:

1. Open emulator browser
2. Go to: `http://10.0.2.2:5173/debug.html`
3. Click **"Show Environment"**

You should see:
```
User Agent: Mozilla/5.0 (Linux; Android...
Is Android: true ✅
Detected API URL: http://10.0.2.2:3000 ✅
```

4. Click **"Test 10.0.2.2:3000"** button

Should return:
```
✅ SUCCESS: {"success":true,"message":"Backend is working 💚"}
```

5. Click **"Test Register + Login Flow"**

Should test register and login automatically.

---

## ❌ If Still Failing

### Check these:

**1. Backend really running?**
```bash
ps aux | grep "node server.js"
# Should show the process

curl http://localhost:3000/api
# Should return success message
```

**2. Frontend JavaScript updated?**
Hard refresh in browser:
- Mac: Cmd+Shift+R
- Android: Clear browser cache

**3. Check browser console for errors:**
- Mac: F12 → Console tab
- Android emulator: Use Android Studio logcat

**4. Try commands in Terminal:**
```bash
# Test register
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"debug@test.com","password":"pass123"}'

# Test login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@test.com","password":"pass123"}'
```

Both should return success JSON.

---

## 🚀 Quick Fix (If Port 3000 Issues)

```bash
# Kill any process on 3000
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Restart backend
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/be/Bakend"
node server.js
```

---

## 📌 Working Configuration

| Where | Frontend URL | API URL |
|-------|---|---|
| **Mac Browser** | http://localhost:5173 | http://localhost:3000 |
| **Android Emulator** | http://10.0.2.2:5173 | http://10.0.2.2:3000 |
| **Physical Android** | http://192.168.0.102:5173 | http://192.168.0.102:3000 |

---

**Try the debug page first.** Tell me what you see! 🎯
