"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTemplateEnv = void 0;
const EXTRACTOR = /^['"]?\${\s?ssm:([^~]*)(?:~(true|false|split))?\s?}['"]?$/;
function processTemplateEnv(environment) {
    if (!environment)
        return [];
    return Object.entries(environment).map(([key, value]) => {
        const [, Name, option] = EXTRACTOR.exec(value);
        if (Name.includes("${")) {
            throw new Error("variables are not allowed in self:provider.environment when using sync-env-ssm plugin");
        }
        const WithDecryption = option === "true";
        return { key, Name, WithDecryption };
    });
}
exports.processTemplateEnv = processTemplateEnv;
