#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";
import handlebars from "handlebars";
import { exec } from "child_process";

const program = new Command();

const templateNames = {
  component: ["component-php.hbs", "component-scss.hbs", "component-js.hbs"],
  archive: ["archive-php.hbs", "archive-scss.hbs", "archive-js.hbs"],
  page: ["page-php.hbs", "page-scss.hbs", "page-js.hbs"],
  single: ["single-php.hbs", "single-scss.hbs", "single-js.hbs"],
};

const createTemplate = (type, targetDir, pageInfo) => {
  const [phpTemplateName, scssTemplateName, jsTemplateName] = templateNames[type];
  fs.mkdirSync(targetDir);

  ["php", "scss", "js"].forEach((ext, idx) => {
    const templateName = [phpTemplateName, scssTemplateName, jsTemplateName][idx];
    const templateSource = fs.readFileSync(`./config/sources/${type}/${templateName}`, "utf8");
    const template = handlebars.compile(templateSource);
    const renderedTemplate = template(pageInfo);

    const fileName = type === "component" ? `${pageInfo.fileName}.${ext}` : `${type}-${pageInfo.fileName}.${ext}`;
    fs.writeFileSync(`${targetDir}/${fileName}`, renderedTemplate);
  });

  const mainScssPath = "./src/scss/main.scss";
  const importStatement = `@import './${targetDir.replace("./", "")}/${type === "component" ? "" : type + "-"}${pageInfo.fileName}';\n`;
  fs.appendFileSync(mainScssPath, importStatement);

  console.log(`${type[0].toUpperCase() + type.slice(1)} Template ${pageInfo.fileName} generated successfully!`);
};

function promptName(inputName, message) {
  if (inputName) {
    return Promise.resolve({ singleName: inputName });
  } else {
    return inquirer.prompt([
      {
        type: "input",
        name: "singleName",
        message: message,
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid name.";
          }
        },
      },
    ]);
  }
}

// GENERATE COMPONENT
program
  .command("generate:component [componentName]")
  .alias("C") // shortcut
  .description("Generate a new component. (You can run the command without [componentName])")
  .action((componentName) => {
    promptName(
      componentName,
      "What is the name of your component (example: testimonials-block)?"
    ).then(({ singleName }) =>
      createTemplate("component", `./components/${singleName}`, { fileName: singleName, componentName: singleName })
    );
  });

// GENERATE ARCHIVE TEMPLATES
program
  .command("generate:archive [archiveName]")
  .alias("A") // shortcut
  .description("Generate a new archive template. (You can run the command without [archiveName])")
  .action((archiveName) => {
    promptName(
      archiveName,
      "What is the name of your post type (example: post)?"
    ).then(({ singleName }) =>
      createTemplate("archive", `./template-archives/${singleName}`, { fileName: singleName, archiveName: singleName })
    );
  });

// GENERATE PAGE TEMPLATE
program.command("generate:page [pageName] [fileName]")
  .alias("P") // shortcut
  .description("Generate a new page template. (You can run the command without [pageName] [fileName])")
  .action((pageName, fileName) => inquirer.prompt([
    { type: "input", name: "pageName", message: "What is the name of your page template (example: Contact Us Page)?", default: pageName, when: () => !pageName },
    { type: "input", name: "fileName", message: "What is the name for the file (example: contact-us)?", default: fileName, when: () => !fileName },
  ]).then(({ pageName, fileName }) => createTemplate("page", `./template-pages/${fileName}`, { fileName, pageName })));


// GENERATE SINGLE TEMPLATES
program
  .command("generate:single [singleName]")
  .alias("S") // shortcut
  .description("Generate a new single template. (You can run the command without [singleName])")
  .action((singleName) => {
    promptName(
      singleName,
      "What is the name of your post type (example: post)?"
    ).then(({ singleName }) =>
      createTemplate("single", `./template-singles/${singleName}`, { fileName: singleName, singleName: singleName })
    );
  });

  // COMBO COMMANDS
  /** SINGLE AND ARCHIVE*/
  program
  .command("generate:combo [name]")
  .alias("AS")
  .description("Generate new archive and single templates.")
  .action((name) => {
    promptName(
      name,
      "What is the name of your post type (example: post)?"
    ).then(({ singleName }) => {
      createTemplate("archive", `./template-archives/${singleName}`, { fileName: singleName, archiveName: singleName });
      createTemplate("single", `./template-singles/${singleName}`, { fileName: singleName, singleName: singleName });
    });
  });

  /** RUN GULP COMMAND TO OPTIMIZE FONTS */
  program
  .command("optimise:fonts")
  .alias("dev") // shortcut
  .description("Run the gulp command")
  .action(() => {
    exec("gulp optimise-fonts", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
      }
      console.log(`Output: ${stdout}`);
    });
  });


program.parse(process.argv);

