import fs = require('fs-extra')
import path = require('path')
import colors = require('colors')
import rimraf = require('rimraf')
import moment = require('moment')
export function timeFormat(date: number | string | Date = Date.now(), pattern: string = 'YYYY-MM-DD HH:mm:ss.SSS') {
    if (typeof date == 'number') {
        if (date < 1e10) {
            date *= 1000
        }
    }
    return moment(date).format(pattern)
}
// 递归的删除指定名称的文件夹
async function remove(dirname: string, root: string, exclude: string[]) {
    try {
        let stat = await fs.stat(root)
        if (!stat.isDirectory()) { // 如果根路径不是文件夹直接返回
            return 0
        }
        let files = await fs.readdir(root)
        let n = files.length
        if (n <= 0) { // 如果为空就跳过
            return 0
        }
        let count = 0
        if (files.includes(dirname)) { // 如果存在就删除
            let p = path.join(root, dirname)
            await removeDir(p)
            return 1
        } else { // 如果不存在就向下递归
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                if (!exclude.includes(file)) { // 如果不在忽略文件中就向下递归
                    let p = path.join(root, file)
                    count += (await remove(dirname, p, exclude))
                }
            }
        }
        return count
    } catch (error) {
        console.error(error)
        return 0
    }
}
/**
 *使用rimraf删除指定文件夹
 *
 * @author CaoMeiYouRen
 * @date 2020-02-09
 * @param {*} root
 * @returns
 */
async function removeDir(root: string) {
    if (!root) {
        return
    }
    return new Promise((resolve, reject) => {
        let start = Date.now()
        console.log(colors.gray(timeFormat(start)) + colors.green(' 正在删除 ') + colors.yellow(root))
        rimraf(root, (err) => {
            if (err) {
                console.error(err)
                reject(err)
            }
            let end = Date.now()
            console.log(colors.gray(timeFormat(start)) + colors.green(' 成功删除，用时 ' + (end - start) + ' 毫秒'))
            resolve(true)
        })
    })
}
async function start() {
    let dirname = 'node_modules'
    let igonre = (await fs.readFile(path.join(__dirname, '../ignore.txt'))).toString().split(/\r\n|\n/)
    let rootdirs = (await fs.readFile(path.join(__dirname, '../rootdirs.txt'))).toString().split(/\r\n|\n/)
    let count = 0
    for (let i = 0; i < rootdirs.length; i++) {
        count += (await remove(dirname, rootdirs[i], igonre))
    }
    console.log(`本次一共删除了${count}个文件夹`)
}

start()
