"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app = (0, express_1.default)();
const PORT = 3001;
const IMAGE_RESOURCE = "image";
const METADATA_RESOURCE = "metadata";
const ALLOWED_RESOURCES = new Set([IMAGE_RESOURCE, METADATA_RESOURCE]);
const ResourceToPathData = {
    [IMAGE_RESOURCE]: { root: "img", format: "jpg" },
    [METADATA_RESOURCE]: { root: "metadata", format: "json" },
};
function pathFilter(path, req) {
    const splitPath = path.split("/");
    if (splitPath.length !== 3) { // ['', '{resource}', '{id}']
        return false;
    }
    if (splitPath[0]) {
        return false;
    }
    if (!ALLOWED_RESOURCES.has(splitPath[1])) {
        return false;
    }
    try {
        Number.parseInt(splitPath[2]);
    }
    catch (_a) {
        return false;
    }
    console.log({ splitPath });
    return true;
}
function pathRewrite(path, req) {
    const splitPath = path.split("/");
    const resource = ResourceToPathData[splitPath[1]];
    return `${resource.root}/${splitPath[2]}.${resource.format}`;
}
const penguverseProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "https://storage.googleapis.com/penguverse",
    changeOrigin: true,
    pathFilter,
    pathRewrite,
});
app.use("/penguverse", penguverseProxy);
app.listen(PORT, () => console.log("Server ready on port:", PORT));
exports.default = app;
