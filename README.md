# 本地开发(android)

1. android project(lx-music) sync project with gradle files（初次同步花费几个小时，再次同步，半个小时起步）
2. android project run app（a simulator）
3. RN project npm run start(react-native start)
   1. select device type(android or ios)
   2. connect the running app
   3. RN build
   4. start app

# 发布测试包（android）

1. RN project run command: npm run bundle-android 打包 RN 部分代码
2. android project(lx-music) generate signed apk
3. config key password located ...
4. generated successfully and view the apk file

> 打包出来的 apk 有多种版本，对于 vivo 手机来说，可以用的有 arm64

# TODO

2. ts 一堆报错
3. push code

/\*\*

- TODO
- - genreateItem?
- - select photo from os: https://github.com/react-native-cameraroll/react-native-cameraroll?tab=readme-ov-file
- - 设置页面：
- - 开启测试模式-切换存储目录-需要重启
- - 清除缓存
- - 更新昵称
- - 如果 Home 支持上拉加载更多呢？每次都加载上一个文件的内容-只要能加载，就能修改历史记录-如何判断修改的是哪个文件？查看当前文件名称
- - top list 来自于所有文件中 isTopped 的集合就可以同步，but 导致处理时间变长
- - 有一个问题：上拉时如果文件为空？是否要自动检查上一日文件？或者说下拉时加载的是 上一个 存在的日期
- - top 可以以日为单位，上拉加载更多
- - 批量操作
- - 其实所有操作都应该同步到 history、top 中
- - 删除操作、取消置顶
- - 搜索&能定位到当时的上下文
- - history、top 日志列表的展示顺序应该按照创建时间而不是插入时间
    \*/
