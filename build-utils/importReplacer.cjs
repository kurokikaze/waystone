"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exampleReplacer;
function exampleReplacer({ orig, file, config }) {
    
    if (orig.startsWith("from 'moonlands/dist")) {
        console.log(orig)
        const module = /'([^']*)+/g.exec(orig)[1]
        return `from '${module}.js'`
    }
    return orig;
}
