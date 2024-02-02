const sendMessage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    const selectorValue = document.querySelector("#selector-input").value;
    chrome.tabs.sendMessage(activeTab.id, { selector: selectorValue });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  var submit_btn = document.getElementById("submit-btn");
  submit_btn.addEventListener("click", sendMessage);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const htmlArea = document.querySelector("#html-area");
  const styleArea = document.querySelector("#style-area");
  htmlArea.innerHTML = request.html;
  styleArea.innerHTML = request.style;
});
