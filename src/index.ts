import express, { Request, Response } from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express();

const IMAGE_RESOURCE = "image"
const METADATA_RESOURCE = "metadata"

const ALLOWED_RESOURCES = new Set([IMAGE_RESOURCE, METADATA_RESOURCE])

const ResourceToPathData = {
    [IMAGE_RESOURCE]: { root: "img", format: "jpg" },
    [METADATA_RESOURCE]: { root: "metadata", format: "json" },
}

function pathFilter(path: string, req: Request) {
    const splitPath = path.split("/")
    if (splitPath.length !== 3) { // ['', '{resource}', '{id}']
        return false
    }

    if (splitPath[0]) {
        return false
    }

    if (!ALLOWED_RESOURCES.has(splitPath[1])) {
        return false
    }

    try {
        Number.parseInt(splitPath[2])
    } catch {
        return false
    }

    console.log({ splitPath })
    return true
}

function pathRewrite(path: string, req: Request) {
    const splitPath = path.split("/")
    const resource = ResourceToPathData[splitPath[1] as keyof typeof ResourceToPathData]


    return `${resource.root}/${splitPath[2]}.${resource.format}`
}


const penguverseProxy = createProxyMiddleware<Request, Response>({
    target: "https://storage.googleapis.com/penguverse",
    changeOrigin: true,
    pathFilter,
    pathRewrite,
})


app.use("/penguverse", penguverseProxy);

app.listen(3000, () => console.log("Server ready on port 3000."));