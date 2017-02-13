import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Header, MainSection} from '../../components/Todos'
import { NavBar } from '../../components'
import * as TodoActions from '../../actions/todos'
import styles from './styles.scss'

class App extends Component {
  render() {
    const {todos, actions} = this.props
    return (
      <div className={styles.normal}>
        <NavBar />
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
      </div>
    )
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    todos: state.todos
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
