// 이 파일은 더 이상 사용되지 않습니다.
// 모든 로직이 content.js와 popup.js(미래에 추가될 수 있음)에서 처리됩니다.
// Manifest V3에서는 Service Worker가 필요하지만, 현재 구조에서는 비워둡니다.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Image Translator extension installed.");
});