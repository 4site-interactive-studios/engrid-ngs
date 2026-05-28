export const customScript = function (App) {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here
  App.setBodyData("client-js-loading", "finished");

  // ** PROGRESS BAR COUNT POSITIONING **
  const progressBar = document.querySelector(".en__component--widgetblock");
  if (progressBar) {
    // Progress bar takes a moment to load, so we need to wait for it to be fully rendered before we can move the count element
    if (!progressBar.querySelector(".enWidget__fill__count")) {
    } else {
      const count = progressBar.querySelector(".enWidget__fill__count");
      if (count) {
        const progress = progressBar.querySelector(".enWidget__progress");
        progress?.appendChild(count);
      }
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const count = progressBar.querySelector(".enWidget__fill__count");
          if (count) {
            const progress = progressBar.querySelector(".enWidget__progress");
            progress?.appendChild(count);
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(progressBar, { childList: true, subtree: true });
  }
  // ** END PROGRESS BAR COUNT POSITIONING **
};
