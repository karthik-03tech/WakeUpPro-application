# ⏰ WakeUp Pro

WakeUp Pro is an advanced, strictly-enforced alarm app built with React Native and Expo. It forces you to actually wake up by making you complete interactive challenges (math/logic questions or walking a step target) before you can dismiss the alarm. 

## ✨ Features
- **Smart Dismissal:** Complete a Math, Logic, or Step Challenge to turn off the alarm.
- **Pedometer Support:** Walk 10 steps to prove you're out of bed.
- **Motivational Quotes:** Start your day right with a quote after waking up.
- **Streak Tracking:** Tracks consecutive days you successfully wake up.
- **Customizable Alarms:** Set repeat days, challenge difficulty, and snooze limits.
- **Dark/Light Mode:** Full theming support.

---

## 🚀 How to Run the Project locally

### Prerequisites
1. Install [Node.js](https://nodejs.org/).
2. Install the **Expo Go** app on your iOS or Android device from the App Store / Play Store.

### Setup Instructions
1. **Clone the repository** (or download the zip):
   ```bash
   git clone <your-repo-url>
   cd WakeUpPro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your phone:**
   - Scan the QR code that appears in your terminal using the **Expo Go** app (Android) or your **Camera app** (iOS).
   - **Note:** Make sure your computer and phone are on the *same WiFi network*.

---

## 🌍 How to Share with Teammates (Remote Testing)
If your teammates are in another city and want to test the app without downloading the code:

1. Run the server using the tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
2. Send them a screenshot of the QR code or copy the `exp://...ngrok-free.app` URL.
3. They can open the **Expo Go** app, tap **"Scan QR Code"** (or enter the URL manually), and play with the app instantly!

---

## 🛠️ Troubleshooting & Common Errors

#### 1. QR Code / App is not loading on my phone
- Your PC firewall might be blocking the connection.
- **Fix:** Stop the server (`Ctrl + C`) and run it using the tunnel command:
  ```bash
  npx expo start --tunnel
  ```

#### 2. `Error: Cannot find module 'babel-preset-expo'`
This happens if the dependencies get out of sync or failed to install correctly.
- **Fix:** Run this command to install the missing package:
  ```bash
  npm install babel-preset-expo --save-dev
  ```
- After installing, **clear the cache** when starting the server:
  ```bash
  npx expo start -c
  ```

#### 3. Step Counter / Pedometer is not working
- The Expo Go app on iOS simulators/Android Emulators on your computer *does not support pedometer sensors*.
- **Fix:** You *must* run the app on a **physical device** (your actual phone) to test the step challenge.

#### 4. Metro Bundler isn't updating my code changes
- The bundler might be stuck caching old code.
- **Fix:** Stop the server and clear the cache:
  ```bash
  npx expo start -c
  ```
