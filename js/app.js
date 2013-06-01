/**
 *
 */

(function($, undefined) {
  
  $(document).ready(function() {
    
    $.getJSON('http://svc.metrotransit.org/NexTrip/85?format=json&callback=?', function(data) {
      
      console.log(data);
      
      $('.bus-coming').html('Bus ' + data[0].Route + ' is coming in ' + data[0].DepartureText);
    
    });
  });
  
})(jQuery);