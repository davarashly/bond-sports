import moduleAlias from "module-alias"
import { registerAliases } from "./registerAliases"
import { pathResolve } from "./"

export default async () => {
  moduleAlias.addAliases({ "@": pathResolve(__dirname, "../") })

  await registerAliases()
}
