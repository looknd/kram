/**
 * @file 生成文章章节结构的插件
 * @author tangei (tanglei02@baidu.com)
 */
import {
    get,
    ensureArray,
    isValidArray,
    plainify
} from '../../lib/utils';

export default class Chapter {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        let {ON_RENDER_HEADING, BEFORE_STORE} = app.module.plugin.STAGES;
        let map = new Map();

        on(ON_RENDER_HEADING, (html, {args: [text, level, raw], dir}) => {
            let hash = raw.trim()
                .toLowerCase()
                .replace(/[^0-9a-zA-Z_ \u0391-\uFFE5+]/g, '-')
                .replace(/ +/g, '-');

            let content = plainify(html);

            let info = map.get(dir) || {hashMap: {}, list: []};

            if (info.hashMap[hash] == null) {
                info.hashMap[hash] = 0;
            }
            else {
                info.hashMap[hash]++;
                hash += info.hashMap[hash];
            }

            info.list.push({level, hash, text: content});
            map.set(dir, info);

            return html.replace(/(<h[1-6])(>| [^<]*?>)/mg, (str, start, end) => {
                end = end.slice(0, -1) + ` data-hash="#${hash}">`;
                return start + end;
            });
        }, this.priority);

        on(BEFORE_STORE, (obj, {dir}) => {
            let info = map.get(dir);
            if (!get(info, 'list', 'length')) {
                return;
            }
            obj.chapters = buildTree(info.list);
            return obj;
        });
    }
}

/**
 * 通过章节标题生成树形结构的章节数据
 *
 * @param {Array} arr 章节标题数组
 * @return {Array} 树形结构
 */
function buildTree(arr) {
    if (!isValidArray(arr)) {
        return arr;
    }

    let [first, ...rest] = arr;

    return rest.reduce((res, info) => {
        let last = res[res.length - 1];

        if (last.level < info.level) {
            last.children = ensureArray(last.children).concat(info);
        }
        else {
            res.push(info);
        }

        return res;
    }, [first])
    .map(info => {
        if (info.children) {
            info.children = buildTree(info.children);
        }

        return info;
    });
}

