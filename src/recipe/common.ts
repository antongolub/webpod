import {defaults} from '../host.js'

import './deploy/index.js'
import './provision/index.js'
import path from 'node:path'
import fs from 'node:fs'
import {ask} from '../prompt.js'

defaults.remoteUser = 'root'
defaults.become = undefined
defaults.verbose = false
defaults.publicDir = async ({host}) => {
  const uploadDir = path.resolve(await host.uploadDir)
  let publicDir = '.'
  const dirs = [
    '.',
    'public',
    'static',
  ]
  for (const dir of dirs) {
    const dirPath = path.join(uploadDir, dir, 'index.html')
    if (fs.existsSync(dirPath)) {
      publicDir = dir
      break
    }
  }

  return ask('Public directory:', publicDir)
}
defaults.uploadDir = async () => {
  let uploadDir = '.'
  const dirs = [
    'dist',
    'build',
  ]
  for (const dir of dirs) {
    const dirPath = path.join(process.cwd(), dir)
    if (fs.existsSync(dirPath)) {
      uploadDir = dir
      break
    }
  }

  return ask('Upload directory:', uploadDir)
}
defaults.nodeVersion = '18'
defaults.domain = async ({host}) => {
  return ask('Domain:', await host.hostname)
}
defaults.deployPath = async ({host}) => `/home/webpod/${await host.domain}`
