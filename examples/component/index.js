/**
 * Created by xueyingchen.
 */
import { h, render, Component } from '../../src/index'

class Inter extends Component {
  constructor (props) {
    super(props)
    this.state = {id: 1}
  }

  render ({name}, {id}) {
    return (
      <div onClick={() => {this.setState({id: id + 1})}}>
        a
        <div>{name + id}</div>
      </div>
    )
  }
}

render(<Inter name={'lanyu'}/>, document.body)