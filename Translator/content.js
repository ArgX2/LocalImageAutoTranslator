// --- 1. 다국어(i18n) 텍스트 데이터 ---
const i18n = {
    'ko': {
        controllerTitle: '자동 번역 컨트롤러',
        sourceLangLabel: '원본 언어:',
        targetLangLabel: '번역 언어:',
        langChangeWarning: '※ 언어 변경 시 페이지가 새로고침됩니다.',
        selectFolderBtn: '1. 폴더 선택',
        startBtn: '2. 번역 시작',
        retryBtn: '이미지 다시 넣기',
        stopBtn: '강제 중지',
        statusWaiting: '대기 중...',
        statusFilesLoaded: (count) => `이미지 ${count}개 로드됨.`,
        statusNotFound: '이미지를 찾을 수 없습니다.',
        statusProcessing: (current, total, name) => `[${current}/${total}] ${name} 처리 중...`,
        statusSaved: (name) => `[저장 완료] ${name}`,
        statusError: (name, msg) => `[오류] ${name}: ${msg}.`,
        statusStopped: '사용자에 의해 중지되었습니다.',
        statusAllDone: '모든 이미지 작업 완료!',
        uiLangLabel: 'UI 언어:',
        langOptions: { 'auto': '언어 감지', 'ko': '한국어', 'en': '영어', 'ja': '일본어', 'zh-CN': '중국어(간체)', 'es': '스페인어' }
    },
    'en': {
        controllerTitle: 'Auto Translator Controller',
        sourceLangLabel: 'Source Language:',
        targetLangLabel: 'Target Language:',
        langChangeWarning: '※ Changing language will reload the page.',
        selectFolderBtn: '1. Select Folder',
        startBtn: '2. Start Translation',
        retryBtn: 'Retry Image Upload',
        stopBtn: 'Force Stop',
        statusWaiting: 'Waiting...',
        statusFilesLoaded: (count) => `${count} image(s) loaded.`,
        statusNotFound: 'No images found.',
        statusProcessing: (current, total, name) => `[${current}/${total}] Processing ${name}...`,
        statusSaved: (name) => `[Saved] ${name}`,
        statusError: (name, msg) => `[Error] ${name}: ${msg}.`,
        statusStopped: 'Stopped by user.',
        statusAllDone: 'All image tasks completed!',
        uiLangLabel: 'UI Language:',
        langOptions: { 'auto': 'Auto-detect', 'ko': 'Korean', 'en': 'English', 'ja': 'Japanese', 'zh-CN': 'Chinese (Simp.)', 'es': 'Spanish' }
    }
};

// --- 2. UI 생성 및 언어 설정 ---
const systemLang = (navigator.language || 'en').split('-')[0];
let currentUiLang = i18n[systemLang] ? systemLang : 'en';

// 네온 효과를 위한 스타일 추가
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes neon-glow-blue {
    0%, 100% { box-shadow: 0 0 5px #4285f4, 0 0 10px #4285f4, 0 0 15px #4285f4; }
    50% { box-shadow: 0 0 10px #4285f4, 0 0 20px #4285f4, 0 0 30px #4285f4; }
  }
  @keyframes neon-glow-red {
    0%, 100% { box-shadow: 0 0 5px #d93025, 0 0 10px #d93025, 0 0 15px #d93025; }
    50% { box-shadow: 0 0 10px #d93025, 0 0 20px #d93025, 0 0 30px #d93025; }
  }
  .neon-blue { animation: neon-glow-blue 1.5s ease-in-out; }
  .neon-red { animation: neon-glow-red 1.5s ease-in-out; }
  
  #auto-select-btn:hover { box-shadow: 0 0 3px #4285f4, 0 0 6px #4285f4; }
  #auto-start-btn:hover { box-shadow: 0 0 3px #34a853, 0 0 6px #34a853; }
  #auto-stop-btn:hover { box-shadow: 0 0 3px #d93025, 0 0 6px #d93025; }
  #auto-retry-btn:hover { box-shadow: 0 0 3px #fbbc04, 0 0 6px #fbbc04; }
`;
document.head.appendChild(styleSheet);


const controlPanel = document.createElement('div');
controlPanel.id = 'auto-translator-panel';
controlPanel.style.cssText = `position: fixed; bottom: 20px; right: 20px; background-color: white; border: 2px solid #4285f4; border-radius: 8px; padding: 15px; z-index: 999999; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: sans-serif; width: 300px; transition: box-shadow 0.3s;`;

controlPanel.innerHTML = `
  <h3 id="auto-title" style="margin-top:0; font-size: 16px;"></h3>
  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
    <div style="width: 48%;"><label id="auto-sl-label" style="font-size: 11px; font-weight: bold; display: block; margin-bottom: 3px;"></label><select id="auto-sl-lang" style="width: 100%; padding: 4px; border-radius: 3px; font-size: 11px;"></select></div>
    <div style="width: 48%;"><label id="auto-tl-label" style="font-size: 11px; font-weight: bold; display: block; margin-bottom: 3px;"></label><select id="auto-tl-lang" style="width: 100%; padding: 4px; border-radius: 3px; font-size: 11px;"></select></div>
  </div>
  <p id="auto-warning" style="font-size: 10px; color: #d93025; margin-bottom: 12px; margin-top: 4px;"></p>
  <button id="auto-select-btn" style="width:100%; padding:8px; background:#4285f4; color:white; border:none; border-radius:4px; cursor:pointer; margin-bottom: 5px; font-size: 13px; transition: box-shadow 0.2s;"></button>
  <button id="auto-start-btn" style="width:100%; padding:8px; background:#34a853; color:white; border:none; border-radius:4px; cursor:pointer; display:none; margin-bottom: 5px; font-size: 13px; transition: box-shadow 0.2s;"></button>
  <button id="auto-stop-btn" style="width:100%; padding:8px; background:#d93025; color:white; border:none; border-radius:4px; cursor:pointer; display:none; margin-bottom: 5px; font-size: 13px; transition: box-shadow 0.2s;"></button>
  <div id="auto-status" style="margin-top:10px; font-size:12px; font-weight:bold; color:#555;"></div>
  <div id="auto-progress-container" style="background: #eee; border-radius: 4px; padding: 1px; margin-top: 8px; display: none;">
    <div id="auto-progress-bar" style="height: 12px; background: #4285f4; width: 0%; border-radius: 3px; transition: width 0.3s ease;"></div>
  </div>
  <div style="position: relative; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; align-items: center;">
    <button id="auto-retry-btn" style="width: auto; padding: 4px 8px; background:#fbbc04; color:#333; border:none; border-radius:4px; cursor:pointer; font-size: 11px; transition: box-shadow 0.2s; display: none;"></button>
    <div style="margin-left: auto;">
      <label id="auto-ui-lang-label" for="auto-ui-lang" style="font-size: 12px;"></label>
      <select id="auto-ui-lang" style="padding: 2px; border-radius: 3px; font-size: 11px;"><option value="ko">한국어</option><option value="en">English</option></select>
    </div>
  </div>
`;
document.body.appendChild(controlPanel);

const statusDiv = document.getElementById('auto-status');
const slSelect = document.getElementById('auto-sl-lang');
const tlSelect = document.getElementById('auto-tl-lang');

function updateUIText(lang) {
    currentUiLang = lang;
    const texts = i18n[lang];
    document.getElementById('auto-title').innerText = texts.controllerTitle;
    document.getElementById('auto-sl-label').innerText = texts.sourceLangLabel;
    document.getElementById('auto-tl-label').innerText = texts.targetLangLabel;
    document.getElementById('auto-warning').innerText = texts.langChangeWarning;
    document.getElementById('auto-select-btn').innerText = texts.selectFolderBtn;
    document.getElementById('auto-start-btn').innerText = texts.startBtn;
    document.getElementById('auto-stop-btn').innerText = texts.stopBtn;
    document.getElementById('auto-retry-btn').innerText = texts.retryBtn;
    document.getElementById('auto-ui-lang-label').innerText = texts.uiLangLabel;

    slSelect.innerHTML = Object.entries(texts.langOptions).map(([value, text]) => `<option value="${value}">${text}</option>`).join('');
    tlSelect.innerHTML = Object.entries(texts.langOptions).filter(([value]) => value !== 'auto').map(([value, text]) => `<option value="${value}">${text}</option>`).join('');
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentSl = urlParams.get('sl') || 'auto';
    const currentTl = urlParams.get('tl') || systemLang;
    if(slSelect.querySelector(`option[value="${currentSl}"]`)) slSelect.value = currentSl;
    if(tlSelect.querySelector(`option[value="${currentTl}"]`)) tlSelect.value = currentTl;

    if (!isProcessing) {
        if (imageFiles.length > 0) statusDiv.innerText = texts.statusFilesLoaded(imageFiles.length);
        else statusDiv.innerText = texts.statusWaiting;
    }
}

const uiLangSelect = document.getElementById('auto-ui-lang');
uiLangSelect.addEventListener('change', (e) => {
    updateUIText(e.target.value);
    chrome.storage.local.set({ uiLanguage: e.target.value });
});

// --- 3. 기존 로직 ---
let dirHandle = null;
let translatedDirHandle = null;
let imageFiles = [];
let currentIndex = 0;
let isProcessing = false;
let forceStop = false;
let processedBlobUrls = new Set();
let currentProcessTimeout = null;

function updateLanguageAndReload() {
    window.location.href = `https://translate.google.com/?sl=${slSelect.value}&tl=${tlSelect.value}&op=images`;
}
slSelect.addEventListener('change', updateLanguageAndReload);
tlSelect.addEventListener('change', updateLanguageAndReload);

document.getElementById('auto-select-btn').addEventListener('click', async () => {
    try {
        dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        translatedDirHandle = await dirHandle.getDirectoryHandle('Translated', { create: true });
        imageFiles = [];
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
                imageFiles.push(entry);
            }
        }
        imageFiles.sort((a, b) => a.name.localeCompare(b.name));
        
        const startBtn = document.getElementById('auto-start-btn');
        if (imageFiles.length > 0) {
            statusDiv.innerText = i18n[currentUiLang].statusFilesLoaded(imageFiles.length);
            startBtn.style.display = 'block';
        } else {
            statusDiv.innerText = i18n[currentUiLang].statusNotFound;
            startBtn.style.display = 'none';
        }
    } catch (err) { /* ... */ }
});

document.getElementById('auto-start-btn').addEventListener('click', () => {
    if (imageFiles.length === 0 || isProcessing) return;
    isProcessing = true;
    forceStop = false;
    currentIndex = 0;
    processedBlobUrls.clear();
    document.getElementById('auto-select-btn').style.display = 'none';
    document.getElementById('auto-start-btn').style.display = 'none';
    document.getElementById('auto-stop-btn').style.display = 'block';
    document.getElementById('auto-retry-btn').style.display = 'block'; // 항상 보이도록
    document.getElementById('auto-progress-container').style.display = 'block';
    document.getElementById('auto-progress-bar').style.width = '0%';
    document.getElementById('auto-progress-bar').style.backgroundColor = '#4285f4';
    slSelect.disabled = true;
    tlSelect.disabled = true;
    processNextImage();
});

document.getElementById('auto-stop-btn').addEventListener('click', () => {
    if (isProcessing) {
        forceStop = true;
    }
});

document.getElementById('auto-retry-btn').addEventListener('click', () => {
    if (!isProcessing) return; // 이미 중단/완료되었으면 실행 안함

    // 현재 진행중인 작업이 있다면 중단하고 재시도
    if (currentProcessTimeout) {
        clearTimeout(currentProcessTimeout);
    }
    
    statusDiv.style.color = '#555';
    clickClearSVGButton(); 
    currentProcessTimeout = setTimeout(processNextImage, 500);
});

function triggerNeonAnimation(colorClass) {
    const panel = document.getElementById('auto-translator-panel');
    panel.classList.remove('neon-blue', 'neon-red');
    setTimeout(() => {
        panel.classList.add(colorClass);
        setTimeout(() => panel.classList.remove(colorClass), 1500);
    }, 50);
}

function stopProcessing() {
    isProcessing = false;
    if (currentProcessTimeout) {
        clearTimeout(currentProcessTimeout);
    }
    
    triggerNeonAnimation('neon-red');

    const texts = i18n[currentUiLang];
    statusDiv.innerText = texts.statusStopped;
    statusDiv.style.color = '#d93025';
    
    const progressBar = document.getElementById('auto-progress-bar');
    progressBar.style.backgroundColor = '#d93025';
    
    document.getElementById('auto-select-btn').style.display = 'block';
    document.getElementById('auto-start-btn').style.display = 'block';
    document.getElementById('auto-stop-btn').style.display = 'none';
    document.getElementById('auto-retry-btn').style.display = 'none';
    
    slSelect.disabled = false;
    tlSelect.disabled = false;
    
    clickClearSVGButton();
}

async function processNextImage() {
    if (forceStop) {
        stopProcessing();
        return;
    }
    
    const texts = i18n[currentUiLang];
    const progressBar = document.getElementById('auto-progress-bar');
    const progressContainer = document.getElementById('auto-progress-container');
    
    if (isProcessing) {
        const progress = imageFiles.length > 0 ? (currentIndex * 100) / imageFiles.length : 0;
        progressBar.style.width = `${progress}%`;
    }

    if (currentIndex >= imageFiles.length) {
        statusDiv.innerText = texts.statusAllDone;
        statusDiv.style.color = '#137333';
        isProcessing = false;
        
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#34a853';
        
        triggerNeonAnimation('neon-blue');

        document.getElementById('auto-select-btn').style.display = 'block';
        document.getElementById('auto-start-btn').style.display = 'block';
        document.getElementById('auto-stop-btn').style.display = 'none';
        document.getElementById('auto-retry-btn').style.display = 'none';
        slSelect.disabled = false;
        tlSelect.disabled = false;
        
        currentProcessTimeout = setTimeout(() => {
            progressContainer.style.display = 'none';
            progressBar.style.backgroundColor = '#4285f4';
        }, 4000);
        return;
    }

    const fileEntry = imageFiles[currentIndex];
    const file = await fileEntry.getFile();
    
    statusDiv.innerText = texts.statusProcessing(currentIndex + 1, imageFiles.length, file.name);
    statusDiv.style.color = '#555';

    try {
        await uploadImage(file);
        if (forceStop) { stopProcessing(); return; }
        
        const translatedDataUrl = await getTranslatedImageData();
        if (forceStop) { stopProcessing(); return; }
        
        await saveImage(translatedDataUrl, file.name);
        if (forceStop) { stopProcessing(); return; }
        
        statusDiv.innerText = texts.statusSaved(file.name);
        clickClearSVGButton();
        currentIndex++;
        currentProcessTimeout = setTimeout(processNextImage, 1500);
    } catch (error) {
        if (forceStop) { stopProcessing(); return; }
        
        console.error(error);
        statusDiv.innerText = texts.statusError(file.name, error.message);
        statusDiv.style.color = 'red';
        // 오류 발생 시에는 재시도 버튼이 이미 보이므로, 특별히 할 작업 없음
    }
}

function clickClearSVGButton() {
    const buttons = findInShadow('button');
    for (const btn of buttons) {
        if (btn.innerHTML.includes('M19 6.41L17.59 5')) {
            if (btn.getBoundingClientRect().width > 0) {
                btn.click();
                return true;
            }
        }
    }
    return false;
}

async function saveImage(dataUrl, originalFileName) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const extIndex = originalFileName.lastIndexOf('.');
    const nameWithoutExt = extIndex > 0 ? originalFileName.substring(0, extIndex) : originalFileName;
    const ext = extIndex > 0 ? originalFileName.substring(extIndex) : '.jpg';
    const newFileName = `${nameWithoutExt}-translated-${tlSelect.value}${ext}`;
    const newFileHandle = await translatedDirHandle.getFileHandle(newFileName, { create: true });
    const writable = await newFileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const inputElements = document.querySelectorAll('input[type="file"]');
        if (inputElements.length === 0) return reject(new Error('업로드 요소를 찾을 수 없습니다.'));
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElements.forEach(inputElement => {
            try {
                inputElement.value = '';
                inputElement.files = dataTransfer.files;
                ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click', 'change', 'input'].forEach(e => inputElement.dispatchEvent(new Event(e, { bubbles: true })));
                const dropZone = inputElement.closest('label') || inputElement.parentElement;
                if (dropZone) dropZone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
            } catch (e) {}
        });
        currentProcessTimeout = setTimeout(resolve, 1500);
    });
}

function findInShadow(selector, root = document.body) {
    const results = Array.from(root.querySelectorAll(selector));
    const shadowRoots = Array.from(root.querySelectorAll('*')).filter(el => el.shadowRoot);
    for (const shadowHost of shadowRoots) {
        results.push(...findInShadow(selector, shadowHost.shadowRoot));
    }
    return results;
}

function getTranslatedImageData() {
    return new Promise((resolve, reject) => {
        const maxWaitTime = 40000;
        const checkInterval = 1000;
        let elapsedTime = 0;
        let checkIntervalId = null;

        const startChecking = () => {
            if (forceStop) return reject(new Error('Stopped'));
            
            checkIntervalId = setInterval(() => {
                if (forceStop) {
                    clearInterval(checkIntervalId);
                    return reject(new Error('Stopped'));
                }
                
                elapsedTime += checkInterval;
                const images = findInShadow('img.Jmlpdc');
                const blobImages = images.filter(img => img.src && img.src.startsWith('blob:') && img.naturalWidth > 100 && !processedBlobUrls.has(img.src));
                if (blobImages.length > 0) {
                    clearInterval(checkIntervalId);
                    blobImages.sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight));
                    const targetImg = blobImages[0];
                    processedBlobUrls.add(targetImg.src);
                    
                    currentProcessTimeout = setTimeout(() => {
                        if (forceStop) return reject(new Error('Stopped'));
                        
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = targetImg.naturalWidth;
                            canvas.height = targetImg.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(targetImg, 0, 0);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                            resolve(dataUrl);
                        } catch (e) {
                            reject(new Error('데이터 추출 보안 오류 (Tainted Canvas)'));
                        }
                    }, 1000);
                    return;
                }
                if (elapsedTime >= maxWaitTime) {
                    clearInterval(checkIntervalId);
                    reject(new Error('이미지 교체 실패 (지원하지 않는 형식이거나 파일 오류)'));
                }
            }, checkInterval);
        };
        
        currentProcessTimeout = setTimeout(startChecking, 1000);
    });
}

// --- 4. 초기 실행 ---
chrome.storage.local.get('uiLanguage', (data) => {
    const lang = data.uiLanguage || (i18n[systemLang] ? systemLang : 'en');
    uiLangSelect.value = lang;
    updateUIText(lang);
});