document.getElementById("authenticate-me").addEventListener("click", async () => {
   const url = "https://slack.com/oauth/v2/authorize?scope=&user_scope=users.profile%3Awrite&redirect_uri=https%3A%2F%2Fd047-129-0-205-255.ngrok-free.app%2Foauth-flow&client_id=7925454487591.7940048543043";
    const popupWindow = window.open(url, "slack auth",'width=600,height=600');

    popupWindow.focus();


    chrome.runtime.onMessageExternal.addListener(message => {
        chrome.storage.local.set({ slackAccessToken: message.accessToken })
            .then(() => {
                popupWindow.close();
            })
            .catch(() => console.log("failed to write to local storage"));
    });
});