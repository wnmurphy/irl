/** @jsx React.DOM */

var FeedView = React.createClass({
  getInitialState: function() {
      return {
        savedSpots: [],
        followedUsersSpots: []
      };
  },
  componentDidMount: function() {
    var context = this;
    FeedController.getSpots(function(data){
      console.log('data: ', data);
      if (data.savedSpots.length) {
        context.setState({savedSpots: data.savedSpots});
        context.setState({savedContainerClass: ''});
      } else {
        context.setState({savedContainerClass: 'hide'});
      }
      if (data.followedUsersSpots.length) {
        context.setState({followedUsersSpots: data.followedUsersSpots});
      }
    }, function(err) {
      console.log(err);
    });
  },

  render: function() {
    console.log("Rendering FeedView");
    console.log("Saved spots: ", this.state.savedSpots);
    console.log("Followed Users' Spots: ", this.state.followedUsersSpots);
    var savedSpots = this.state.savedSpots.map(function (spot) {
      var spotUrl = '#/spot/' + spot.spotId;
      var creatorUrl = '#/profile/' + spot.creatorId;
      return (
        <div className ='feed-saved-spot'>
          <div className="spot-name-container">
            <div className='category-icon-container'>
              <i className={categories[spot.category] || categories.General}></i>
            </div>
            <span className='spot-name'><a href={spotUrl}>{spot.name}</a></span>
          </div>
          <div> @{timeController.msToTime(spot.start)}</div>
          <div className='feed-spot-creator'>Created by <a href={creatorUrl}>{spot.creator}</a></div>
        </div>
      );
    }, this);
    var followedUsersSpots = this.state.followedUsersSpots.map(function (spot) {
      var spotUrl = '#/spot/' + spot.spotId;
      var creatorUrl = '#/profile/' + spot.creatorId;
      return (
        <div className = 'feed-followed-user-spot'>
          <div className="spot-name-container">
            <div className='category-icon-container'>
              <i className={categories[spot.category] || categories.General}></i>
            </div>
            <span className='spot-name'><a href={spotUrl}>{spot.name}</a></span>
          </div>
          <div>@{timeController.msToTime(spot.start)}</div>
          <div className='feed-spot-creator'>Created by <a href={creatorUrl}>{spot.creator}</a></div>
        </div>
      );
    });

    return (
      <div>
        <LoginRequired />
        <div className={this.state.savedContainerClass}>
          <h3 className='feed-saved-spot-header'>Saved Spots</h3>
          <div className='feed-saved-spot-container'>{savedSpots}</div>
        </div>
        <h3 className='feed-followed-user-header'>Feed</h3>
        <div className='feed-followed-user-spot-container'>{followedUsersSpots}</div>
      </div>
    );
  }
});
