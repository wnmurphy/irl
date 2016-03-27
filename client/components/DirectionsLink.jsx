var DirectionsLink = React.createClass({
  getDefaultProps: function () {
    return {
      location: {
        latitude: 0,
        longitude: 0
      }
    }
  },

  render: function (){
    var link = 'https://www.google.com/maps/dir/Current+Location/';
    link = link + this.props.location.latitude + ',' + this.props.location.longitude;

    return <a href={link} className='button' target="_blank"><i className="material-icons">directions</i>&nbsp;Get directions</a>;
  }
});
