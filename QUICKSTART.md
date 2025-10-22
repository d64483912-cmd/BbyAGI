# 🚀 BabyAGI II - Quick Start Guide

Get up and running with BabyAGI II in just 5 minutes!

## 📋 Prerequisites

- Node.js 16 or higher installed
- A web browser (Chrome, Edge, Safari, or Firefox)
- Internet connection

## ⚡ 3-Step Setup

### Step 1: Install & Run

```bash
# Clone the repository
git clone https://github.com/d64483912-cmd/BbyAGI.git
cd BbyAGI

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:3000`

### Step 2: Get Your Free API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account (takes 30 seconds)
3. Click "Create Key" and copy your API key
4. Keep this key safe - you'll need it in the next step!

### Step 3: Configure BabyAGI II

1. Open the app at `http://localhost:3000`
2. Click the **⚙️ Settings** button in the top right
3. Paste your OpenRouter API key
4. Select your preferred AI model (we recommend "Meta Llama 3.2 3B" for beginners)
5. Click **Validate & Save**
6. Wait for the green checkmark ✅

## 🎯 Your First Agent

Now let's create your first autonomous agent!

### Example 1: Simple Task
```
Objective: Create a weekly meal plan for a vegetarian
```

1. Enter this objective in the text box
2. Click **▶️ Start Agent**
3. Watch as the agent:
   - Generates 3-5 initial tasks
   - Executes each task automatically
   - Re-prioritizes based on results
   - Generates new tasks as needed

### Example 2: Business Planning
```
Objective: Develop a go-to-market strategy for a new fitness app
```

The agent will:
- Research market trends
- Identify target audiences
- Create marketing channels plan
- Suggest launch timeline
- Propose success metrics

### Example 3: Learning Path
```
Objective: Create a 30-day learning plan for Python programming
```

The agent will:
- Break down learning into phases
- Suggest resources and exercises
- Create daily study schedule
- Identify practice projects

## 🎮 Controls Overview

### Main Controls
- **▶️ Start Agent** - Begin autonomous execution
- **⏸️ Pause** - Temporarily stop (resume anytime)
- **▶️ Resume** - Continue from where you paused
- **🔄 Reset** - Clear everything and start fresh

### Advanced Controls
- **⏭️ Skip Task** - Jump to next task
- **🗑️ Clear All** - Remove all tasks
- **💾 Save State** - Store your progress
- **📂 Load State** - Restore saved session
- **📊 Export PDF** - Download report

### Settings
- **⏱️ Execution Interval** - Control speed (0 = instant, 5 = default)
- **🤖 Model Selection** - Choose your AI model
- **🔑 API Key** - Update your credentials

## 💡 Pro Tips

### 1. Write Clear Objectives
❌ Bad: "Help me with marketing"
✅ Good: "Create a social media content calendar for a coffee shop targeting millennials"

### 2. Use Execution Interval
- Set to `0` for rapid testing
- Set to `5+` to watch the agent think
- Adjust based on your API rate limits

### 3. Save Your Progress
- Click 💾 Save before closing the browser
- Load it back anytime to continue
- Useful for long-running tasks

### 4. Choose the Right Model
- **Fast tasks**: Llama 1B or 3B
- **Balanced**: Gemma 2 9B or Mistral 7B
- **Complex reasoning**: Phi-3 Mini or Hermes 3

### 5. Review Task History
- Scroll through completed tasks
- Use the filter to find specific results
- Export PDF for permanent records

## 📱 Install as App

### On Desktop (Chrome/Edge)
1. Click the install icon (⊕) in the address bar
2. Or: Click ⋮ menu > Install BabyAGI II
3. App opens in standalone window

### On Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap Share button
3. Select "Add to Home Screen"
4. Find the icon on your home screen

### Benefits
- ✅ Works offline (with cached data)
- ✅ No browser UI (more screen space)
- ✅ Faster loading (cached assets)
- ✅ Native app feel

## 🔧 Troubleshooting

### "Please configure your OpenRouter API key"
**Solution**: Click ⚙️ Settings and enter your API key

### Tasks not executing
**Check**:
1. API key is valid (re-validate in Settings)
2. Internet connection is active
3. Selected model is available
4. Browser console for errors (F12)

### UI looks broken
**Try**:
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check Tailwind CSS loaded (view page source)

### App won't install as PWA
**Requirements**:
- HTTPS connection (or localhost)
- Supported browser (Chrome, Edge, Safari)
- Manifest.json accessible

## 🎨 Customization

### Change Theme Colors
Edit `styles/skeuomorphic.css`:
```css
:root {
  --color-primary: #8b5a3c;  /* Change this */
  --color-accent: #d4a574;    /* And this */
}
```

### Add More Models
Edit `services/openRouterService.ts`:
```typescript
export const FREE_MODELS = [
  // Add your model here
  {
    id: 'model-id',
    name: 'Model Name',
    description: 'Description'
  }
];
```

## 📚 Next Steps

1. **Read the full README** - More detailed documentation
2. **Experiment with objectives** - Try different types of tasks
3. **Explore models** - Test different AI models
4. **Join the community** - Share your experiences
5. **Contribute** - Help improve BabyAGI II

## 🆘 Need Help?

- 📖 Check the [README](./README.md)
- 🐛 Report issues on GitHub
- 💬 Join community discussions
- 📧 Contact maintainers

## 🎉 You're Ready!

Start creating autonomous agents that work for you 24/7. The possibilities are endless:

- 📝 Content creation
- 🔬 Research assistance
- 📊 Data analysis
- 💼 Business planning
- 🎓 Learning paths
- 🎨 Creative projects
- 🛠️ Problem solving
- 📈 Strategic planning

**Happy agent building! 👶🤖**

---

*BabyAGI II - Autonomous AI for everyone, everywhere, on any device.*
