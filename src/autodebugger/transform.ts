import { NodePathUtility } from 'meta-programming-utils'
import { Config } from './types'

export const transformAutoDebug = (config: Config, code: string, filename: string) => {
  const { template, transform } = config.babel
  const util = new NodePathUtility({ babel: config.babel, filename })

  const plugin = () => {
    const classVisitor = {
      ClassMethod: (nodePath, { className }) => {
        const name = `${className}#${nodePath.node.key.name}`
        util.hookFunction(nodePath, name)
      }
    }

    const visitor = {
      Program: {
        exit: nodePath => {
          if (config.replaceProgram) {
            const body = template(config.replaceProgram)({ BODY: nodePath.node.body })
            if (Array.isArray(body)) {
              nodePath.node.body = body
            } else {
              nodePath.node.body = [body]
            }
          }
        }
      },
      CallExpression: nodePath => {
        const callee = nodePath.get('callee')

        let key = Object.keys(config.renames).find(k => callee.matchesPattern(k))
        if (!key) {
          if (!('*' in config.renames)) {
            return
          }
          key = '*'
        }

        util.replaceCallExpression(nodePath, config.renames[key])
      },
      ClassDeclaration: nodePath => {
        nodePath.traverse(classVisitor, { className: nodePath.node.id.name })
      },
      Function: {
        enter: nodePath => {
          let name
          switch (nodePath.node.type) {
            case 'FunctionDeclaration': {
              name = nodePath.node.id.name
              break
            }
            case 'ArrowFunctionExpression': {
              if (nodePath.parent.type === 'VariableDeclarator' && nodePath.parentPath.get('id').isIdentifier()) {
                name = `arrow function (${nodePath.parent.id.name})`
                break
              }
              name = 'arrowFunction'
              break
            }
            case 'ClassMethod': {
              return
            }
            default: {
              console.log(nodePath.node)
              name = 'unknown'
              break
            }
          }

          util.hookFunction(nodePath, name)
        }
      }
    }

    const pluginObject: any = {
      name: 'autodebugger',
      visitor
    }

    if (config.includeTypeScript) {
      pluginObject.inherits = require('@babel/plugin-syntax-typescript').default
    }

    return pluginObject
  }

  const plugins = [...config.plugins, plugin]
  return transform(code, { plugins, sourceMaps: 'inline' }).code
}
