"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = require("slugify");
const url_1 = require("url");
/**
 * Maps over array passing `isLast` bool to iterator as the second arguemnt
 */
function mapWithLast(array, iteratee) {
    const res = [];
    for (let i = 0; i < array.length - 1; i++) {
        res.push(iteratee(array[i], false));
    }
    if (array.length !== 0) {
        res.push(iteratee(array[array.length - 1], true));
    }
    return res;
}
exports.mapWithLast = mapWithLast;
/**
 * Creates an object with the same keys as object and values generated by running each
 * own enumerable string keyed property of object thru iteratee.
 * The iteratee is invoked with three arguments: (value, key, object).
 *
 * @param object the object to iterate over
 * @param iteratee the function invoked per iteration.
 */
function mapValues(object, iteratee) {
    const res = {};
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            res[key] = iteratee(object[key], key, object);
        }
    }
    return res;
}
exports.mapValues = mapValues;
/**
 * flattens collection using `prop` field as a children
 * @param collectionItems collection items
 * @param prop item property with child elements
 */
function flattenByProp(collectionItems, prop) {
    const res = [];
    const iterate = (items) => {
        for (const item of items) {
            res.push(item);
            if (item[prop]) {
                iterate(item[prop]);
            }
        }
    };
    iterate(collectionItems);
    return res;
}
exports.flattenByProp = flattenByProp;
function stripTrailingSlash(path) {
    if (path.endsWith('/')) {
        return path.substring(0, path.length - 1);
    }
    return path;
}
exports.stripTrailingSlash = stripTrailingSlash;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
function appendToMdHeading(md, heading, content) {
    // if  heading is already in md and append to the end of it
    const testRegex = new RegExp(`(^|\\n)#\\s?${heading}\\s*\\n`, 'i');
    const replaceRegex = new RegExp(`((\\n|^)#\\s*${heading}\\s*(\\n|$)(?:.|\\n)*?)(\\n#|$)`, 'i');
    if (testRegex.test(md)) {
        return md.replace(replaceRegex, `$1\n\n${content}\n$4`);
    }
    else {
        // else append heading itself
        const br = md === '' || md.endsWith('\n\n') ? '' : md.endsWith('\n') ? '\n' : '\n\n';
        return `${md}${br}# ${heading}\n\n${content}`;
    }
}
exports.appendToMdHeading = appendToMdHeading;
// credits https://stackoverflow.com/a/46973278/1749888
exports.mergeObjects = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }
    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                exports.mergeObjects(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        });
    }
    return exports.mergeObjects(target, ...sources);
};
const isObject = (item) => {
    return item !== null && typeof item === 'object';
};
const isMergebleObject = (item) => {
    return isObject(item) && !Array.isArray(item);
};
/**
 * slugify() returns empty string when failed to slugify.
 * so try to return minimun slugified-string with failed one which keeps original value
 * the regex codes are referenced with https://gist.github.com/mathewbyrne/1280286
 */
function safeSlugify(value) {
    return (slugify_1.default(value) ||
        value
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/\--+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '')); // Trim - from end of text
}
exports.safeSlugify = safeSlugify;
function isAbsoluteUrl(url) {
    return /(?:^[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}
exports.isAbsoluteUrl = isAbsoluteUrl;
/**
 * simple resolve URL which doesn't break on strings with url fragments
 * e.g. resolveUrl('http://test.com:{port}', 'path') results in http://test.com:{port}/path
 */
function resolveUrl(url, to) {
    let res;
    if (to.startsWith('//')) {
        const { protocol: specProtocol } = url_1.parse(url);
        res = `${specProtocol || 'https:'}${to}`;
    }
    else if (isAbsoluteUrl(to)) {
        res = to;
    }
    else if (!to.startsWith('/')) {
        res = stripTrailingSlash(url) + '/' + to;
    }
    else {
        const urlObj = url_1.parse(url);
        res = url_1.format(Object.assign(Object.assign({}, urlObj), { pathname: to }));
    }
    return stripTrailingSlash(res);
}
exports.resolveUrl = resolveUrl;
function getBasePath(serverUrl) {
    try {
        return parseURL(serverUrl).pathname;
    }
    catch (e) {
        // when using with redoc-cli serverUrl can be empty resulting in crash
        return serverUrl;
    }
}
exports.getBasePath = getBasePath;
function titleize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.titleize = titleize;
function removeQueryString(serverUrl) {
    try {
        const url = parseURL(serverUrl);
        url.search = '';
        return url.toString();
    }
    catch (e) {
        // when using with redoc-cli serverUrl can be empty resulting in crash
        return serverUrl;
    }
}
exports.removeQueryString = removeQueryString;
function parseURL(url) {
    if (typeof URL === 'undefined') {
        // node
        return new (require('url')).URL(url);
    }
    else {
        return new URL(url);
    }
}
function unescapeHTMLChars(str) {
    return str.replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)));
}
exports.unescapeHTMLChars = unescapeHTMLChars;
