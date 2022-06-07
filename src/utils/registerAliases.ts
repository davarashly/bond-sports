import { getTsConfig, pathResolve } from "./"
import { register } from "tsconfig-paths"

export const registerAliases = () =>
  getTsConfig().then((tsConfig) =>
    register({
      baseUrl: tsConfig.compilerOptions?.baseUrl ?? pathResolve(process.cwd() + "/src"),
      paths: tsConfig.compilerOptions?.paths ?? {}
    })
  )
