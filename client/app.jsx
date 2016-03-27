/** @jsx React.DOM */
var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var Link = window.ReactRouter.Link;
var useRouterHistory = window.ReactRouter.useRouterHistory;
var createHashHistory = window.History.createHashHistory;
var browserHistory = useRouterHistory(createHashHistory)({queryKey: false});
var socket = io.connect();

socket.on('connect', function(){
  socket.emit('hello');
});

var globalState = {};

var categories = {
  General: "fa fa-asterisk",
  Food: "fa fa-cutlery",
  Entertainment: "fa fa-ticket",
  "Health & Fitness": "fa fa-heartbeat",
  "Arts & Culture": "fa fa-paint-brush",
  "Parties & Nightlife": "fa fa-glass",
  "Nature & Outdoors": "fa fa-tree",
  Politics: "fa fa-hand-peace-o",
  Education: "fa fa-graduation-cap"
}

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={MapView} />
    <Route path="/spot/:spotId" component={SpotView} />
    <Route path="/create" component={CreateView} />
    <Route path="/search" component={SearchView} />
    <Route path="/feed" component={FeedView} />
    <Route path="/signup" component={SignupView} />
    <Route path="/login" component={LoginView} />
    <Route path="/profile" component={ProfileView} />
    <Route path="/profile/:profileId" component={ProfileView} />
    <Route path="/share" component={ShareCard} />
  </Router>
);

AuthController.initAuth();

ReactDOM.render(routes, document.getElementById('app-container'));
ReactDOM.render(<NavBar />, document.getElementById('nav-container'));
