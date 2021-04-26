import fs from 'fs-extra'
import path from 'path'
import colors from 'colors'
import rimraf from 'rimraf'
import moment from 'moment'
import asyncPool from 'tiny-async-pool'

export function timeFormat(date: number | string | Date = Date.now(), pattern: string = 'YYYY-MM-DD HH:mm:ss.SSS') {
    if (typeof date === 'number') {
        if (date < 1e10) {
            date *= 1000
        }
    }
    return moment(date).format(pattern)
}
// 递归的删除指定名称的文件夹
async function remove(dirname: string, root: string, exclude: string[]) {
    try {
        const stat = await fs.stat(root)
        if (!stat.isDirectory()) { // 如果根路径不是文件夹直接返回
            return 0
        }
        const files = await fs.readdir(root)
        const n = files.length
        if (n <= 0) { // 如果为空就跳过
            return 0
        }
        let count = 0
        if (files.includes(dirname)) { // 如果存在就删除
            const p = path.join(root, dirname)
            await removeDir(p)
            return 1
        }  // 如果不存在就向下递归
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (!exclude.includes(file)) { // 如果不在忽略文件中就向下递归
                const p = path.join(root, file)
                count += await remove(dirname, p, exclude)
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
        const start = Date.now()
        console.log(colors.gray(timeFormat(start)) + colors.green(' 正在删除 ') + colors.yellow(root))
        rimraf(root, (err) => {
            if (err) {
                console.error(err)
                reject(err)
            }
            const end = Date.now()
            console.log(colors.gray(timeFormat(start)) + colors.green(` 成功删除，用时 ${end - start} 毫秒`))
            resolve(true)
        })
    })
}
async function startFun() {
    const dirname = 'node_modules'
    const igonre = (await fs.readFile(path.join(__dirname, '../ignore.txt'))).toString().split(/\r\n|\n/)
    const rootdirs = (await fs.readFile(path.join(__dirname, '../rootdirs.txt'))).toString().split(/\r\n|\n/)
    const needRemoves = rootdirs.map((rootdir) => remove(dirname, rootdir, igonre))
    const count = (await Promise.all(needRemoves)).reduce((prev, current) => prev + current)
    console.log(`本次一共删除了${count}个文件夹`)
}
startFun()
