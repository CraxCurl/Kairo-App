# Kairo — AI Desktop Agent Mobile Companion App

<div align="center">
  <h3>The Remote Control & Mission Control for Kairo Desktop Agent</h3>
  <p>Manage laptop task queues, authorize critical executions, dispatch natural language tasks, and voice-command your personal AI agent from anywhere.</p>
</div>

---

## 🌟 Overview & Product Concept

**Kairo** is a personal AI task agent that lives on your laptop. The **Kairo Mobile Companion App** is your pocket control plane and remote interface. You can create complex tasks on the go, queue workflows for the next time your laptop boots, monitor execution in real time, and grant sensitive permission requests with a single tap.

All heavy AI reasoning and task executions are performed by the local LLM on the laptop agent, keeping the phone application ultra-fast, responsive, and battery-efficient.

---

## 🚀 Core Features

### 1. 📊 Live Dashboard & Remote Telemetry
* **Laptop Status**: Real-time heartbeat, battery percentage, charging state, CPU load, RAM usage, and foreground application.
* **Kairo Agent State**: Real-time status badge and pulsing AI orb (`Idle` / `Executing` / `Waiting for Confirmation` / `Paused` / `Thinking`).
* **Active Task Hero Card**:
  * Step-by-step checklist with real-time execution indicators.
  * Live progress bar and estimated completion percentage.
  * Collapsible live terminal execution logs streamed from laptop.
  * Remote controls: **Pause**, **Resume**, **Skip**, **Done**, and **Cancel**.
* **Upcoming Task Preview**: Quick-start or reorder the next queued task.
* **Productivity Ring**: Circular completion metrics and breakdown for today.
* **Live Event Stream**: Real-time chronological audit trail of agent actions.

### 2. 📋 Full Task Queue Management
* **Hierarchical Priority**: `Critical` (Red), `High` (Amber), `Medium` (Blue), `Low` (Gray).
* **Flexible Triggers**:
  * *Next laptop startup*
  * *Today*
  * *Tomorrow*
  * *Specific date & time*
  * *After another task (dependency chaining)*
  * *Manual execution only*
* **Remote Queue Controls**:
  * Move task Up / Down
  * Prioritize to Top (1-tap)
  * Start now / Pause / Skip / Mark Completed
  * Delete & Cancel execution
* **Filter Tabs**: Filter by *All*, *In Progress*, *Waiting*, *Next Startup*, or *Completed*.

### 3. 🪄 Natural Language & Structured Task Creation
* **Natural Language AI Mode**:
  * Simply tell Kairo what you want:
    > *"Tomorrow when I open my laptop, remind me to finish my Java assignment, then solve two LeetCode problems."*
  * Dispatches raw instructions to laptop agent where the local LLM decomposes it into structured tasks, assigns triggers, establishes dependencies, and schedules them.
* **Manual Form**:
  * Task name, description, priority, trigger selection, scheduled date/time picker, dependency selector, estimated duration, authorization requirement, and tags.

### 4. 🎙️ Interactive Voice AI Interface
* **Fluid Audio Visualizer**: Waveform bar animation responding to speech activity.
* **Voice Command Recognition & Synthesis**:
  * *"What's next?"*
  * *"Add finish my Java assignment to tomorrow."*
  * *"Pause Kairo."*
  * *"Resume Kairo."*
  * *"Skip the current task."*
  * *"Move LeetCode to the top."*
  * *"What have I completed today?"*
  * *"Is my laptop online?"*
* **Speech-to-Text & Text-to-Speech**: Integrated Web Speech Synthesis for audio voice replies with customizable speech speed and pitch.

### 5. 🛡️ Interactive Execution Confirmation Modal
* **Safety First**: Dangerous or sensitive shell actions require explicit remote authorization before running on your laptop.
* **Rich Auth Modal**:
  * Action summary and risk level tag (`High`, `Medium`, `Low`).
  * Terminal command payload preview with copy functionality.
  * Interactive **[Allow]** and **[Deny]** buttons.
  * Auto-deny countdown timer for security.

### 6. 🔔 Push Notification & History Audit
* Push alerts for:
  * Laptop came online / boot
  * Kairo started execution
  * Kairo waiting for confirmation
  * Task completed / failed / skipped
  * Approaching deadlines
* Full chronological timeline exportable as JSON.

### 7. ⚙️ Settings & Device Pairing
* QR Code scanning & device pairing key authentication.
* **Kairo Personalities**: *Focused Engineer*, *Casual Buddy*, *Strict Overseer*, *Concise Butler*.
* Auto-approve safe read-only tasks toggle.
* Startup behavior configuration (Auto-resume queue vs wait for user).

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS with custom Kairo dark theme tokens (`#090A0F`, `#7C6EF8`, `#34D399`) and glassmorphism styling
* **Icons**: Lucide React
* **Animations**: CSS Waveform physics + Framer Motion
* **Audio & Speech**: Web Speech Recognition API & Web Speech Synthesis API
* **State Management**: Reactive React Context with localStorage caching & optimistic updates

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/CraxCurl/Kairo-App.git
cd Kairo-App

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Mobile Frame Simulator
The desktop view includes a built-in **iPhone 15 Pro titanium frame preview** and an **Expanded View** toggle at the top, allowing you to preview the exact mobile experience on any desktop screen or test directly on mobile browsers.
