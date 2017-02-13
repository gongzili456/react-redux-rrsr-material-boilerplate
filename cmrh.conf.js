import config from 'config'
import sass from 'node-sass'

module.exports = {
  generateScopedName: config.CSS,
  extensions: ['.scss'],
  preprocessCss: (data, filename) => sass.renderSync({
    data,
    file: filename
  }).css
}
