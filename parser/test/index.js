/**
 * @file 测试文件
 * @author tanglei (tanglei02@baidu.com)
 */

/* eslint-disable */

var os = require('os');

if (os.type() === 'Windows_NT') {
    process.env.NODE_ENV = 'development';
}

if (process.env.NODE_ENV !== 'production') {
    require('babel-register');
    require('babel-polyfill');
}

var fs = require('fs-extra');
var path = require('path');
var kram = require('../index');

var dest = path.resolve(__dirname, '../../doc/dest/lavas');
var tmp = path.resolve(__dirname, '../../doc/git/lavas');

fs.ensureDirSync(dest);
fs.ensureDirSync(tmp);

fs.removeSync(dest);
fs.removeSync(tmp);

kram.init({
    repos: {
        lavas: {
            pull: {
                use: 'downloadFromGithub',
                from: 'github:lavas-project/lavas-tutorial',
                dest: dest,
                options: {tmp}
            }
        }
    }
});

kram.pull();
// console.log(kram.locals)
// console.log(kram)
// var parser = require('../index');
// var parse = parser.parse;
// var configure = parser.configure;

// var md = fs.readFileSync(path.resolve(__dirname, './md/test.md'), 'utf-8');
// kram.parse(md).then(html => {
//     console.log(html)
// })
// configure({
//     marked: {
//         options: {
//             renderer: {
//                 heading(text, level, raw) {
//                     return `
//                         <h${level}>${text}</h${level}>
//                     `;
//                 }
//             }
//         }
//     }
// });

// console.log(parse(md, {path: 'lavas'}));
