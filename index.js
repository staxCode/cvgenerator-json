#!/usr/bin/env node
import meow from "meow";
import config from "./src/config/config.meow.js";
import { init } from "./src/index.js";

const cli = meow(config.help, {
  importMeta: import.meta,
  flags: config.flags,
  autoVersion: true,
  autoHelp: true,
  description: false,
  allowUnknownFlags: false,
});

init(cli.flags, cli.input);
