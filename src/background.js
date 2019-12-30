/*global chrome*/
const copyContent = val => {
  const dummy = document.createElement("input");
  dummy.style.display = "block";
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  dummy.setAttribute("value", val);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

const filterMergedCommits = commitTextList => {
  let filteredOutCommits = commitTextList.filter(
    eachCommit => !eachCommit.startsWith("Merge branch")
  );
  console.log("Filtered", filteredOutCommits);
  return filteredOutCommits;
};

const sendFinalList = list => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "finalCommitsList",
      list
    });
  });
};

const showForPages = [
  "*://gitlab.com/",
  "*://gitlab.org/*",
  "*://git.imepay.com.np/*"
];

chrome.contextMenus.create({
  id: "copyCommits",
  title: "Copy commits",
  contexts: ["page"],
  documentUrlPatterns: showForPages
});

chrome.contextMenus.onClicked.addListener(content => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (content.menuItemId === "copyCommits") {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "triggerCommitsCopy"
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.commitTextList && message.commitTextList.length > 0) {
    if (chrome.storage) {
      chrome.storage.sync.get(
        { avoidMergeCommitsOption: true, copyToClipboard: true },
        items => {
          if (items.copyToClipboard) {
            copyContent(message.commitTextList.toString());
          }
          if (items.avoidMergeCommitsOption) {
            sendFinalList(filterMergedCommits(message.commitTextList));
          } else {
            sendFinalList(message.commitTextList);
          }
        }
      );
    } else {
      copyContent(message.commitTextList.toString());
    }
  }
});
