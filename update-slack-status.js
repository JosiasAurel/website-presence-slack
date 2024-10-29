// import { changeUserStatus, getCurrentActiveTab } from "./main.js";

export async function getCurrentActiveTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return { id: tab?.id, favicon: tab?.favIconUrl, title: tab?.title, url: tab?.url};
}

export async function changeUserStatus(activeTab) {
    chrome.storage.local.get(["slackAccessToken"]).then(async (result) => {
        const accessToken = result.slackAccessToken;

        const response = await fetch("https://slack.com/api/users.profile.set", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                profile: {
                    status_text: activeTab.title,
                }
            })
        });

        const data = response.json();
    });
}


let lastActiveTab = "";
setInterval(async () => {
    const activeTab = await getCurrentActiveTab();
    if (activeTab.title !== lastActiveTab) {
        lastActiveTab = activeTab.title;
        changeUserStatus(activeTab);
    }
}, 2000);