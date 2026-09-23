require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/whoami", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: `You are ${command.user_name}` });
});
app.command("/whoishelp", async ({ command, ack, respond }) => {
    await ack();
    await respond({text: "This is whoami. Use the command /whoami to know your user id. it has some cool features like /phrases, that say phrases."});
});
app.command("/kittyfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `:3 Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/phrases", async ({ ack, say }) => {
    await ack();
    try {
        const response = await axios.get("https://api.kanye.rest");
        await say({ text: `Once a philosopher said this:\n${response.data.quote}` });
    } catch (err) {
        await say({ text: "you tell the phrases" });
    }
});
//app command
app.command("/whysoserious", async ({ ack, say }) => {
    await ack();
    try {
        const response = await axios.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
        if (response.data.type === "single") {
            await say({ text: `Here's a joke for you:\n${response.data.joke}` });
        } else {
            await say({ text: `Here's a joke for you:\n${response.data.setup}\n${response.data.delivery}` });
        }
    } catch (err) {
        await say({ text: "shi aint funny nomo" });
    }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
