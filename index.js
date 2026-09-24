require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.command("/whoami", async ({ command, ack, say }) => {
  let x = getRandomInt(100);
  await ack();
  if (x == 99) {
    await say({ text: 'Wow. congrats, i think.'})
  }
  else {
    await say({ text: `You are ${command.user_name}` });
  }
});
app.command("/whoishelp", async ({ command, ack, say }) => {
    await ack();
    await say({text: "This is whoami. Use the command /whoami to know your user id. it has some cool features like /phrases, that say phrases."});
});
app.command("/kittyfact", async ({ ack, say }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await say({ text: `:3 Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await say({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/phrases", async ({ command,ack, say }) => {
    await ack();
    try {
        const response = await axios.get("https://api.kanye.rest");
    await say({ text: `Once ${command.user_name} said this:\n${response.data.quote}` });
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
app.message(/laufey/i, async function ({ message, say }) {
  try {  
    await say({
      blocks: [
        {
          type: "image",
          image_url: "https://cdn.hackclub.com/01a0d520-abc1-7820-a1d7-552f6b553a47/laufey-cube.gif",
          alt_text: "A funny gif"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `wow. all cuz of <@${message.user}>.`
          }
        }
      ]
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
});
let i = 0;
app.message('test123', async function ({ message, say }) {
    await say(`test` + i);
    i++;
  });


app.message(/clairo/i, async function ({ message, say }) {
    try {
      await say({
    blocks: [
      {
        type: "image",
        image_url: "https://cdn.hackclub.com/01a0d538-7815-7d72-8a91-18978bc62cc0/clairo-phone-call.gif",
        alt_text: "A funny gif"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `wow. all cuz of <@${message.user}>.`
        }
      }
    ]
  });
} catch (error) {
  console.error("Error sending message:", error);
}
});
(async () => {
  await app.start();
  console.log("bot is running!");
})();
