# 🔧 BabyAGI II - Troubleshooting Guide

## ✅ App Status: RUNNING

The application is **successfully running** on:
- **Local**: http://localhost:3000/
- **Network**: http://172.17.0.18:3000/

### Accessing the App in Clacky

In the Clacky environment, you need to use the **preview URL** provided:

1. Look for the preview URL in your Clacky interface
2. It should look like: `https://3000-XXXXX-web.clackypaas.com`
3. Click on it to open the app in your browser

---

## 🚨 Common Issues & Solutions

### Issue 1: "Blocked request" or "Host not allowed"

**What it means**: You're trying to access the internal localhost URL from outside

**Solution**:
- ✅ Use the Clacky preview URL (look in your Clacky interface)
- ✅ Click the "Open Preview" button in Clacky
- ❌ Don't try to access localhost:3000 from your browser

---

### Issue 2: Blank White Screen

**Possible causes**:
1. JavaScript not loading
2. Browser console errors
3. API key not configured

**Solutions**:
1. **Open browser DevTools** (F12 or Cmd+Option+I)
2. Check the Console tab for errors
3. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Clear browser cache and reload

---

### Issue 3: "Please configure your OpenRouter API key"

**This is EXPECTED behavior!**

**What to do**:
1. Click the ⚙️ **Settings** button (top right)
2. Get a free API key from [OpenRouter.ai/keys](https://openrouter.ai/keys)
3. Paste your key in the Settings modal
4. Select a model (try "Meta Llama 3.2 3B")
5. Click "Validate & Save"
6. Wait for the ✅ success message
7. Close Settings and try starting the agent

---

### Issue 4: CSS/Styling Not Loading

**Symptoms**: Plain text, no colors, no styling

**Solutions**:
1. Check if Tailwind CSS CDN loaded:
   - Open DevTools > Network tab
   - Look for `cdn.tailwindcss.com` request
   - Should be Status 200

2. Check if skeuomorphic.css loaded:
   - DevTools > Network > CSS
   - Look for `skeuomorphic.css`
   - Should be Status 200

3. Force reload: `Ctrl+F5` or `Cmd+Shift+R`

---

### Issue 5: Settings Modal Won't Open

**Check**:
1. Look for the ⚙️ Settings button in top right corner
2. Click it to open the modal
3. If nothing happens, check browser console for errors

**Alternative**:
```javascript
// Open browser console (F12) and run:
localStorage.setItem('openrouter_api_key', 'YOUR_API_KEY_HERE');
localStorage.setItem('openrouter_model', 'meta-llama/llama-3.2-3b-instruct:free');
location.reload();
```

---

### Issue 6: Agent Won't Start

**Checklist**:
- [ ] Objective field is filled
- [ ] API key is configured (check Settings)
- [ ] Model is selected
- [ ] No browser console errors
- [ ] Internet connection is active

**Debug steps**:
1. Open browser console (F12)
2. Try to start the agent
3. Look for red error messages
4. Common errors:
   - `API_KEY is not set` → Configure in Settings
   - `Failed to fetch` → Check internet connection
   - `401 Unauthorized` → API key is invalid

---

### Issue 7: "Failed to generate initial tasks: Invalid task format received"

**What it means**: The AI model returned a response that couldn't be parsed as task data.

**This has been FIXED** in the latest version with:
- ✅ Robust JSON extraction from AI responses
- ✅ Support for multiple response formats
- ✅ Better error messages
- ✅ Fallback parsing strategies

**If you still see this error**:

1. **Try a different model**:
   - Open Settings (⚙️)
   - Select a different model from the dropdown
   - Recommended: "Meta Llama 3.2 3B" or "Mistral 7B"
   - Some models work better with JSON generation

2. **Check your objective**:
   - Make it clear and specific
   - Bad: "do stuff"
   - Good: "Research the benefits of renewable energy and create a summary"

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for detailed error messages
   - The console will show the actual AI response

4. **API key issues**:
   - Re-validate your API key in Settings
   - Make sure it has credits/quota

**Technical details** (for developers):
The system now handles these response formats:
- Direct JSON array: `[{"id": "task1", ...}]`
- Wrapped object: `{"tasks": [{"id": "task1", ...}]}`
- Text with JSON embedded
- Markdown code blocks
- Multiple field name variations (id/taskId, description/task/name)

---

### Issue 8: Tasks Not Executing

**Possible causes**:
1. Invalid API key
2. Model not available
3. Rate limit exceeded
4. Network issues

**Solutions**:
1. Re-validate API key in Settings
2. Try a different model
3. Check OpenRouter status: [status.openrouter.ai](https://status.openrouter.ai)
4. Wait a few minutes and try again
5. Check browser console for specific error messages

---

### Issue 9: PWA Install Not Showing

**Requirements for PWA**:
- ✅ HTTPS connection (or localhost)
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Supported browser (Chrome, Edge, Safari)

**Check**:
1. Open DevTools > Application tab
2. Check "Manifest" section
3. Check "Service Workers" section
4. Look for install icon in address bar

**Troubleshoot**:
```javascript
// Check in console:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('Service Workers:', regs);
  });
}
```

---

### Issue 10: "Module not found" Errors

**In browser console**:

**Solution**:
1. Stop the dev server
2. Delete node_modules and package-lock.json
3. Reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

### Issue 11: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
1. Kill the process:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. Or use a different port:
   ```bash
   npm run dev -- --port 3001
   ```

---

## 🔍 Diagnostic Commands

### Check if server is running:
```bash
curl -I http://localhost:3000/
```

Expected: `HTTP/1.1 200 OK`

### Check loaded modules:
```bash
curl -s http://localhost:3000/App.tsx | head -20
```

Should show compiled JavaScript

### Check CSS loading:
```bash
curl -s http://localhost:3000/styles/skeuomorphic.css | head -20
```

Should show CSS code

### View server logs:
Server logs are visible in your Clacky terminal

---

## 🧪 Testing Checklist

Run through this checklist to verify everything works:

- [ ] App loads without errors
- [ ] Settings button (⚙️) is visible
- [ ] Settings modal opens
- [ ] Can enter API key
- [ ] Model dropdown shows options
- [ ] Validation works (with valid key)
- [ ] Can enter objective
- [ ] Start button becomes active
- [ ] Agent generates tasks
- [ ] Tasks execute and complete
- [ ] Task history displays
- [ ] Pause/Resume/Reset work
- [ ] Save State works
- [ ] Load State works
- [ ] Export PDF works
- [ ] Styling looks correct (skeuomorphic)

---

## 📊 Verification Steps

### 1. Visual Check
✅ **What you should see**:
- Warm brown/tan color scheme
- Beveled buttons with 3D effect
- Textured backgrounds
- "👶 BabyAGI II" title with gradient
- ⚙️ Settings button top right
- Input fields with inset shadows
- Tactile-looking buttons

❌ **What indicates a problem**:
- Plain white/gray background
- Flat buttons
- No textures or gradients
- Missing icons

### 2. Functionality Check
✅ **What should work**:
- Clicking buttons gives visual feedback
- Modal opens/closes smoothly
- Forms accept input
- API validation provides feedback
- Agent can start/pause/resume/reset

---

## 🆘 Still Having Issues?

### Debug Mode

1. **Open browser console** (F12)
2. **Check for errors** (red text)
3. **Try these commands**:

```javascript
// Check React loaded
console.log('React:', typeof React);

// Check app state
console.log('Root element:', document.getElementById('root'));

// Check localStorage
console.log('Saved config:', localStorage.getItem('openrouter_api_key') ? 'Yes' : 'No');

// Check service worker
navigator.serviceWorker.getRegistrations().then(r => console.log('SW:', r));
```

### Get More Help

1. **Screenshot the error** in browser console
2. **Note the exact behavior** (what you clicked, what happened)
3. **Check the browser** (Chrome, Firefox, Safari?)
4. **Check the platform** (Windows, Mac, Linux, Mobile?)
5. **Open a GitHub issue** with all this information

---

## ✅ Success Indicators

**Your app is working correctly if**:

1. ✅ Server shows "ready" in terminal
2. ✅ Browser loads the page without errors
3. ✅ You see the skeuomorphic UI (brown/tan colors)
4. ✅ Settings button is visible and clickable
5. ✅ You can configure API key
6. ✅ Agent can start after configuration

**The most common "issue" is actually expected**: 
You MUST configure your OpenRouter API key before the agent will work!

---

## 🎉 Quick Test

Want to quickly verify everything works?

1. Open the app in your browser
2. Click ⚙️ Settings
3. Does the modal open? ✅ UI works!
4. Get API key from openrouter.ai
5. Enter key and validate
6. Does it save? ✅ API integration works!
7. Enter objective: "Create a simple task list"
8. Click Start Agent
9. Does it generate tasks? ✅ Agent works!
10. See the tasks execute? ✅ Everything works!

---

**Remember**: The app IS running successfully at http://localhost:3000/

Use the Clacky preview URL to access it from your browser! 🚀

