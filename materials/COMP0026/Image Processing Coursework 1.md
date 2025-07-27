Image Processing Coursework 1

face morphing

参考视频：[迈克尔杰克逊经典MV《Black Or White》1991_](https://www.bilibili.com/video/av662469634/?vd_source=cf8d7d0d0ec8a245b965474625b39ad3)

参考资料：https://blog.csdn.net/qq_30167691/article/details/138057694

问题定义：从一个人脸流畅顺滑（10-15 intermediate frame）变成另一个

不能只用交叉溶解！需要用$\alpha$混合，需要对齐面部数据（仿射）——感觉她要求用**网格变形算法**

1. 需要局部特征匹配（网格、特征的对应关系）
2. Delaunay三角剖分
3. 计算中间面部（关键点均值）
4. 计算变形图形（计算仿射）
5. 最后用$\alpha$混合算法





实验分为两个部分：

1. 基于网格的变形(Mesh-based Morphing) - 70分
2. 无网格变形(Meshless Morphing) - 30分

Part 1核心步骤：

1. 特征点标注
   - 可以手动标注或使用dlib等工具自动检测
   - 需要在两张图片上标记对应的面部特征点
2. 三角剖分
   - 可以使用Delaunay三角剖分算法
   - 需要确保两张图片的三角形对应关系正确
3. 中间帧坐标计算
   - 通过线性插值计算中间帧中每个顶点的位置
4. 仿射变换参数估计(重要)
   - 需要自己实现仿射变换参数的计算
   - 不能使用OpenCV等库的内置函数
   - 需要解线性方程组
5. 三角形变形
   - 实现反向映射(inverse warping)
   - 实现双线性插值
   - 不能使用内置函数
6. 图像混合
   - 使用权重w进行颜色混合
7. 生成视频
   - 将所有中间帧合成为视频



Part 2核心步骤：

1. 使用相同的特征点对应关系
2. 实现Moving Least Squares(MLS)变形算法
3. 实现无网格的变形场计算
4. 实现最终的图像混合
