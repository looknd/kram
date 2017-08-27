/**
 * @file marked.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */
import marked from 'marked';
import {contain, each} from '../../utils';
import {ON_RENDER_PREFIX} from '../plugin';

export const ORIGIN_RENDER = Object.assign({}, marked.Renderer.prototype);
export const RENDER_NAMES = Object.keys(ORIGIN_RENDER);

export default function (app) {
    let rendererMethods = {};
    let renderer = new marked.Renderer();
    let pluginOptions;

    const module = {
        get rendererMethods() {
            return rendererMethods;
        },
        get renderer() {
            return renderer;
        },
        setRenderer(...args) {
            if (args.length === 2) {
                let [name, fn] = args;

                if (!contain(RENDER_NAMES, name)) {
                    return;
                }

                rendererMethods[name] = fn;

                renderer[name] = function (...args) {
                    let html = fn.apply(renderer, args);
                    let options = Object.assign({args}, pluginOptions);
                    return app.module.plugin.execSync(ON_RENDER_PREFIX + name, html, options);
                };
            }
            else {
                each(args[0], module.setRenderer);
            }
        },
        setPluginOptions(opts) {
            pluginOptions = opts;
        }
    };

    return {
        name: 'renderer',
        module: {
            get() {
                return module;
            }
        }
    };
}