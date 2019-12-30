save_options = () => {
  const avoidMergeCommitsOption = document.getElementById("avoidMergeCommits")
    .checked;
  const copyToClipboardOption = document.getElementById("copyClipboard")
    .checked;
  chrome.storage.sync.set(
    {
      avoidMergeCommitsOption: avoidMergeCommitsOption,
      copyToClipboard: copyToClipboardOption
    },
    () => {
      const status = document.getElementById("status");
      status.textContent = "Options saved!";
      setTimeout(() => {
        status.textContent = "";
      }, 1000);
    }
  );
};

restore_options = () => {
  chrome.storage.sync.get(
    {
      avoidMergeCommitsOption: true,
      copyToClipboard: true
    },
    items => {
      document.getElementById("avoidMergeCommits").checked =
        items.avoidMergeCommitsOption;
      document.getElementById("copyClipboard").checked = items.copyToClipboard;
    }
  );
};

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
