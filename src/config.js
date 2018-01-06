import MdCore from '@/components/material/core'
import MdAvatar from '@/components/material/avatar'
import MdBackdrop from '@/components/material/backdrop'
import MdBottomBar from '@/components/material/bottomBar'
import MdButton from '@/components/material/button'
import MdButtonToggle from '@/components/material/buttonToggle'
import MdCard from '@/components/material/card'
import MdCheckbox from '@/components/material/checkbox'
import MdChips from '@/components/material/chips'
import MdDialog from '@/components/material/dialog'
import MdDivider from '@/components/material/divider'
import MdFile from '@/components/material/file'
import MdIcon from '@/components/material/icon'
import MdImage from '@/components/material/image'
import MdInputContainer from '@/components/material/inputContainer'
import MdLayout from '@/components/material/layout'
import MdList from '@/components/material/list'
import MdMenu from '@/components/material/menu'
import MdOnboarding from '@/components/material/onboarding'
import MdProgress from '@/components/material/progress'
import MdRadio from '@/components/material/radio'
import MdRatingBar from '@/components/material/ratingBar'
import MdSelect from '@/components/material/select'
import MdSidenav from '@/components/material/sidenav'
import MdSnackbar from '@/components/material/snackbar'
import MdSpeedDial from '@/components/material/speedDial'
import MdSpinner from '@/components/material/spinner'
import MdStepper from '@/components/material/stepper'
import MdSubheader from '@/components/material/subheader'
import MdSwitch from '@/components/material/switch'
import MdTable from '@/components/material/table'
import MdTabs from '@/components/material/tabs'
import MdToolbar from '@/components/material/toolbar'
import MdTooltip from '@/components/material/tooltip'
import MdWhiteframe from '@/components/material/whiteframe'

const options = {
  MdCore,
  MdAvatar,
  MdBackdrop,
  MdBottomBar,
  MdButton,
  MdButtonToggle,
  MdCard,
  MdCheckbox,
  MdChips,
  MdDialog,
  MdDivider,
  MdFile,
  MdIcon,
  MdImage,
  MdInputContainer,
  MdLayout,
  MdList,
  MdMenu,
  MdOnboarding,
  MdProgress,
  MdRadio,
  MdRatingBar,
  MdSelect,
  MdSidenav,
  MdSnackbar,
  MdSpeedDial,
  MdSpinner,
  MdStepper,
  MdSubheader,
  MdSwitch,
  MdTable,
  MdTabs,
  MdToolbar,
  MdTooltip,
  MdWhiteframe
}

options.install = (Vue) => {
  for (let component in options) {
    const componentInstaller = options[component]

    if (componentInstaller && component !== 'install') {
      Vue.use(componentInstaller)
    }
  }
}

export default options
