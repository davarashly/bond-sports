import { readFile as readFileNative } from "fs/promises"
import { resolve } from "path"
import { TSConfigJSON } from "types-tsconfig"

const jsonCleanComments = (json: string) => JSON.parse(json.replace(/\s+\/\*.*\*\/|\/\/.*/gm, ""))

export const pathResolve = resolve
export const readFile = (path: string): Promise<Buffer> => readFileNative(pathResolve(path))
export const getTsConfig = (): Promise<TSConfigJSON> => readFile(process.cwd() + "/tsconfig.json").then((file) => jsonCleanComments(file.toString()))

export const cleanArray = <T>(arr: readonly string[], exclude: string[]): T => {
  const newArr = [...arr]

  for (const key of exclude) newArr.splice(newArr.indexOf(key), 1)

  return newArr as unknown as T
}
