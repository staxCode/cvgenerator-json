import chalk from "chalk";
import figlet from "figlet";

export default {
  help: `${chalk.greenBright(
    figlet.textSync("cvgenerator-json", {
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 90,
      whitespaceBreak: true,
    })
  )}

Usage
  $ cvn [<options>  ...]

  Options
  --create, -c      Create  cv in  *.docx format  in defined path.
  --lang, -l        Change  the language  of  the document  to  be  generated.
  --generate, -g    Generate a template (.json file)  for adding  information about the CV.

Example
  $ cvn -c path/file/data-cv.json path/download/my-cv.docx
  $ cvn -c path/file/data-cv.json path/download/my-cv.docx  -l  es
  $ cvn -g path/file/template-data-cv.json
    
Note
  * By default the path of created files is the ${chalk.underline(
    "current user path"
  )}.
  * The languages available for the docx  are English-en (Default)  and Spanish-es
`,
  flags: {
    create: {
      type: "boolean",
      alias: "c",
    },
    lang: {
      type: "string",
      alias: "l",
      default: "en",
    },
    generate: {
      type: "boolean",
      alias: "g",
    },
  },
};
