# remove-node_modules

在node项目的开发中，经常会安装大量的node_modules，这导致node_modules文件夹的膨胀，每个node_modules动辄几百MB，甚至几个G。而如果存在多个node项目的话，node_modules的大小就更加膨胀了。

因此为了解决这个问题，把目前暂时不需要的项目的node_modules给移除了，腾出一些空间来。产生了本项目。

### 使用方法

1.  clone本项目

    ```
    git clone https://github.com/CaoMeiYouRen/remove-node_modules.git
    ```

2.  下载依赖

    ```
    npm i
    ```

3.  编译

    ```
    npm run build
    ```

4.  修改配置文件

    1.  rootdirs.txt 项目根目录，会递归的删除该文件夹下所有的node_modules
    2.  ignore.txt 忽略文件夹，对于该文件中的文件夹会直接忽略

5.  运行

    ```
    npm start
    ```


### 温馨提示

由于删除文件是一个敏感操作，因此请再三确认rootdirs.txt和ignore.txt文件，请确认要删除的文件夹根目录和忽略文件