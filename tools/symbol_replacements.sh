#!/bin/bash
./tools/replace_key.sh "[Symbol.for('fastify.bodyLimit')]" "[Symbol.for('fastify.bodyLimit')]"
git add . && git commit -m "Tested replacing bodyLimit"
./tools/replace_key.sh "[Symbol.for('fastify.routePrefix')]" "[Symbol.for('fastify.routePrefix')]"
git add . && git commit -m "Tested replacing routePrefix"
./tools/replace_key.sh "._logLevel" "[Symbol.for('fastify.logLevel')]"
git add . && git commit -m "Tested replacing logLevel"
./tools/replace_key.sh "._contentTypeParser" "[Symbol.for('fastify.contentTypeParser')]"
git add . && git commit -m "Tested replacing contentTypeParser"
./tools/replace_key.sh "._Reply" "[Symbol.for('fastify.Reply')]"
git add . && git commit -m "Tested replacing Reply"
./tools/replace_key.sh "._Request" "[Symbol.for('fastify.Request')]"
git add . && git commit -m "Tested replacing Request"
./tools/replace_key.sh "._hooks" "[Symbol.for('fastify.hooks')]"
git add . && git commit -m "Tested replacing hooks"
./tools/replace_key.sh "._schemas" "[Symbol.for('fastify.schemas')]"
git add . && git commit -m "Tested replacing schemas"
./tools/replace_key.sh "._middlewares" "[Symbol.for('fastify.middlewares')]"
git add . && git commit -m "Tested replacing middlewares"
./tools/replace_key.sh "._canSetNotFoundHandler" "[Symbol.for('fastify.canSetNotFoundHandler')]"
git add . && git commit -m "Tested replacing canSetNotFoundHandler"
./tools/replace_key.sh "._404LevelInstance" "[Symbol.for('fastify.404LevelInstance')]"
git add . && git commit -m "Tested replacing 404LevelInstance"
./tools/replace_key.sh "._404Context" "[Symbol.for('fastify.404Context')]"
git add . && git commit -m "Tested replacing 404Context"
