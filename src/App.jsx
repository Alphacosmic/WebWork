import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./views/Home";
import PropertyList from "./views/PropertyList";
import PropertyDetail from "./views/PropertyDetail";
import Login from "./views/Login";
import Register from "./views/Register";
import Profile from "./views/Profile";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer"; // Import Footer

function App() {
	return (
		<Router>
			<Navbar />
			<div className="app-container">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/properties" component={PropertyList} />
					<Route exact path="/properties/:id" component={PropertyDetail} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/profile" component={Profile} />
				</Switch>
			</div>
			<Footer /> {/* Add Footer to the bottom of the layout */}
		</Router>
	);
}

export default App;
