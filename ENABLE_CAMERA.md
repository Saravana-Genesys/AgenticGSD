# Enable Camera & Microphone - Mac Guide

Quick guide to enable camera and microphone permissions on macOS.

## ✅ Step 1: Mac System Permissions

1. **Open System Settings**
   - Click Apple menu () → **System Settings** (or System Preferences on older macOS)

2. **Go to Privacy & Security**
   - In the left sidebar, click **Privacy & Security**
   - Scroll down to find **Camera** and **Microphone**

3. **Enable Camera for Your Browser**
   - Click **Camera**
   - Look for your browser in the list:
     - Google Chrome
     - Safari
     - Firefox
     - Microsoft Edge
   - **Toggle it ON** (switch should be blue/green)

4. **Enable Microphone for Your Browser**
   - Go back and click **Microphone**
   - Find your browser in the list
   - **Toggle it ON**

5. **Restart Your Browser**
   - Completely quit your browser (Cmd+Q)
   - Relaunch it

> **Important:** If your browser isn't in the list, it will appear the first time it tries to access the camera.

---

## ✅ Step 2: Browser Permissions

After enabling system permissions, allow in your browser:

### Chrome / Edge / Brave

1. **Go to** http://localhost:3000
2. **Look for the camera icon** in the address bar (top left)
   - It might have a red X on it if blocked
3. **Click the icon**
4. **Change settings:**
   - Camera: **Allow**
   - Microphone: **Allow**
5. **Click "Done"** or close the popup
6. **Refresh the page** (Cmd+R or F5)

**Alternative Method:**
1. Click the 🔒 padlock icon in address bar
2. Under "Permissions":
   - Camera → **Allow**
   - Microphone → **Allow**
3. Refresh

### Safari

1. **When page loads**, Safari will show a popup asking:
   - "localhost wants to use your camera and microphone"
2. **Click "Allow"**

**If you already blocked it:**
1. Safari → **Settings** (or Preferences)
2. Click **Websites** tab
3. Select **Camera** in left sidebar
4. Find `localhost` → Set to **Allow**
5. Select **Microphone** → Find `localhost` → Set to **Allow**
6. Close settings and refresh page

### Firefox

1. **When page loads**, Firefox shows a prompt at the top
2. **Click "Allow"** when asked for camera/microphone

**If you already blocked it:**
1. Click the 🔒 icon in address bar
2. Click **"Clear Permissions and Reload"**
3. Click **"Allow"** when prompted again

---

## 🧪 Step 3: Test Your Camera

Open your browser console to test:

1. **Open Developer Tools**
   - Press `Cmd+Option+I` (Mac)
   - Or right-click → Inspect

2. **Go to Console tab**

3. **Paste this code and press Enter:**
   ```javascript
   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
     .then(stream => {
       console.log('✅ SUCCESS! Camera and microphone work!');
       console.log('Video tracks:', stream.getVideoTracks());
       console.log('Audio tracks:', stream.getAudioTracks());
       // Stop the test stream
       stream.getTracks().forEach(track => track.stop());
     })
     .catch(err => {
       console.error('❌ ERROR:', err.name, '-', err.message);
       if (err.name === 'NotAllowedError') {
         console.log('👉 Fix: Enable permissions in browser and System Settings');
       }
     });
   ```

4. **Check the result:**
   - ✅ "SUCCESS!" → Permissions are working!
   - ❌ "NotAllowedError" → Follow steps above
   - ❌ "NotFoundError" → Check if camera is connected

---

## 🎯 Visual Guide - Where to Click

### Chrome Address Bar:
```
┌────────────────────────────────────────────────┐
│ 🔒 localhost:3000                      📹 🎤  │  ← Click these icons
└────────────────────────────────────────────────┘
```

### Permission Popup:
```
┌─────────────────────────────────────┐
│  localhost wants to use:             │
│                                      │
│  📹 Camera        [Dropdown ▼]      │
│  🎤 Microphone    [Dropdown ▼]      │
│                                      │
│              [ Block ]  [ Allow ]   │  ← Click Allow
└─────────────────────────────────────┘
```

---

## 🔍 Checking System Permissions via Terminal

You can verify Mac system permissions from terminal:

```bash
# Check camera access for apps
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
  "SELECT service, client, auth_value FROM access WHERE service='kTCCServiceCamera';"

# auth_value meanings:
# 0 = denied
# 1 = unknown
# 2 = allowed
```

---

## 🚨 Common Issues

### "Blocked by System Settings"

**Error:** Browser shows permissions but camera still doesn't work.

**Fix:**
1. System Settings → Privacy & Security → Camera
2. Make sure browser is listed AND enabled
3. If browser isn't in list:
   - Try requesting permissions in browser first
   - Browser should appear in System Settings
   - Enable it there

### "Camera in use by another app"

**Error:** "NotReadableError" or "Could not start video source"

**Fix:**
1. Quit other apps that might use camera:
   - Zoom, Teams, Skype, FaceTime, Photo Booth
2. Restart browser
3. Try again

### "No camera found"

**Error:** "NotFoundError"

**Fix:**
- If using built-in camera: Restart Mac
- If external camera: Unplug and reconnect
- Check: System Information → Camera (see if detected)

---

## ✨ What You Should See

Once working, you'll see:

1. **Browser prompt** → Click "Allow"
2. **Green light** on your Mac camera (if built-in)
3. **Video feed** in the app's right panel
4. **Microphone level** meter showing activity when you speak
5. **No error messages** at bottom of page

---

## 🎉 Success!

When everything works:
- ✅ Camera shows your video
- ✅ Microphone shows audio levels
- ✅ "Connect with Ram" button is ready
- ✅ No errors or warnings

**Now you can start your call and test the multi-agent system!**

---

## 📞 Need More Help?

If still not working:

1. **Check which browser you're using:**
   ```bash
   # Chrome is recommended for best WebRTC support
   ```

2. **Try a different browser** (Chrome recommended)

3. **Restart your Mac** (nuclear option but often fixes weird permission issues)

4. **Check Console for errors:**
   - Open DevTools (Cmd+Option+I)
   - Look for red error messages
   - Share them for specific help

---

**Most common fix: System Settings → Privacy & Security → Camera/Microphone → Enable Browser → Restart Browser!** 🎥
