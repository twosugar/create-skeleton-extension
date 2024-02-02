console.log("easy script loaded!");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { selector } = request
  // 在这里处理接收到的消息
  const styleContent = createStyle();
  const domStr = createSkeleton({ selector });
  chrome.runtime.sendMessage({ html: domStr, style: styleContent });
});

const createStyle = () => {
  const styleDom = document.createElement("style");
  const color = "#f7f8fb";
  const styleContent = ` .skeleton-common {
    background-color: ${color};
    background-size: 400% 100%;
  }`;
  styleDom.innerHTML = styleContent;
  document.head.appendChild(styleDom);
  return styleContent;
};

const createSkeleton = (params) => {
  const { selector = "body" } = params;
  const windowWidth = document.body.clientWidth;

  const dom = document.querySelector(selector);
  if (!dom) {
    return;
  }

  const fn = (dom) => {
    if (!dom.children || !dom.children.length) {
      return [];
    }
    for (const ele of dom.children) {
      if (ele.children?.length) {
        fn(ele);
        continue;
      }
      ele.style.maxWidth = "max-content";
      let width = Math.floor((ele.clientWidth / windowWidth) * 100) + "vw";
      let height = Math.floor(ele.clientHeight) + "px";
      if (ele.clientHeight === ele.clientWidth) {
        width = ele.clientWidth + "px";
      }
      var skeleton = document.createElement("div");
      skeleton.style.width = width;
      skeleton.style.height = height;
      const className = ele.getAttribute("class");
      skeleton.setAttribute("class", `${className || ""} skeleton-common`);
      ele.parentNode.replaceChild(skeleton, ele);
    }
  };
  fn(dom);

  return document.querySelector(selector).outerHTML;
};
