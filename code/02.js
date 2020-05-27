const {
    MayBe,
    Container
} = require("./support")
const fp = require("loadsh/fp")

/**
 * 练习1
 * 使用fp.add(x,y) 和 fp.map(fn,x) 创建一个能让functor里的值增加的函数 ex1
 * */
let maybe = MayBe.of([5, 6, 1])
let ex1 = (maybe, x) => MayBe.of(fp.map(fp.add(x))(maybe._value))
console.log(ex1(maybe, 1))

/**
 * 练习2
 * 实现一个函数ex2,能够使用fp.first 获取列表里的第一个元素
 * */

let xs = Container.of(['do', 'ray', 'me'])
let ex2 = (xs) => fp.first(xs._value)
console.log(ex2(xs)) // do

/**
 * 实现一个函数ex3,使用safeProp 和 fp.first 找到user名字的首字母
 * */

let safeProp = fp.curry(function (x, o) {
    return MayBe.of(o[x])
})

let user = {
    id: 2,
    name: "Albert"
}

let ex3 = (key, obj) => {
    return fp.first(safeProp(key)(obj)._value)
}
console.log(ex3('name', user))


/**
 * 使用MayBe 重写ex4 不要有if语句
 */
// let ex4 = function (n) {
//     if (n) {
//         return parseInt(n)
//     }
// }

let ex4 = function (n) {
   return MayBe.of(n).map(parseInt)._value
}
console.log(ex4())
console.log(ex4(1.1))
