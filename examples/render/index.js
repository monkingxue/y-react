/**
 * Created by xueyingchen.
 */
import { h, render } from '../../src/index'

render((
  <div>
    <span class="title">第一次</span>
    <button class="btn" onClick={() => alert('WTF')}>测试</button>
    <div>就是想试一试</div>
  </div>
), document.body)
