## 内存管理
* 申请内存空间
* 使用内存空间
* 释放内存空间
```js
// 申请空间
let obj = {}
// 使用空间
obj.name = "xiaoming"
// 释放空间
obj=null
```
## 垃圾回收
> javascript中内存管理是自动的
* 对象不再被引用
* 对象不能从根上访问时

### 可达对象
* 可以访问到的对象是可达对象(引用，作用链)
* 可达的标准就是从根上出发是否能够被找到
* javascript中的根可以理解为全局白能量对象
> 建立一个相对复杂的引用与可达关系
```js
function objGroup(obj1,obj2){
    obj1.next = obj2
    obj2.prev = obj1
    return {
        o1 : obj1,
        o2 : obj2
    }
}
let obj = objGroup({name:'obj1'},{name:'obj2'})
console.log(obj)
```
![](http://oss.ahh5.com/ahh5/md/202020200525211520.png)
> 删除对obj1的引用使其不可达
```js
function objGroup(obj1,obj2){
    obj1.next = obj2
    obj2.prev = obj1
    return {
        o1 : obj1,
        o2 : obj2
    }
}

let obj = objGroup({name:'obj1'},{name:'obj2'})
//  刪除 o1 对 obj1 的引用
obj.o1=null
//  刪除 o2 上 prev 对 obj1 的引用
obj.o2.prev=null
console.log(obj)
// { o1: null, o2: { name: 'obj2', prev: null } }
```
![](http://oss.ahh5.com/ahh5/md/202020200525211654.png)

## GC
* 可以找到内存中的垃圾、并释放和回收空间
### 垃圾定义
* 程序中不在需要使用的对象
### GC算法
* GC是一种机制，垃圾回收器完成具体的工作
* 工作的内容就是查找垃圾释放空间、回收空间
* 算法就是工作时查找和回收所遵循的规则
### 常见的GC算法
* 引用计数
* 标记清除
* 标记整理
* 分代回收

### 引用计数算法原理
* 设置引用数，判断当前引用数是否为0
* 引用计数器
* 引用关系改变时，修改引用数字
* 引用数字为0是GC工作立即回收垃圾
```js
// 创建引用对象 
let user1 = {
    info:{
        age: 11
    }
}
// 创建引用对象
let user2 = {
    info:{
        age: 22
    }
}
// 创建引用对象
let user3 = {
    info:{
        age: 33
    }
}
// 引用user123对象中的info对象
const infoList = [user1.info, user2.info, user3.info]

// 手动改变引用使其不指向引用类型的对象
user1=user2=user3=null

// 此时user中的info 未销毁， infoList的元素中存在引用 所以引用计数器不是0
console.log(infoList)
// [ { age: 11 }, { age: 22 }, { age: 33 } ]
```
### 引用计数算法优点
* 可以及时回收垃圾对象
* 减少程序卡顿时间

### 引用计数算法缺点
* 无法回收循环引用对的对象
* 资源消耗较大
```js
// 循环引用
function fn(){
    const obj1 = {}
    const obj2 = {}
    // 因为对象相互引用 所以计数不会为0 obj1与obj2 不会销毁
    obj1.name = obj2
    obj2.name = obj1
    return 'lg is a coder'
}
fn()
```

### 标记清除法实现原理
* 分标记和清除， 二个阶段完成
* 遍历所有对象找到并标记活动对象
* 遍历所有对象清除没有被标记的对象
* 回收相应的空间

> 找到可达对象并标记

![](http://oss.ahh5.com/ahh5/md/202020200525231038.png)

> 递归寻找可达对象并标记

![](http://oss.ahh5.com/ahh5/md/202020200525231122.png)

> 找到不可达对象并回收

![](http://oss.ahh5.com/ahh5/md/202020200525231258.png)

> 回收的空间会放到空闲链表中，方便后续申请空间使用

### 标记清除优点
* 解决回收循环引用对的对象
### 引用计数算法缺点
* 地址不连续造成空间碎片化，浪费空间
* 不会立即回收垃圾对象

![](http://oss.ahh5.com/ahh5/md/202020200525231904.png)

### 标记整理实现原理
* 标记整理就是标记清除的增强
* 遍历所有对象找到并标记活动对象
* 遍历所有对象清除没有被标记的对象
* 清除阶段会先进行整理，移动对象位置，方便产生连续地址

### 标记清除优点
* 解决回收循环引用对的对象
* 解决空间碎片化，最大化利用释放出的空间
### 标记清除缺点
* 地址不连续造成空间碎片化，浪费空间
* 不会立即回收垃圾对象

### 标记增量
> GC与程序执行，交替操作。将较长的停顿时间变成不连续的较短停顿时间

![](http://oss.ahh5.com/ahh5/md/202020200526001602.png)

## V8引擎
* V8是一款主流的JavaScript执行引擎
* V8采用即时编译
* V8内存限定
    * 因为垃圾回收机制 (1.5G|800M)
### 垃圾回收策略
> 数据类型分为原始值类型数据与对象类型数据，对于程序语言来说原始值类型数据都是由语言自身来控制的。所以在这里我们指到的回收都是存在堆区中的对象类型数据。
* 采用分代回收思想
* 内存分为新生代、老生代

> 针对不同代使用不同算法

![](http://oss.ahh5.com/ahh5/md/202020200525234643.png)

#### V8中常见的GC算法
* 分代回收
* 空间复制
* 标记清除
* 标记整理
* 标记增量

### V8是如何实现回收新生代对象
![](http://oss.ahh5.com/ahh5/md/202020200525235017.png)
* V8内存空间一分为二
* 小空间用于存储新生代对象(32M|16M)
* 新生代指的是存活时间较短的对象(如局部对象)

#### 新生代对象回收实现
* 回收过程采用复制算法+标记整理
* 新生代内存分为二个等大小空间
* 使用空间为From，空闲空间为To
* 活动对象存储与From空间
* 标记整理后将活动对象拷贝至To
* From与To交换空间完成释放

##### 回收细节
* ### 3.描述V8 新生代存储区垃圾回收流程
* 晋升就是将新生代对象移动到老生代
* 晋升标准一轮GC后还存活的新生代需要晋升
* 当To空间的使用率超过25%，也需要将这一代的新生代存储到老生代

### V8是如何实现回收老生代对象
* 老生代存储空间(1.4G|700M)
* 老生代对象就是指存活时间较长的对象(如全局对象、闭包存储的对象)

#### 老生代对象回收实现
* 回收过程采用标记清除、标记整理、增量标记算法
* 首先使用标记清楚完成垃圾空间的回收
* 采用标记整理进行空间优化(新生代出现晋升时)
* 采用增量标记进行效率优化

### 对比新生代与老生代回收策略
* 新生代区域垃圾回收使用空间换时间
* 老生代区域垃圾回收使用时间换空间
* 老生代区域来及回收不适合复制算法

## Performance工具介绍

### 为什么使用Performance工具介绍
* GC的目的是为了实现内存空间的良性循环
* 良性循环的基石是合理使用
* 时刻关注才能确定是否合理
* Performance提供多种监控方式

### 使用步骤
* 打开浏览器输入目标地址
* 进入开发人员面板，选择性能
* 开启录制功能，访问具体页面
* 执行用户行为，一段时间后停止录制
* 分析界面中记录的内存信息

### 内存问题的外在表现
* 页面出现延迟加载或经常性暂停(排除网络问题)
* 页面持续性出现糟糕的性能表现
* 页面性能随时间延长越来越差

### 内存问题常见原因
* 内存泄漏：内存使用持续升高
* 内存膨胀：在多数设备上都存在性能问题。(为了达到性能，申请大量的空间)
* 频繁的垃圾回收：通过内存变化图进行分析

### 监控内存的几种方式
* 浏览器任务管理器
* Timeline时序图记录
* 堆快照查找分离DOM
* 判断是否存在频发的垃圾回收

#### 什么是分离DOM
* 界面元素存活在DOM树上
* 垃圾对象时的DOM节点
* 分离状态的DOM节点

### 代码优化介绍
#### 精准测试JavaScript性能(基于Benchmark.js的完成)
#### 慎用全局变量
* 全局变量定义在全局执行上下文，是所有作用域链的顶端
* 上局执行上下文一直存在于上下文执行栈，知道程序退出
* 如果某个局部作用域出现了同名变量则会遮蔽或污染全局
#### 缓存全局变量
* 将使用中无法避免的全局变量缓存到局部
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
    <button id="btn3">btn3</button>
    <button id="btn4">btn4</button>
    <script>
        // 未缓存
        function test1(){
            const btn1 = document.getElementById('btn1')
            const btn2 = document.getElementById('btn2')
            const btn3 = document.getElementById('btn3')
            const btn4 = document.getElementById('btn4')
        }
        // 使用缓存
        function test2(){
            const _document = document
            const btn1 = _document.getElementById('btn1')
            const btn2 = _document.getElementById('btn2')
            const btn3 = _document.getElementById('btn3')
            const btn4 = _document.getElementById('btn4')
        }
    </script>
</body>
</html>
```
#### 通过原型链新增方法
* 在原型对象上新增实力对象需要的方法
```js
// 内部完成
const fn1 = function(){
    this.foo = function(){
        console.log(1111)
    }
}
let f1 = new fn1()

// 原型链添加
const fn2 = function(){}
fn2.prototype.foo = function(){
    console.log(1111)
}
let f2 = new fn2()

```
#### 闭包陷阱
* 闭包是一种强大的语法
* 闭包使用不当很容易出现内存泄漏
* 不要为了闭包而闭包
```js
function test(func){
    console.log(func())
}
function test2(){
    const name = 'lg'
    return name
}
// 使用闭包 效率低于下方函数
test(test2)
// 未使用闭包
test(function(){
    const name = 'lg'
    return name
})
```
#### 避免属性访问方法使用
* js不需要属性的访问方法，所有属性都是外部可见的
* 使用属性访问方法只会增加一层重定义，没有访问的控制力
```js
// 定义成员访问函数
function Person(){
    this.name = 'icoder'
    this.age = 18 
    this.getAge = function(){
        return this.age
    }
}
const p1 = new Person()
const a = p1.getAge()

// 直接通过属性访问
function Person(){
    this.name = 'icoder'
    this.age = 18 
}
const p2 = new Person()
const b = p2.age
```
#### for循环优化
> 为优化
```js
var arrList = []

arrList[1000] = 'icoder'

for(let i=0;i<arrList.length;i++){
    console.log(arrList[i])
}
```
> 优化后
```js
var arrList = []

arrList[1000] = 'icoder'

for(let i=arrList.length;i;i++){
    console.log(arrList[i])
}
```
#### 选择最优循环方式
forEach > for > for in
```js
var arrList = [ 1, 2, 3, 4, 5]

arrList.forEach((val)=>{
    console.log(val)
})

for(let i=arrList.length;i;i++){
    console.log(arrList[i])
}

for(let i in arrList){
    console.log(arrList[i])
}
```
#### 节点添加优化
> 节点添加操作必然会有回流与重绘
```js
for(let i = 0; i <10;i++){
    var op = docuemnt.createElement('p')
    op.innerHTML = i
    document.body.appendChild(op)
}
```
> 使用文档碎片优化
```js
const fraEle = document.createDocumentFragment()
for(let i = 0; i <10;i++){
    var op = docuemnt.createElement('p')
    op.innerHTML = i
   fraEle.appendChild(op)
}
document.body.appendChild(fraEle)
```
#### 克隆优化节点操作
```js
for(let i = 0; i <10;i++){
    var op = docuemnt.createElement('p')
    op.innerHTML = i
    document.body.appendChild(op)
}
```
> 使用文档碎片优化
```js
const oldP = docuemnt.getElementId('box1')
for(let i = 0; i <10;i++){
    var op = oldP.cloneNode(false)
    op.innerHTML = i
   fraEle.appendChild(op)
}
document.body.appendChild(fraEle)
```

#### 直接量量 替换 Object
优化前
```js
var a = new Array(3)
a[0] = 1
a[1] = 2
a[2] = 3
```
优化后
```js
var a = [ 1,2,3]
```
