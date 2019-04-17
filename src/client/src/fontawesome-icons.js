/**
 * Creates a library to use fonts in components with 
 * <FontAwesomeIcon icon={iconName} />
 * See https://www.npmjs.com/package/@fortawesome/react-fontawesome
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faInfoCircle, 
  faMinusSquare, 
  faPlusSquare,
  faPlug, 
  faEdit,
  faList
} from '@fortawesome/free-solid-svg-icons'

library.add(faInfoCircle);
library.add(faMinusSquare);
library.add(faPlusSquare);
library.add(faPlug);
library.add(faEdit);
library.add(faList);
