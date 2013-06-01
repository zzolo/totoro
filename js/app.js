/**
 *
 */

(function($, undefined) {
  var busStop = '17984';
  var busStyle = {
    color: '#F5B800',
    opacity: 0.9,
    weight: '2',
    fillColor: '#FFD65C',
    fillOpacity: 0.7,
    radius: 7
  };
  
  $(document).ready(function() {
    
    $.getJSON('./js/stops.json', function(stops) {
      $.getJSON('http://svc.metrotransit.org/NexTrip/' + busStop + '?format=json&callback=?', function(currentStop) {
        
        //console.log(currentStop);
        //$('.bus-coming').html('Bus ' + currentStop[0].Route + ' is coming in ' + currentStop[0].DepartureText);
        
        // Create map
        var map = L.map('bus-stop-map')
          .setView([stops[busStop].lat, stops[busStop].lon], 13);
        
        // Add base layer
        L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add bus stop marker
        L.marker([stops[busStop].lat, stops[busStop].lon]).addTo(map);
        
        // Add bus marker
        for (var bus in currentStop) {
          if (currentStop[bus].Actual == true) {
            var circle = new L.CircleMarker([currentStop[bus].VehicleLatitude, currentStop[bus].VehicleLongitude], busStyle);
            map.addLayer(circle);
            circle.bindPopup('Bus ' + currentStop[bus].Route + currentStop[bus].Terminal + ' is arriving in approximately ' + currentStop[bus].DepartureText);
          }
        }
      
      });
    });
  });
  
})(jQuery);