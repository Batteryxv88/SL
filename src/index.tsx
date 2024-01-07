import { render } from "react-dom";
import App from "./app/App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "./app/styles/index.scss";
import { Provider } from "react-redux";
import store from "./app/providers/StoreProvider/Store";

render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById("root")
);
