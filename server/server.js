const express = require("express");

const app = express();

app.use(express.json());

const config = {
    CLIENT_ID: "SLACK_CLIENT_ID",
    CLIENT_SECRET: "SLACK_CLIENT_SECRET"
};

async function oauth2Flow(code) {
    const url = "https://slack.com/api/oauth.v2.access";

    // create request body
    const formData = new FormData();

    formData.set("client_id", config.CLIENT_ID);
    formData.set("client_secret", config.CLIENT_SECRET);
    formData.set("code", code);

    const response = await fetch(url, {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        // },
        body: formData
    });
    const data = await response.json();

    console.log("Got response: ", data);
    return data.authed_user.access_token;
}

app.get("/", (req, res) => res.send("Hello"));

app.get("/oauth-flow", async (req, res) => {
    const body = req.body;
    const temporaryCode = req.query.code;

    const accessToken = await oauth2Flow(temporaryCode);

    const message = { accessToken };

    res.send(`
            <h1>hello world</h1>
            <script> 
            const extensionID = "your_extension_id";

            setInterval(() => {
                chrome.runtime.sendMessage(extensionID, ${JSON.stringify(message)},
                    response => console.log(response)
                );
            }, 1000);
            
            </script>
        `)

    // res.json({
    //     ok: true,
    //     token: accessToken
    // });

});


app.get("/set-status", async (req, res) => {
    await changeUserStatus();
    res.send("Should have set your status");
});

async function changeUserStatus() {
    const access_token = "test_user_access_token";

    // const formData = new FormData();

    // formData.set("token", access_token);
    
    const response = await fetch("https://slack.com/api/users.profile.set", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
            profile: {
                status_text: "Livestreaming",
            }
        })
    });

    const data = response.json();
}

app.listen(3000, () => console.log("Listening on port 3000"));
