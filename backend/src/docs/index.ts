import { readdirSync } from "fs"
import path, { extname } from "path"
import YAML from "yamljs"

function listYamlFiles(rootFolder: string) {
  const docs = {}
  const schemas = {}

  const files = readdirSync(path.join(__dirname, rootFolder))
  const yamlFiles = files.filter(
    (file) => extname(file) === ".yml" || extname(file) === ".yaml"
  )
  yamlFiles.forEach((filename) => {
    const doc = YAML.load(path.join(__dirname, rootFolder, filename))
    if (doc && doc.paths) {
      Object.assign(docs, doc.paths)
    }
    if (doc && doc.schemas) {
      Object.assign(schemas, doc.schemas)
    }
  })
  return { docs, schemas }
}

const tagsDocs = YAML.load(path.join(__dirname, "tags.yml"))

const { docs: authDocs, schemas: authSchemas } = listYamlFiles("auth")
const { docs: recordsDocs, schemas: recordsSchemas } = listYamlFiles("records")
const { docs: teamDocs, schemas: teamSchemas } = listYamlFiles("team")
const { docs: userDocs, schemas: userSchemas } = listYamlFiles("user")

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "User Authentication and Info API",
    version: "0.0.0",
    description: "API documentation for user authentication and authorization.",
  },
  tags: tagsDocs.tags,
  paths: {
    ...authDocs,
    ...recordsDocs,
    ...teamDocs,
    ...userDocs,
  },
  components: {
    schemas: {
      ...authSchemas,
      ...recordsSchemas,
      ...teamSchemas,
      ...userSchemas,
    },
  },
}

export default swaggerDocument
