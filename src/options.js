import pageComps from './meta'
import fataOptions from './fata/options'
/**
 * fasm-fw选项
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 202020/8/4
 */
export default {
  /**
   * fansion-base初始化选项
   * @param opt
   * @returns {{router: {routes: (string[]|null)}, pages: {pageComps}}}
   */
  fase: (opt) => ({
    pages: { pageComps },
    router: {
      routes: !opt || !opt.disableRoute ? Object.keys(pageComps) : null
    }
  }),
  /**
   * fasm-fw选项
   */
  self: fataOptions
}
