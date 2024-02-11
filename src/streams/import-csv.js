import fs from 'node:fs'
import { parse } from 'csv-parse'

const filePath = new URL('../../tasks.csv', import.meta.url)

const stream = fs.createReadStream(filePath)

const parser = parse({
  delimiter: ',',
  fromLine: 2,
  skipEmptyLines: true
})

async function main() {
  const rows = stream.pipe(parser)

  let counter = 0;

  process.stdout.write('Importação iniciada\n')

  for await (const item of rows) {
    const [ title, description ] = item

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
    
    counter++

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  process.stdout.write('Importação finalizada\n')
  process.stdout.write(`Registros importados: ${counter}\n`)
}

main()