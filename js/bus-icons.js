/**
 *
 */

(function($, undefined) {
  var busStop = '43275';
  
  $(document).ready(function() {
    
    $.getJSON('http://svc.metrotransit.org/NexTrip/' + busStop + '?format=json&callback=?', function(currentStop) {
      
      for (var bus in currentStop) {
        if (currentStop[bus].Actual === true) {
        
          // /Date(1370124480000-0500)/ (This can't be right)
          var busDate = eval(currentStop[bus].DepartureTime.substring(6, currentStop[bus].DepartureTime.length - 2));
          var now = moment();
          busDate = moment(busDate);
          // TODO, make opacity based on time
          
          var output = ' \
            <div class="half-column center-text"> \
              <div class="bus-line">' + currentStop[bus].Route + currentStop[bus].Terminal + '</div> \
              <div class="bus-line-time">' + currentStop[bus].DepartureText + '</div> \
            </div> \
          ';
          var $output = $(output);
          $output.css('opacity', Math.random() + 0.5);
          
          var opac = Math.random() * 100;
          $output.find('.bus-line').css('background-size', opac + '% ' + opac + '%');
          $('.center-container').append($output);
        }
      }
    });
  });
  
})(jQuery);