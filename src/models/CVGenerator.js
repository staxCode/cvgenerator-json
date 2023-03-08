import fs from "fs";
import path, { extname } from "path";
import config from "../config/config.file.js";
import structure from "../structure.js";
import pkg from "docx";
import ora from "ora";
import chalk from "chalk";

const {
  Packer,
  Document,
  TextRun,
  Paragraph,
  AlignmentType,
  ExternalHyperlink,
  TabStopType,
  TabStopPosition,
  Tab,
} = pkg;

export class CVGenerator {
  constructor(pathFile, pathDownload, lang) {
    this.pathFile = pathFile;
    this.pathDownload = pathDownload;
    this.lang = lang;
  }

  generate() {
    const dataJSON = this.#readToFileJSON(this.pathFile);
    this.#validateStruct(dataJSON);

    const cv = this.#createStructure(dataJSON);
    Packer.toBuffer(cv)
      .then((buffer) => {
        if (extname(this.pathDownload) !== ".docx") {
          throw new Error("File with unknown format");
        }
        fs.writeFileSync(this.pathDownload, buffer);
        ora().succeed(
          `File created and saved in: ${chalk.green(this.pathDownload)}`
        );
      })
      .catch((err) => {
        this.#failProcess(ora(), `${err}`);
      });
  }

  #createStructure(dataCV) {
    const spCreate = ora("Loading structure").start();
    try {
      const structMethods = this.#structDefault();
      const structDocs = [];
      for (const prop in dataCV) {
        if (Object.hasOwnProperty.call(structMethods, prop)) {
          let sections = structMethods[prop](dataCV[prop]);
          if (Array.isArray(sections)) {
            structDocs.push(...sections);
            continue;
          }
          structDocs.push(sections);
        }
      }
      const document = new Document({ sections: [{ children: structDocs }] });
      this.#successProcess(spCreate, `Structure created successfull`);
      return document;
    } catch (error) {
      this.#failProcess(spCreate, `${error}`);
    }
  }

  static generateFileStruct(pathFile) {
    let spFileStruct = ora("Loading template").start();
    try {
      if (!config.typeFile.includes(extname(pathFile))) {
        throw new Error("File with unknown format");
      }
      const file = {
        profile: {
          name: "...",
          specialty: "...",
          address: "...",
          email: "...",
          phone: "...",
        },
        summary: "...",
        social: [
          {
            web: "...",
            url: "...",
          },
        ],
        education: {
          degree: "...",
          fieldOfStudy: "...",
          schoolName: "...",
          notes: "...\n\n...",
          startDate: {
            year: 0,
          },
          endDate: {
            year: 0,
          },
        },
        skills: ["..."],
        experiences: [
          {
            isCurrent: false,
            summary: "...",
            title: "...",
            endDate: {
              month: 0,
              year: 0,
            },
            startDate: {
              month: 0,
              year: 0,
            },
            company: {
              name: "...",
              address: "...",
            },
          },
        ],
        achievements: [{ issuer: "...", name: "..." }],
      };
      fs.writeFileSync(pathFile, JSON.stringify(file, null, 2), {
        encoding: "utf-8",
      });
      spFileStruct.succeed(`File template created in ${chalk.green(pathFile)}`);
    } catch (error) {
      spFileStruct.fail(`${error}`);
      process.exit(0);
    }
  }

  #failProcess(sp, text) {
    sp.fail(text);
    process.exit(0);
  }

  #successProcess(sp, text) {
    sp.succeed(text);
  }

  #readToFileJSON(pathFile) {
    const spreadtoFile = ora("Loading file").start();
    if (!config.typeFile.includes(extname(pathFile))) {
      this.#failProcess(
        spreadtoFile,
        `${new Error("File with unknown format")}`
      );
    }
    let file = fs.readFileSync(pathFile, { encoding: "utf-8" }) || null;
    if (!file) {
      this.#failProcess(spreadtoFile, `${new Error("File empty")}`);
    }
    this.#successProcess(spreadtoFile, "Successful file reading");
    return JSON.parse(file);
  }

  #validateProp(propBody, propName = null, struct) {
    switch (struct.type) {
      case "array":
        if (!Array.isArray(propBody)) {
          throw `Property '${propName}' must be of type ${struct.type}.`;
        }
        let eStruct = struct.elements;
        propBody.forEach((childProp) => {
          if (eStruct.type !== typeof childProp) {
            throw `Property element '${propName}' must be ${eStruct.type}.`;
          }
          this.#validateProp(childProp, null, eStruct);
        });
        break;
      case "string":
        if (struct.type !== typeof propBody) {
          throw `Property '${propName}' must be of type ${struct.type}.`;
        }
        break;
      case "number":
        if (struct.type !== typeof propBody) {
          throw `Property '${propName}' must be of type ${struct.type}.`;
        }
        break;
      case "boolean":
        if (struct.type !== typeof propBody) {
          throw `Property '${propName}' must be of type ${struct.type}.`;
        }
        break;
      case "object":
        if (Array.isArray(propBody)) {
          throw `Property '${propName}' must be of type ${struct.type}.`;
        }
        for (const propChild in propBody) {
          this.#validateProp(
            propBody[propChild],
            propChild,
            struct.schemaChildren[propChild]
          );
        }
        break;
    }
  }

  #validateStruct(data) {
    const struct = structure.default;
    const spvalidateStruct = ora("Loading file structure validation").start();

    try {
      for (const prop in struct) {
        if (Object.hasOwnProperty.call(data, prop)) {
          const bodyProp = data[prop];
          this.#validateProp(bodyProp, prop, struct[prop]);
        }
      }
      this.#successProcess(
        spvalidateStruct,
        "File structure validated successfully"
      );
    } catch (error) {
      this.#failProcess(spvalidateStruct, `${error}`);
    }
  }

  #structDefault() {
    const text = config.lang[this.lang];

    function ChildText(text, size = 12, bold = false, otherProps = {}) {
      return new TextRun({
        text: text,
        size: `${size}pt`,
        bold: bold,
        font: {
          name: "Calibri",
        },
        ...otherProps,
      });
    }

    function createRoleText(roleText, dateText) {
      return new Paragraph({
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        children: [
          ChildText(roleText),
          ChildText("", 12, false, { children: [new Tab(), dateText] }),
        ],
      });
    }

    function createHeading(text) {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        thematicBreak: true,
        children: [
          ChildText(text, 14, true, { break: 1 }),
          ChildText(" ", 12, false, { break: 1 }),
        ],
      });
    }

    function createHeader(title, extraData = "") {
      return new Paragraph({
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        children: [
          ChildText(title, 12, true),
          ChildText("", 12, true, { children: [new Tab(), extraData] }),
        ],
      });
    }

    function createSkillList(skills) {
      return new Paragraph({
        children: [ChildText(skills.map((skill) => skill).join(", ") + ".")],
      });
    }

    function createBullet(text) {
      return new Paragraph({
        bullet: {
          level: 0,
        },
        children: [ChildText(text)],
      });
    }

    function createPositionDateText(startDate, endDate, isCurrent) {
      const startDateText =
        getMonthFromInt(startDate.month) + ". " + startDate.year;
      const endDateText = isCurrent
        ? text.fn.now
        : `${getMonthFromInt(endDate.month)}. ${endDate.year}`;

      return `${startDateText} - ${endDateText}`;
    }

    function getMonthFromInt(value) {
      if (value >= 1 && value <= 12) return text.fn.months[value - 1];
      return "N/A";
    }

    return {
      profile: function (profile) {
        return [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [ChildText(profile.name, 14, true)],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [ChildText(profile.specialty)],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [ChildText(`${profile.email} • ${profile.phone}`)],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [ChildText(profile.address)],
          }),
        ];
      },
      social: function (social) {
        return new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              break: 1,
            }),
            ...social.map(
              (page) =>
                new ExternalHyperlink({
                  link: page.url,
                  children: [
                    ChildText(page.web, 12, false, { style: "Hyperlink" }),
                    new TextRun(" "),
                  ],
                })
            ),
          ],
        });
      },
      summary: function (summary) {
        return [
          createHeading(text.summary.header),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [ChildText(summary, 12)],
          }),
        ];
      },
      education: function (educations) {
        return [
          createHeading(text.education.header),
          ...educations
            .map((education, index, arrEducations) => {
              const arr = [];
              if (arrEducations.length > 1 && index > 0) {
                arr.push(new Paragraph(" "));
              }
              arr.push(createHeader(education.schoolName));
              arr.push(
                createRoleText(
                  `${education.fieldOfStudy}, ${education.degree}`,
                  `${education.startDate.year} - ${education.endDate.year}`
                )
              );

              if (education.notes) {
                const bulletPoints = education.notes.split("\n\n");
                bulletPoints.forEach((bulletPoint) => {
                  arr.push(createBullet(bulletPoint));
                });
              }
              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
        ];
      },
      skills: function (skills) {
        return [createHeading(text.skills.header), createSkillList(skills)];
      },
      experiences: function (experiences) {
        return [
          createHeading(text.experiences.header),
          ...experiences
            .map((position, index, arrPositions) => {
              const arr = [];
              if (arrPositions.length > 1 && index > 0) {
                arr.push(new Paragraph(" "));
              }
              arr.push(
                createHeader(position.company.name, position.company.address)
              );
              arr.push(
                createRoleText(
                  position.title,
                  createPositionDateText(
                    position.startDate,
                    position.endDate,
                    position.isCurrent
                  )
                )
              );
              const bulletPoints = position.summary.split("\n\n");
              bulletPoints.forEach((bulletPoint) => {
                arr.push(createBullet(bulletPoint));
              });
              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
        ];
      },
      achievements: function (achievements) {
        return [
          createHeading(text.achievements.header),
          ...achievements.map((achievement) => {
            let issuer = achievement.issuer ? `, ${achievement.issuer}` : "";
            return createBullet(`${achievement.name}${issuer}`);
          }),
        ];
      },
    };
  }
}
