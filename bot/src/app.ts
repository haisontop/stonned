import "reflect-metadata";
import { Interaction } from "discord.js";
import * as fs from "fs";
import { app } from "./server";
import { client } from "./client";

require("dotenv").config();

console.log("HCAPTCHA_SECRET_KEY", process.env.HCAPTCHA_SECRET_KEY);

client.once("ready", async () => {
  await client.initApplicationCommands({
    guild: { log: true },
    global: { log: true },
  });
  await client.initApplicationPermissions();
  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction).catch((e) => {
    console.error("error at executeInteraction", e);
  });
});

client.login(process.env.BOT_TOKEN ?? "").then(async (v) => {
  return;
});

const port = 4000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
