import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      const queryString = search.replace('%20', ' ')

      data = data.filter(row => {
        return row.title.toLowerCase().includes(queryString.toLowerCase()) || row.description.toLowerCase().includes(queryString.toLowerCase())
      })
    }

    return data
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()

    return data
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id)

    if(index > -1) {
      this.#database[table][index] = data
      this.#persist()
    }
  }

  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id)

    if(index > -1) {
      this.#database[table].splice(index, 1)
      this.#persist()
    }
  }
}