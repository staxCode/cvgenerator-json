import { CVGenerator } from "./models/CVGenerator.js";
import file from "./config/config.file.js";
import os from "os";
import { join } from "path";

export const create = async (input, lang) => {
  if (!input.length) {
    throw new Error("No existen parametros");
  }

  if (!Object.keys(file.lang).includes(lang)) {
    throw new Error("lenguaje erroneo");
  }

  let pathJSON = input[0];
  let pathFile = input[1];

  if (!pathFile) {
    pathFile = join(os.homedir(), "my-cv.docx");
  }

  let cv = new CVGenerator(pathJSON, pathFile, lang);
  cv.generate();
};

export const generateStruct = async (pathFile) => {
  if (!pathFile) {
    pathFile = join(os.homedir(), "data-cv.json");
  }
  CVGenerator.generateFileStruct(pathFile[0]);
};
