import { DefaultTheme } from 'styled-components'

import ArrowBack from './sources/arrow-back'
import ICChecklist from './sources/ic-checklist'
import ICExclamation from './sources/ic-exclamation'
import SearchIcon from './sources/search-icon'
import SunIcon from './sources/sun'
import MoonIcon from './sources/moon'

export type Props = {
  alpha?: number
  color?: keyof DefaultTheme['colors']
  size?: number
}

export default {
  ArrowBack,
  ICChecklist,
  ICExclamation,
  SearchIcon,
  SunIcon,
  MoonIcon
}
