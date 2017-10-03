const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const argv = require('minimist')(process.argv.slice(2))
const Hapi = require('hapi')

const storePath = argv.storePath || path.join(__dirname, 'uploads')

if (!fs.existsSync(storePath)) {
  console.log(`Creating store directory ${argv.storePath}`)
  execSync(`mkdir -p ${argv.storePath}`)
}

const server = new Hapi.Server()

server.register(require('inert'), (err) => {
  if (err) {
    console.error('Failed to load inert plugin:', err);
  }
})

server.connection({ 
  port: argv.port || 3000, 
  host: argv.host || 'localhost'
})

server.route({
  method: 'POST',
  path: '/',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      maxBytes: 314572800 /* 300 MB */
    },
    handler: function (request, reply) {
      if (request.payload) {
        const filePayload = request.payload.file
        var name = filePayload.hapi.filename
        var outputFilePath = path.join(storePath, name)
        var outputFile = fs.createWriteStream(outputFilePath)

        outputFile.on('error', function (err) { 
          console.error(err) 
        });

        filePayload.pipe(outputFile);

        filePayload.on('end', function (err) { 
          reply('OK')
        })
      }
    }
  }
})

server.route({  
  method: 'GET',
  path: '/{filename}',
  handler: function (request, reply) {
    const pathToFile = path.join(storePath, request.params.filename)
    if (!fs.existsSync(pathToFile)) {
      return reply('file was not found').code(404)
    }
    reply.file(pathToFile)
  }
})

server.route({  
  method: 'DELETE',
  path: '/{filename}',
  handler: function (request, reply) {
    const pathToFile = path.join(storePath, request.params.filename)
    if (!fs.existsSync(pathToFile)) {
      return reply('file was not found').code(404)
    }
    execSync(`rm ${pathToFile}`)
    reply('OK')
  }
})

server.route({  
  method: 'OPTIONS',
  path: '/{filename}',
  handler: function (request, reply) {
    const pathToFile = path.join(storePath, request.params.filename)
    if (!fs.existsSync(pathToFile)) {
      return reply('file was not found').code(404)
    }
    reply('OK')
  }
})

server.start(function () {
  console.log('Electrode Native binary store server running at: ' + server.info.uri)
});