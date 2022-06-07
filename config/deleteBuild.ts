require("../src/utils/config").default()

import { getTsConfig, pathResolve } from "../src/utils"
import { rmSync } from "fs"

getTsConfig().then((tsConfig) => rmSync(pathResolve(process.cwd(), tsConfig.compilerOptions!.outDir!), { recursive: true, force: true }))
