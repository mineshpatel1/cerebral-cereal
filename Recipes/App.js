import 'react-native-gesture-handler';
import React from 'react';
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {
  faArrowLeft, faBackspace, faBars, faCarrot, faCartPlus, faCheck, faChevronDown, faChevronRight,
  faCog, faPepperHot, faPause, faPlay, faPlus, faPen, faRedo, faSearch, faShoppingCart, faTimes,
  faSignOutAlt, faStopwatch, faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavigationContainer } from '@react-navigation/native';
import { CommonProvider } from 'cerebral-cereal-common';

import reducers from './src/reducers';
import Startup from './src/components/Startup';
import NavStack from './src/NavStack';

library.add(
  faArrowLeft, faBackspace, faBars, faCarrot, faCartPlus, faCheck, faChevronDown, faChevronRight,
  faCog, faPepperHot, faPause, faPlay, faPlus, faPen, faRedo, faSearch, faShoppingCart, faTimes,
  faSignOutAlt, faStopwatch, faUtensils,
);
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

const App = () => {
  return (
    <Provider store={store}>
      <CommonProvider>
        <Startup>
          <NavigationContainer>
            <NavStack />
          </NavigationContainer>
        </Startup>
      </CommonProvider>
    </Provider>
  )
};

export default App;

