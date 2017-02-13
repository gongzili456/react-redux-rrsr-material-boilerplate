import React, {
  Component,
  PropTypes
} from 'react'
import Helmet from 'react-helmet'
import baseTheme from '../myTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

class App extends Component {
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  render() {
    return (
      <div className='appContainer'>
        <Helmet
          title='react-redux-rrsr-boilerplate'
          meta={[
            {'name': 'description', 'content': 'React Redux RRSR Boilerplate'}
          ]} />
        {this.props.children}
      </div>
    )
  }
}

// for material-ui
App.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired
}

App.propTypes = {
  children: PropTypes.element.isRequired
}

export default App
