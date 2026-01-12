# Troubleshooting Guide

Common issues and their solutions.

## Camera/Microphone Permissions

### Error: "Failed to access camera/microphone"

This is the most common issue when starting the app.

#### Quick Fix:

1. **Check Browser Permissions**
   - Look for a camera icon or 🔒 in your browser's address bar
   - Click it and set Camera and Microphone to **"Allow"**
   - Refresh the page (F5 or Cmd+R)

2. **Verify You're on Localhost**
   - URL should be: `http://localhost:3000`
   - WebRTC requires `localhost` or `https://` (not plain `http://`)

---

## Browser-Specific Solutions

### Chrome / Edge

**If you accidentally blocked permissions:**

1. Click the 🔒 or camera icon (left side of address bar)
2. Under "Permissions", find Camera and Microphone
3. Change both to "Allow"
4. Refresh the page

**Reset all permissions:**
```
Chrome → Settings → Privacy and Security → Site Settings 
→ Camera / Microphone → Find localhost:3000 → Reset
```

### Firefox

1. Click the 🔒 icon in address bar
2. Click "Clear Permissions and Reload"
3. Allow camera/microphone when prompted

**Or manually:**
```
Firefox → Settings → Privacy & Security 
→ Permissions → Camera / Microphone → Settings
→ Remove localhost entry and try again
```

### Safari

1. Safari → Settings → Websites → Camera
2. Find `localhost` in the list
3. Change to "Allow"
4. Repeat for Microphone
5. Refresh page

---

## System-Level Permissions

Sometimes browser permissions aren't enough - the OS also needs to allow access.

### macOS

**Check System Settings:**

1. **Apple Menu** → **System Settings** (or System Preferences)
2. **Privacy & Security**
3. **Camera** → Enable for your browser (Chrome, Firefox, Safari)
4. **Microphone** → Enable for your browser
5. Restart your browser

**Quick Terminal Check:**
```bash
# Check if Chrome has camera permission
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
  "SELECT * FROM access WHERE client LIKE '%chrome%'"
```

### Windows

1. **Settings** → **Privacy** → **Camera**
2. Toggle "Allow apps to access your camera" → **ON**
3. Scroll down to "Allow desktop apps to access your camera"
4. Find your browser in the list → **ON**
5. Repeat for **Microphone**
6. Restart your browser

### Linux

Check if your user has access to video/audio devices:
```bash
# Check video devices
ls -l /dev/video*

# Check audio devices  
arecord -l

# Add your user to video/audio groups if needed
sudo usermod -a -G video,audio $USER
```

---

## Audio-Only Mode

**Good News:** The app now supports audio-only mode!

If camera access fails but microphone works:
- ✅ App will continue with audio only
- ⚠️ Yellow warning: "Audio-only mode enabled"
- Video panel shows "Camera Off"
- All voice features work normally

This is perfect for:
- No webcam available
- Privacy concerns
- Testing without video
- Production use when video isn't needed

---

## Common Error Messages

### "Permission denied" / "NotAllowedError"

**Cause:** You clicked "Block" on the permission prompt, or browser permissions are blocked.

**Fix:**
1. Click camera icon in address bar
2. Change to "Allow"
3. Refresh

### "NotFoundError" / "No microphone found"

**Cause:** No microphone is connected or detected.

**Fix:**
1. Connect a microphone
2. Check System Settings/Preferences (see above)
3. Restart browser
4. Try a different USB port (if external mic)

### "NotReadableError" / "Could not start video source"

**Cause:** Another application is using the camera/microphone.

**Fix:**
1. Close other apps using camera (Zoom, Teams, Skype, etc.)
2. Restart browser
3. Try again

### "HTTPS required" or "Secure context required"

**Cause:** Accessing via `http://` (not localhost).

**Fix:**
- Use `http://localhost:3000` for development
- Use `https://` for production deployment

---

## Testing Permissions

### Test in Browser Console

Open browser DevTools (F12) and run:

```javascript
// Test microphone only
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('✅ Microphone works!', stream))
  .catch(err => console.error('❌ Microphone error:', err));

// Test camera and microphone
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then(stream => console.log('✅ Camera & Mic work!', stream))
  .catch(err => console.error('❌ Error:', err));
```

### Check Available Devices

```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      console.log(device.kind + ': ' + device.label);
    });
  });
```

---

## Still Not Working?

### Hard Reset

1. **Clear browser data:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Check "Cached images and files" and "Cookies and site data"
   - Clear data

2. **Restart browser completely:**
   - Quit all browser windows
   - Relaunch

3. **Try incognito/private mode:**
   - This bypasses cached permissions
   - If it works there, it's a permission/cache issue

### Try Different Browser

Test in another browser to isolate the issue:
- Chrome
- Firefox  
- Edge
- Safari

### Check for Browser Updates

Make sure your browser is up to date:
- Chrome: Settings → About Chrome
- Firefox: Menu → Help → About Firefox
- Edge: Settings → About Microsoft Edge

---

## Production Deployment

When deploying to production, remember:

- ✅ **HTTPS is required** for WebRTC in production
- ✅ Vercel/Netlify provide HTTPS automatically
- ✅ Users will still need to allow permissions on first visit
- ❌ Plain HTTP won't work (except localhost)

---

## Vapi Connection Issues

### Call not starting

**Check:**
1. `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set correctly in `.env.local`
2. `NEXT_PUBLIC_VAPI_SQUAD_ID` (or assistant ID) is correct
3. Browser console for error messages
4. Vapi dashboard for account status/credits

### No audio from agent

**Check:**
1. Your speakers/headphones are connected
2. Browser audio isn't muted (check tab icon)
3. System volume is up
4. Vapi assistant has voice provider configured
5. ElevenLabs voice ID is valid

### Agent not responding

**Check:**
1. Microphone is working (see tests above)
2. You're speaking clearly
3. Check Vapi dashboard logs for transcription
4. Assistant prompt is properly configured

---

## Need More Help?

1. Check browser console (F12) for detailed error messages
2. Check Vapi Dashboard → Logs for call details
3. Review `SIMPLE_SETUP.md` for configuration
4. Open an issue on GitHub with:
   - Browser and version
   - Operating system
   - Error message
   - Console logs

---

## Prevention Tips

✅ **Always use Chrome or Edge** (best WebRTC support)  
✅ **Allow permissions when first prompted** (easier than fixing later)  
✅ **Use localhost for development** (https:// for production)  
✅ **Close other video apps** before testing  
✅ **Check system permissions** first if issues persist  

---

**Most common fix:** Click the camera icon in your browser's address bar → Allow → Refresh! 🎉
