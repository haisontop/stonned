import { withSolana } from '../../../modules/common/hoc/withSolana'
import RegistrationLA from '../../../modules/events/components/registrationLa'

function laEventRegistrationPage() {
  return <RegistrationLA></RegistrationLA>
}

export default withSolana(laEventRegistrationPage)
