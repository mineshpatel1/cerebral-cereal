import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  faArrowLeft, faAsterisk, faBaby, faBook, faBookOpen, faChartBar, faCheck, faChalkboardTeacher, 
  faCoffee, faCog, faGraduationCap, faGlobeAsia, faHandshake, faHashtag, faHeart, faLungs,
  faBars, faRandom, faPaw, faPlane,  faQuestion, faStopwatch, faTrash, faSearch, faSortAlphaDown,
  faSortNumericUp, faTimes, faUndo, faUsers, faUtensils, faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import { ThemeProvider } from 'cerebral-cereal-common';
import Startup from './src/components/Startup';
import reducers from './src/reducers';
import NavStack from './src/NavStack';

library.add(
  faArrowLeft, faAsterisk, faBaby, faBook, faBookOpen, faChartBar, faCheck, faChalkboardTeacher, 
  faCoffee, faCog, faGraduationCap, faGlobeAsia, faHandshake, faHashtag, faHeart, faLungs,
  faBars, faRandom, faPaw, faPlane,  faQuestion, faStopwatch, faTrash, faSearch, faSortAlphaDown,
  faSortNumericUp, faTimes, faUndo, faUsers, faUtensils, faVolumeUp,
);

const store = createStore(reducers);

const App = () => {
  useEffect(() => SplashScreen.hide(), []);

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
