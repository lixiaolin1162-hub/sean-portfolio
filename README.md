# 李小林 Sean｜个人作品集

此目录是可直接托管的静态网站。入口是 `index.html`，页面、样式、动效和图片均在同一目录树中。

## 导入 GitHub Desktop

1. 完整解压 ZIP。在 GitHub Desktop 中选择 **File → Add local repository → Choose…**。
2. 选择直接包含 `index.html` 和隐藏目录 `.git` 的 `sean-portfolio` 文件夹，点击 **Add repository**。项目已经初始化为 `main`，并有一次本地提交。
3. 需要上传到 GitHub 时，点击 **Publish repository**。发布仓库后仍需到网页端开启 Pages 才会生成网站地址。

## Windows 本地预览

解压，在此文件夹打开 PowerShell，运行以下命令。需要已安装 Python。

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

在浏览器打开 `http://127.0.0.1:8000/`。通过本地服务器可以查看图片放大、数字计数和品牌墙动效。

## 发布到 GitHub Pages

1. 在 GitHub 建立仓库，把解压出的文件及文件夹上传到 `main` 分支根目录，使 `index.html` 位于该目录。
2. 打开仓库的 **Settings → Pages**，在 **Source** 选择 **Deploy from a branch**。
3. 选择 **main** 和 **/(root)**，点击 **Save**。等待 Pages 生成访问地址。

网站资源使用相对路径，支持 `用户名.github.io/仓库名/`。发布前请检查联系方式、合作案例和经营数据。普通 GitHub Pages 站点可能公开访问，访问权限以你的 GitHub 套餐和网站设置为准。

[GitHub Pages 官方发布说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
