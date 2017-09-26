/**
 * Created by xueyingchen.
 */
import isType from './isType'

export default isType(Promise, 'function') ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout