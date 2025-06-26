import { TextEncoder, TextDecoder } from "util"
import ResizeObserver from "resize-observer-polyfill"

/*
    Add needed Node.js globals and Browser APIs that aren't included in the jsdom environment by default
*/

// for MSW
Object.assign(global, { TextEncoder, TextDecoder })

// for Headless UI
global.ResizeObserver = ResizeObserver
