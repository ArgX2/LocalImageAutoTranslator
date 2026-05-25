

# Local Image Auto Translator 🚀

This Chrome Extension (Manifest V3) bridges your local workflow with Google Translate's infrastructure. It injects a custom control panel into the Google Translate page to automate the batch processing, translation, and local saving of multiple images. Designed as a serverless architecture, it runs entirely within the browser sandbox without requiring a separate backend or external API keys.

## 📌 Architecture Overview

The extension strictly follows the **component-based distributed architecture** mandated by the Chrome Extension Manifest V3 specifications, isolating responsibilities into distinct layers.

※This Project is made by VIBECODING※


```


   [ User Interface ]
     /            \
(Click Popup)     (Page Interaction)
   v                    v

+--------------+    +--------------------------+
|   popup.js   |    |        content.js        |
|  (UI & Link) |    | (Core Logic / DOM Control|
+--------------+    +--------------------------+
|                         |
+-------> [ storage.local ] <------+ (Sync State)

```

### 1. Component Layers & Responsibilities
* **Manifest & Metadata (`manifest.json`):** The system blueprint defining permissions. It restricts host access strictly to `https://translate.google.com/*`, adhering to the principle of least privilege to ensure sandboxed security.
* **Client Popup (`popup.html` / `popup.js`):** A lightweight front-end layer triggered from the browser toolbar. It detects the host system's language and provides a seamless link to launch Google Translate with the proper image parameters (`op=images`).
* **Content Script (`content.js`) — *Core Business Logic*:** Injected directly into the Google Translate DOM. It renders the custom floating control panel and manages the asynchronous automated automation loop.
* **State Synchronization (`chrome.storage.local`):** Overcomes the execution context isolation between the Popup and Content Script, enabling seamless cross-layer synchronization of UI language preferences.

### 2. Core Mechanisms & Design Patterns
* **Asynchronous Recursive Pipeline:** Employs a single-threaded asynchronous processing loop via `processNextImage()`. It sequentially executes: `[Image Injection] ➡️ [Shadow DOM Translation Mutation Listener] ➡️ [Canvas Pixel Extraction] ➡️ [Asynchronous Local I/O Storage]`.
* **Sandboxed Local I/O (File System Access API):** Standard web limitations prevent automated folder manipulation. This architecture leverages `window.showDirectoryPicker()` to acquire explicit user permission, establishing a reliable stream to dynamically create a `Translated` subfolder and write files locally.
* **State-Driven Flow Control:** Incorporates global state flags (`isProcessing`, `forceStop`, etc.) to safely intercept asynchronous promises, allowing instant and graceful handling of user interruptions (Force Stop/Retry).

---

## 🛠️ Installation

1. Clone or download this repository as a ZIP file.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **'Developer mode'** using the toggle switch in the top-right corner.
4. Click the **'Load unpacked'** button in the top-left corner.
5. Select the root directory containing the source code (the folder where `manifest.json` resides).

---

## 📖 How to Use

### Step 1. Open Google Image Translate
* Click the **Local Image Auto Translator** icon in your browser toolbar.
* Click **Open Google Image Translate** to launch a new tab pre-configured with the automation controller.

### Step 2. Configure Languages & Target Directory
* Locate the **Auto Translator Controller** at the bottom-right corner of the web page.
* Select your **Source Language** and **Target Language**. *(Note: Modifying languages will trigger an automatic page reload to adjust parameters).*
* Click **`1. Select Folder`**, grant the browser permission to access files, and select the local directory containing your source images.

### Step 3. Execute the Translation Pipeline
* Once the extension scans the folder, the total image count will appear on the status panel.
* Click **`2. Start Translation`** to initiate the automated batch upload process.
* Translated files are sequentially written into a newly generated `Translated` folder inside your root directory. Files follow a standardized naming convention: `[OriginalName]-translated-[LangCode].[Extension]`.

### Step 4. Exception Handling & Controls
* **Force Stop:** If a glitch occurs or you wish to halt operations, click `Force Stop` to safely exit the asynchronous execution loop.
* **Retry Image Upload:** If an image hangs due to network or Google server delays, click `Retry Image Upload` to instantly reset and re-evaluate the current file index.

---

## ⚠️ Architectural Constraints & Maintainability
* **Tight Coupling to External DOM:** The automation layer's selectors are tightly coupled to Google Translate’s internal structure, specifically class signatures like `img.Jmlpdc` and individual SVG geometry keys (`M19 6.41L17.59 5`). Structural refactoring or UI updates by Google may require periodic maintenance updates to the selector layer.

