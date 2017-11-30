export interface Config {
  replaceProgram?: string
  enter?: string
  exit?: string
  renames?: {
    [props: string]: string
  }
  includeTypeScript?: boolean
  babel?: any
  plugins?: any[]
}
