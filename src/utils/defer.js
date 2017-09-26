/**
 * Created by xueyingchen.
 */
import isType from './isType'

export default defer = isType(Promise, 'function') ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout