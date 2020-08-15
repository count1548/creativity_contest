import {
    BUS_LINE_UPDATE,
    BUS_STOP_UPDATE,
    BUS_ID_UPDATE,
    BUS_STATE_UPDATE,
} from '../actions/constants'
import { CardActions } from '@material-ui/core'

const busReducer = (oldstate, action) => {
    switch(action.type) {
    case BUS_LINE_UPDATE:
        return {...oldstate, 
            'BUS' : {'LINE' : action.data}
        }
    case BUS_STOP_UPDATE:
        return {...oldstate, 
        'BUS' : {'STOP' : action.data}
        }
    case BUS_ID_UPDATE:
        return {...oldstate, 
        'BUS' : {'ID' : action.data}
        }

    case BUS_STATE_UPDATE:
        return {...oldstate, 
        'BUS' : {'STATE' : action.data}
        }

    }
}

export default busReducer