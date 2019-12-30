const gitLabDescriptionFieldClass =
  "note-textarea qa-issuable-form-description rspec-issuable-form-description js-gfm-input js-autosize markdown-area";

const writeToDescriptionField = content => {
  let descriptionInput = "";
  content.map(eachCommit => {
    descriptionInput = descriptionInput + "* " + eachCommit + " \n\r";
  });
  document.getElementsByClassName(
    gitLabDescriptionFieldClass
  )[0].value = descriptionInput;
  console.log("desc", descriptionInput);
};

chrome.runtime.onMessage.addListener(request => {
  if (request.type === "triggerCommitsCopy") {
    copyCommitsFromGitlab();
  } else if (request.type === "finalCommitsList") {
    console.log("finally here", request);
    if (
      document.getElementsByClassName(gitLabDescriptionFieldClass).length > 0
    ) {
      writeToDescriptionField(request.list);
    }
  }
});

const gitlabCommitClass =
  "commit-row-message item-title js-onboarding-commit-item";

const copyCommitsFromGitlab = () => {
  let commitSelectors = document.getElementsByClassName(gitlabCommitClass);
  let commitSelectorsArray = [...commitSelectors];
  let commitTextList = [];
  commitSelectorsArray &&
    commitSelectorsArray.length > 0 &&
    commitSelectorsArray.map(eachSelector => {
      commitTextList.push(eachSelector.text);
    });
  chrome.runtime.sendMessage({ commitTextList });
};
