import generateConfig from '../vc-picker/generate/dayjs';
import { withInstall } from '../_util/type';
import generateCalendar from './generateCalendar';
const Calendar = generateCalendar(generateConfig);
export default withInstall(Calendar);