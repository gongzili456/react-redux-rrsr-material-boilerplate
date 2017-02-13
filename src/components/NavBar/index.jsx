import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Avatar from 'material-ui/Avatar'
import FlatButton from 'material-ui/FlatButton'

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-horiz'
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'

import classnames from 'classnames'
import styles from './styles.scss'

class NavBar extends Component {
  render() {
    return (
      <div>
        <AppBar
        />
      </div>
    )
  }
}

NavBar.propTypes = {
}

export default NavBar
