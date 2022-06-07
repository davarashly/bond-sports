/*** Config ***/
require("./utils/config").default()

/*** Main ***/

import app from "@/modules/app"

import { PORT } from "@/utils/systemVariables"

const main = () => {
  app.listen(PORT, console.log.bind({}, `Server is listening on ${PORT} port...`))
}

main()
