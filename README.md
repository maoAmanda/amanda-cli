# 脚手架构建步骤
## npm init -y
## 在新建的package.json 文件里面添加bin字段，
```
"bin": {
    "init": "index.js"
  },
```
## 在根目录下新建index.js文件，准备编写命令
## 执行npm link命令，关联自己写的包，不然会报命令的错

