const fp = require('loadsh/fp')

const cars = [{
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: true
    }
]


/**
 *   练习1，使用函数组合重新实现下面这个函数
 *
 *   let isLastInStock = function(cars){
 *      let last_car = fp.last(cars)
 *      return fp.prop('in_stock',last_car)
 *   }
 * */


const isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)) // true

/**
 *   练习2，获取第一个car的name
 *   
 * */

 const firstCarsName = fp.flowRight(fp.prop('name'),fp.first)
 console.log(firstCarsName(cars)) // Ferrari FF

 /**
 *   练习3，使用帮助函数 _average重构 averageDollarValue,时启用函数组合的方式实现
 * */

let _average = function(xs){
    return fp.reduce(fp.add,0,xs)/xs.length
}
// let averageDollarValue = function(cars){
//     let dollar_values = fp.map(function(car){
//         return car.dollar_value
//     },cars)
//     return _average(dollar_values)
// }
// console.log(averageDollarValue(cars)) // 398550

let averageDollarValue = fp.flowRight(_average,fp.map((val)=>val.dollar_value))
console.log(averageDollarValue(cars)) // 398550

 /**
 *   练习4，使用flowRihgt写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name 转化为这种形式
 *   例如 sanitizeNames(['Hello word']) => ['hello_world']
 * */

 let _underscore = fp.replace(/\W+/g,'_') //不能改动

 let sanitizeNames = fp.map(fp.flowRight(_underscore,fp.lowerCase,fp.prop('name')))
 console.log(sanitizeNames(cars)) //[ 'ferrari_ff', 'spyker_c_12', 'jaguar_xkr_s', 'audi_r_8' ]
