const popupI18n = {
    'ko': {
        title: '이미지 자동 번역기',
        p1: '이 확장 프로그램은 구글 번역 페이지 자체에 내장된 컨트롤러를 사용합니다.',
        p2: '아래 버튼을 눌러 페이지를 열고, <br><span class="highlight">화면 우측 하단의 컨트롤러</span>를 사용해 주세요.',
        openBtn: '구글 이미지 번역 열기',
        helpBtn: '도움말 (사용법 보기)',
        help1: '<b>구글 이미지 번역 열기</b> 버튼을 클릭합니다.',
        help2: '새로 열린 구글 번역 페이지 우측 하단의 <b>컨트롤러</b>에서 <b>원본 언어</b>와 <b>번역 언어</b>를 설정합니다. (변경 시 페이지가 자동으로 새로고침 됩니다)',
        help3: '<b>1. 폴더 선택</b>을 누르고, 번역할 이미지가 있는 폴더에 들어가 파일들을 전체 드래그하여 선택한 후 \'열기\'를 누릅니다.',
        help4: '<b>2. 번역 시작</b> 버튼을 누르면 순차적으로 번역되어 원본 폴더 내의 Translated 폴더에 자동 저장됩니다.',
        uiLangLabel: 'UI 언어:'
    },
    'en': {
        title: 'Auto Image Translator',
        p1: 'This extension uses a built-in controller on the Google Translate page itself.',
        p2: 'Click the button below to open the page, and use the <br><span class="highlight">controller at the bottom right</span> of the screen.',
        openBtn: 'Open Google Image Translate',
        helpBtn: 'Help (How to use)',
        help1: 'Click the <b>Open Google Image Translate</b> button.',
        help2: 'In the new tab, use the <b>controller</b> at the bottom right to set the <b>Source Language</b> and <b>Target Language</b>. (The page will reload upon changing)',
        help3: 'Click <b>1. Select Folder</b>, navigate to the folder containing your images, drag to select all files, and click "Open".',
        help4: 'Click <b>2. Start Translation</b>. Images will be translated sequentially and saved automatically in the "Translated" subfolder.',
        uiLangLabel: 'UI Language:'
    }
};

const systemLang = (navigator.language || 'en').split('-')[0];
const initialPopupLang = popupI18n[systemLang] ? systemLang : 'en';

function updatePopupUI(lang) {
    const texts = popupI18n[lang];
    document.getElementById('popup-title').innerText = texts.title;
    document.getElementById('popup-p1').innerText = texts.p1;
    document.getElementById('popup-p2').innerHTML = texts.p2; // span 유지를 위해 innerHTML
    document.getElementById('openTranslateBtn').innerText = texts.openBtn;
    document.getElementById('helpBtn').innerText = texts.helpBtn;
    document.getElementById('help-li-1').innerHTML = texts.help1;
    document.getElementById('help-li-2').innerHTML = texts.help2;
    document.getElementById('help-li-3').innerHTML = texts.help3;
    document.getElementById('help-li-4').innerHTML = texts.help4;
    document.getElementById('popup-ui-lang-label').innerText = texts.uiLangLabel;
    
    // 선택된 언어를 로컬 스토리지에 저장하여 content.js에서도 활용하도록 함
    chrome.storage.local.set({ uiLanguage: lang });
}

// 초기 UI 설정
const popupLangSelect = document.getElementById('popup-ui-lang');
popupLangSelect.value = initialPopupLang;
updatePopupUI(initialPopupLang);

// UI 언어 변경 이벤트
popupLangSelect.addEventListener('change', (e) => {
    updatePopupUI(e.target.value);
});

document.getElementById('openTranslateBtn').addEventListener('click', () => {
    // 번역 언어는 시스템 기본 언어로, 원본 언어는 'auto'(언어 감지)
    chrome.tabs.create({ url: `https://translate.google.com/?sl=auto&tl=${systemLang}&op=images` });
});

document.getElementById('helpBtn').addEventListener('click', () => {
    const helpContent = document.getElementById('helpContent');
    if (helpContent.style.display === 'block') {
        helpContent.style.display = 'none';
    } else {
        helpContent.style.display = 'block';
    }
});