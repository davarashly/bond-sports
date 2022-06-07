import Service from "@/modules/Service"

export const personKeys = ["personId", "name", "document", "birthDate"] as const

export interface IPerson {
  personId: number
  name: string
  document: string
  birthDate: Date
}

class PersonService extends Service<IPerson> {
  constructor() {
    super("persons.json", "personId")
  }

  async getPerson(id: number) {
    return this.getItem(id)
  }

  async setPerson(id: number, person: IPerson) {
    return this.setItem(id, person)
  }

  async createPerson(person: IPerson) {
    return this.createItem(person)
  }
}

const personService = new PersonService()

export default personService
