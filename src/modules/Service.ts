import { writeFile, mkdir, access } from "fs/promises"
import { pathResolve, readFile } from "@/utils"
import { dbPath } from "@/utils/systemVariables"

type Map<T> = Record<number, T>

export default class Service<T> {
  private data: Map<T> = {}
  private readonly filePath: string
  private readonly index: keyof T
  private initialized = false

  constructor(filepath: string, index: keyof T) {
    this.filePath = pathResolve(process.cwd(), dbPath, filepath)
    this.index = index
  }

  protected async saveData() {
    const dirPath = this.filePath
      .split(/[\\\/]/g)
      .slice(0, -1)
      .join("/")

    try {
      await access(pathResolve(dirPath))
    } catch (e) {
      await mkdir(pathResolve(dirPath), { recursive: true })
    }

    await writeFile(this.filePath, JSON.stringify(this.data, undefined, 2))
  }

  async getData(): Promise<Map<T>> {
    if (!this.initialized) {
      try {
        this.data = await readFile(this.filePath).then((file: Buffer) => JSON.parse(file.toString()))
      } catch (e) {
        await this.saveData()
      }

      this.initialized = true
    }

    return this.data
  }

  protected async getItem(id: number) {
    const data = await this.getData()

    return data[id]
  }

  protected async setItem(id: number, item: T) {
    const data = await this.getData()

    data[id] = item

    return this.saveData()
  }

  protected async createItem(item: T) {
    const data = await this.getData()

    let newId = Math.floor(Math.random() * Math.pow(10, 6))

    while (!!data[newId]) newId = Math.floor(Math.random() * Math.pow(10, 6))
    ;(<number>(<unknown>item[this.index])) = newId

    this.data[newId] = item

    return this.saveData().then(() => item)
  }
}
