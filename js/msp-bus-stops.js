/**
 * A simple object for managing polling MSP stop data.
 */

var mspStopPooler = mspStopPooler || {};

(function($, undefined) {

  mspStopPooler = function() {
    var msp = {};
    
    // Default properties
    msp.pollInterval = 10000;
    msp.busStop = '43275';
    msp.listenerOn = function() { };
    msp.jsonpTemplate = 'http://svc.metrotransit.org/NexTrip/[[BUSSTOP]]?format=json&callback=?';
    
    // Get data from 
    msp.getStopData = function() {
      $.getJSON(msp.jsonpTemplate.replace('[[BUSSTOP]]', msp.busStop), function(stop) {
        stop = msp.parseStop(stop);
        msp.listenerOn.apply(msp, [stop]);
      });
    };
    
    // Parse stop data
    msp.parseStop = function(stop) {
      stop = _.map(stop, function(s) {
        // /Date(1370124480000-0500)/ (This can't be right)
        s.time = moment(eval(s.DepartureTime.substring(6, s.DepartureTime.length - 2)));
        return s
      });
      stop = _.sortBy(stop, function(s) { return s.time.unix(); });
      
      return stop;
    };
    
    // Set listender
    msp.on = function(listener) {
      msp.listenerOn = listener;
    };
    
    // Start listening
    msp.start = function(busStop) {
      msp.busStop = (busStop) ? busStop : msp.busStop;
      
      // Stop any that may exist
      if (msp.pollID) {
        msp.stop();
      }
      
      // Kick off, then set interval
      msp.getStopData();
      msp.pollID = window.setInterval(msp.getStopData, msp.pollInterval);
    };
    
    // Stop listening
    msp.stop = function() {
      window. clearInterval(msp.pollID);
    };
    
    return msp;
  };
  
})(jQuery)