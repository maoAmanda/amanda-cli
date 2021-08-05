#!/usr/bin/env node

const { program } = require("commander");
const download = require("download-git-repo");
const path = require("path");
const rimraf = require("rimraf");
const inquirer = require("inquirer");
const fs = require("file-system");
const ora = require("ora");
const chalk = require("chalk");
const handlebars = require("handlebars");
program.version("0.0.1");

inquirer
  .prompt([
    {
      name: "name",
      message: "请输入项目名称",
    },
    {
      name: "author",
      message: "请输入项目作者",
      default: "",
    },
  ])
  .then((res) => {
    const dir = path.join(process.cwd(), res.name);
    rimraf.sync(dir, {}); //在下载前需要保证路径下没有同名文件
    const spinner = ora("正在下载模板, 请稍后...");
    spinner.start();
    download(
      // "direct:https://github.com/maoAmanda/usefulCode.git",
      "github:maoAmanda/usefulCode#main",
      dir,
      (error) => {
        if (!error) {
          const packagePath = path.join(res.name, "package.json");
          // 判断是否有package.json, 要把输入的数据回填到模板中
          if (fs.existsSync(packagePath)) {
            const content = fs.readFileSync(packagePath).toString();
            // handlebars 模板处理引擎
            const template = handlebars.compile(content);
            const result = template(res);
            fs.writeFileSync(packagePath, result);
            console.log(chalk.green("success! 项目初始化成功！"));
            console.log(
              chalk.greenBright("开启项目") +
                "\n" +
                chalk.greenBright("cd " + res.name) +
                "\n" +
                chalk.greenBright("start to develop~~~!")
            );
            spinner.fail();
          } else {
            spinner.fail();
            console.log("failed! no package.json");
            return;
          }
        } else {
          spinner.fail();
          console.log(chalk.red("failed! 拉取模板失败", error));
          return;
        }
      }
    );
  });

program.parse(process.argv);
