import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect

} from "react-router-dom";

import App from './App'
import AutoComplete from './Components/AutoComplete'
import AutocompleteWithInstantSearch from "./Components/AutocompleteWithInstantSearch";
import useCallBackComponent from "./Components/useCallBackComponent";
import useMemoComponent from "./Components/useMemoComponent";
import Test from "./Components/Test";
import React from 'react';


const Routes = () => {
    return (<Router>
        <Switch>
            <Route exact path="/" component={App} >
            </Route>
            <Route exact path="/autocomplete" component={AutoComplete} >
            </Route>
            <Route exact path="/autocompleteWithInstantSearch" component={AutocompleteWithInstantSearch} >
            </Route>
            <Route exact path="/useCallBackComponent" component={useCallBackComponent} >
            </Route>
            <Route exact path="/useMemoComponent" component={useMemoComponent} >
            </Route>
            <Route exact path="/test" component={Test} >
            </Route>
            <Route path='*' component={() => '404 Not found'}>
            </Route>
        </Switch>
    </Router>)
}

export default Routes