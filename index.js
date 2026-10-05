require("dotenv").config();
//const { OpenRouter } = require("@openrouter/sdk");
const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  conversationStore: false
});

// Register global error handler first to catch all unhandled middleware exceptions
app.error(async (error) => {
  console.error("Bolt caught an unhandled error:", error);
});

//

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.command("/whoami", async ({ command, ack, say }) => {
  await ack();
  let x = getRandomInt(100);
  if (x === 99) {
    await say({ text: "Wow. congrats, i think." });
  } else {
    await say({ text: `You are ${command.user_name}` });
  }
});

app.command("/whoishelp", async ({ ack, say }) => {
  await ack();
  await say({
    text: "This is whoami. Use the command /whoami to know your user id. it has some cool features like /phrases, that say phrases."
  });
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

app.command("/phrases", async ({ command, ack, say }) => {
  await ack();
  try {
    const response = await axios.get("https://api.kanye.rest");
    await say({ text: `Once ${command.user_name} said this:\n${response.data.quote}` });
  } catch (err) {
    await say({ text: "you tell the phrases" });
  }
});



app.command("/whysoserious", async ({ ack, say }) => {
  await ack();
  try {
    const response = await axios.get(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
    );
    if (response.data.type === "single") {
      await say({ text: `Here's a joke for you:\n${response.data.joke}` });
    } else {
      await say({ text: `Here's a joke for you:\n${response.data.setup}\n${response.data.delivery}` });
    }
  } catch (err) {
    await say({ text: "shi aint funny nomo" });
  }
});

app.message(/laufey/i, async ({ message, say }) => {
  try {
    await say({
      blocks: [
        {
          type: "image",
          image_url: "https://cdn.hackclub.com/01a0d520-abc1-7820-a1d7-552f6b553a47/laufey-cube.gif",
          alt_text: "A funny gif",
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
  console.error("===== AI ERROR =====");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("STATUS:", error?.status);
  console.error("RESPONSE:", error?.response?.data);
  console.error("CAUSE:", error?.cause);

  await respond(`AI error: ${error?.message || "Unknown error"}`);
  }
});

let i = 0;
app.message("test123", async ({ say }) => {
  await say(`test` + i);
  i++;
});

app.message(/clairo/i, async ({ message, say }) => {
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

app.message(/am i bonita/i, async ({ message, say }) => {
  try {
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Is <@${message.user}> bonita, chat?`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "yeah",
                emoji: false
              },
              style: "primary",
              action_id: "bonita_yes"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "hell naw",
                emoji: false
              },
              style: "danger",
              action_id: "bonita_no"
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
});

app.action("bonita_yes", async ({ ack, say }) => {
  await ack();
  await say("yeah, you are bonita");
});

app.action("bonita_no", async ({ ack, say }) => {
  await ack();
  await say("no, you are not bonita");
});

app.command("/ai", async ({ ack, respond }) => {
  await ack();
  await respond("why do you want ai?");
});

app.command("/gib-ai", async ({ command, ack, respond }) => {
  await ack();

  const prompt = command.text?.trim();

  if (!prompt) {
    await respond("Please provide a prompt! (e.g. `/gib-ai explain gravity`)");
    return;
  }

  try {
    const response = await axios.post(
      "https://ai.hackclub.com/proxy/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response received from the model.";

    await respond({
      response_type: "in_channel",
      text: reply
    });

  } catch (error) {
    console.error(
      "Error generating AI response:",
      error.response?.data || error.message
    );

    await respond({
      response_type: "ephemeral",
      text: `AI error: ${
        error.response?.data?.error?.message ||
        error.message ||
        "Unknown error"
      }`
    });
  }
});

app.command("/capitalof", async ({ command, ack, respond }) => {
  await ack();

  try {
    const country = command.text?.trim();

    if (!country) {
      await respond("Please enter a country. Example: `/capitalof Brazil`");
      return;
    }

    const response = await axios.get(
      `https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(country)}?pretty=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`
        }
      }
    );

    console.log(response.data);

    const result = response.data.data.objects[0];
    const capital = result.capitals?.[0]?.name;

    await respond(
      capital
        ? `The capital of ${country} is *${capital}*.`
        : `I couldn't find the capital of ${country}.`
    );

  } catch (error) {
    console.error(error.response?.data || error.message);

    await respond("I couldn't find that country.");
  }
});

const answers = ["yes", "no", "maybe", "definitely", "absolutely not", "ask again later"];
app.command("/8ball", async ({ command, ack, respond }) => {
  await ack();
  const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
  await respond({
    response_type: "in_channel",
    text: `🎱 ${randomAnswer}`
  });
});
app.message(/misinput/i, async ({ message, say }) => {
  try {
    await say({
      blocks: [
        {
          type: "image",
          image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.kym-cdn.com%2Fphotos%2Fimages%2Foriginal%2F002%2F354%2F787%2F01b.gif&f=1&nofb=1&ipt=d4edb9d4b99840befc801a2573643d48edd231fe5805c4ea235711a9097cef6c&ipo=images",
          alt_text: "A funny gif"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `IT WAS AN MISINPUT OK? <@${message.user}>.`
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
  console.log("⚡️ Bot is running!");
  console.log("whats 9 + 10? 21");
})();