/**
 * Created by xueyingchen.
 */
import { h, render, Component } from '../../src/index'

class Inter extends Component {
  render ({name}) {
    return (
      <div onClick={() => alert('lanyu')}>
        a
        <div>{name}</div>
      </div>
    )
  }
}

render(<Inter name={'lanyu'}/>, document.body)