import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import { PersistGate } from "redux-persist/integration/react";

import MenuRouter from "./router/MenuRouter";
import "bootstrap/dist/css/bootstrap.css";
import "./style/root.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MenuRouter />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();