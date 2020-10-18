import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  faArrowLeft, faBackspace, faBars, faCarrot, faCartPlus, faCheck, faChevronDown, faChevronRight,
  faCog, faPepperHot, faPause, faPlay, faPlus, faPen, faRedo, faSearch, faShoppingCart, faTimes,
  faStopwatch, faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'cerebral-cereal-common';

import reducers from './src/reducers';
import Startup from './src/components/Startup';
import NavStack from './src/NavStack';

library.add(
  faArrowLeft, faBackspace, faBars, faCarrot, faCartPlus, faCheck, faChevronDown, faChevronRight,
  faCog, faPepperHot, faPause, faPlay, faPlus, faPen, faRedo, faSearch, faShoppingCart, faTimes,
  faStopwatch, faUtensils,
);
const store = createStore(reducers);

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Startup>
          <NavigationContainer>
            <NavStack />
          </NavigationContainer>
        </Startup>
      </ThemeProvider>
    </Provider>
  )
};

export default App;

