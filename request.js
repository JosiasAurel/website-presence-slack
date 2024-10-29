const config = {
    CLIENT_ID: "7925454487591.7940048543043",
    CLIENT_SECRET: "59258de64885c09a37b8d8faff8ef1a7"
};

async function oauth2Flow() {
    const url = "https://slack.com/api/oauth.v2.access";

    // create request body
    const formData = new FormData();

    formData.set("client_id", config.CLIENT_ID);
    formData.set("client_secret", config.CLIENT_SECRET);

    const response = await fetch(url, {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        // },
        body: formData
    });
    const data = await response.json();

    console.log("Got response: ", data);
}

oauth2Flow();