/**
 * 
 */

(function(jQuery, undefined) {
  // High level variables
  var busStop = '17982';
  var $experimentContainer = $('.experiment-container');
  var stopPooler = mspStopPooler();
  var stopsData;
  //var colorRange = ['#FC8D59', '91BFDB'];

  // Experiment callbacks
  var experiments = {};
  
  // Dots
  experiments.dots = {};
  experiments.dots.name = 'Dots';
  experiments.dots.callback = function() {
    var template = _.template($('#template-dots').html());
    var minuteLimit = 20;
    var minuteGroups = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
  
    // Update dom
    $experimentContainer.html('<div id="dots"></div>');
    $experimentContainer.show();
  
    // Pooler listener
    stopPooler.on(function(currentStop) {
      var now = moment();
      $('#dots').html('');
    
      var filtered = _.filter(currentStop, function(b) { return b.Actual; });
      _.each(filtered, function(bus) {
        $('#dots').append(template({
          bus: bus,
          now: now,
          minutes: moment.duration(bus.time.diff(now)).minutes(),
          minuteGroups: minuteGroups
        }));
      });
      
      $('.experiment-container').css('padding-top', '0');
    });
    stopPooler.start(busStop);
  };
  
  // Color list
  experiments.colorList = {};
  experiments.colorList.name = 'Colors';
  experiments.colorList.callback = function() {
    var colorRange = ['#EFEE69', '#21313E'];
    var colorRange = ['#FF0040', '#40FF00'];
    var template = _.template($('#template-color-list').html());
    var minuteLimit = 20;
    var colorScale = chroma.scale(colorRange);
    colorScale.mode('lab');
  
    // Update dom
    $experimentContainer.html('<div id="color-list"></div>');
    $experimentContainer.show();
  
    // Pooler listener
    stopPooler.on(function(currentStop) {
      var now = moment();
      $('#color-list').html('');
    
      var filtered = _.filter(currentStop, function(b) { return b.Actual; });
      _.each(filtered, function(bus) {
        var percentage = 1 - (moment.duration(bus.time.diff(now)).minutes() / minuteLimit);
        $('#color-list').append(template({
          bus: bus,
          percentage: percentage,
          color: colorScale(percentage).hex()
        }));
      });
      
      $('.experiment-container').css('padding-top', '0');
    });
    stopPooler.start(busStop);
  };
  
  // Simple list
  experiments.simpleList = {};
  experiments.simpleList.name = 'List';
  experiments.simpleList.callback = function() {
    var colorRange = ['#21313E', '#EFEE69'];
    var template = _.template($('#template-simple-list').html());
    var minuteLimit = 20;
    var colorScale = chroma.scale(colorRange);
    colorScale.mode('hsi');
  
    // Update dom
    $experimentContainer.html('<div id="simple-list" class="container"></div>');
    $experimentContainer.show();
  
    // Pooler listener
    stopPooler.on(function(currentStop) {
      var now = moment();
      $('#simple-list').html('');
    
      var filtered = _.filter(currentStop, function(b) { return b.Actual; });
      _.each(filtered, function(bus) {
        var percentage = 1 - (moment.duration(bus.time.diff(now)).minutes() / minuteLimit);
        $('#simple-list').append(template({
          bus: bus,
          percentage: percentage,
          color: colorScale(percentage).hex()
        }));
      });
      
      app.verticallyAlign();
    });
    stopPooler.start(busStop);
  };
  
  // Bus icon
  experiments.busIcon = {};
  experiments.busIcon.name = 'Icons';
  experiments.busIcon.callback = function() {
    var template = _.template($('#template-bus-icon').html());
    var minuteLimit = 20;
  
    // Update dom
    $experimentContainer.html('<div id="bus-icon" class="container"></div>');
    $experimentContainer.show();
  
    // Pooler listener
    stopPooler.on(function(currentStop) {
      var now = moment();
      $('#bus-icon').html('');
    
      var filtered = _.filter(currentStop, function(b) { return b.Actual; });
      _.each(filtered, function(bus) {
        var percentage = 1 - (moment.duration(bus.time.diff(now)).minutes() / minuteLimit);
        $('#bus-icon').append(template({
          bus: bus, 
          items: (filtered.length > 4) ? 4 : filtered.length,
          percentage: percentage
        }));
      });
      
      app.verticallyAlign();
    });
    stopPooler.start(busStop);
  };
  
  // Simple opacity
  experiments.simpleOpacity = {};
  experiments.simpleOpacity.name = 'Opacity';
  experiments.simpleOpacity.callback = function() {
    var template = _.template($('#template-simple-opacity').html());
    var minuteLimit = 20;
  
    // Update dom
    $experimentContainer.html('<div id="simple-opacity" class="container"></div>');
    $experimentContainer.show();
  
    // Pooler listener
    stopPooler.on(function(currentStop) {
      var now = moment();
      $('#simple-opacity').html('');
    
      var filtered = _.filter(currentStop, function(b) { return b.Actual; });
      _.each(filtered, function(bus) {
        var percentage = 1 - (moment.duration(bus.time.diff(now)).minutes() / minuteLimit);
        $('#simple-opacity').append(template({
          bus: bus, 
          items: (filtered.length > 4) ? 4 : filtered.length,
          percentage: percentage
        }));
      });
      
      app.verticallyAlign();
    });
    stopPooler.start(busStop);
  };
  
  // Map experiment
  experiments.map = {};
  experiments.map.name = 'Map';
  experiments.map.callback = function() {
    var busStopMarker;
    var busesMarkers = [];
    var busStyle = {
      color: '#F5B800',
      opacity: 0.9,
      weight: '2',
      fillColor: '#FFD65C',
      fillOpacity: 0.7,
      radius: 7
    };
    
    // Update dom
    $experimentContainer.html('<div id="bus-stop-map"></div>');
    $experimentContainer.show();
    
    // Create map
    var map = L.map('bus-stop-map');
    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Handle updating
    var updater = function(stops) {
      // Start pooling API
      stopPooler.on(function(currentStop) {
        // Set map
        map.setView([stops[stopPooler.busStop].lat, stops[stopPooler.busStop].lon], 13);
        
        // Stop
        if (busStopMarker) {
          map.removeLayer(busStopMarker);
        }
        busStopMarker = L.marker([stops[stopPooler.busStop].lat, stops[stopPooler.busStop].lon]).addTo(map);
        
        // Add bus markers
        _.each(busesMarkers, function(b) {
          map.removeLayer(b);
        });
        _.each(currentStop, function(bus) {
          if (bus.Actual) {
            var circle = new L.CircleMarker([bus.VehicleLatitude, bus.VehicleLongitude], busStyle);
            map.addLayer(circle);
            circle.bindPopup('Bus ' + bus.Route + bus.Terminal + ' is arriving in approximately ' + bus.DepartureText);
            busesMarkers.push(circle);
          }
        });
        
        $('.experiment-container').css('padding-top', '0');
      });
      stopPooler.start(busStop);
    };
    
    // Get stop data
    if (stopsData) {
      updater(stopsData);
    }
    else {
      $.getJSON('./js/stops.json', function(stops) {
        stopsData = stops;
        updater(stopsData);
      });
    }
  };

  // Handle routing
  var Workspace = Backbone.Router.extend({
    initialize: function() {
      Backbone.history.start();
      
      // Make links
      _.each(experiments, function(ex, i) {
        $('.small-nav .dropdown-menu').prepend('<li><a href="#experiment/' + i + '">' + ex.name + '</a></li>')
      });
      
      this.handleGeolocateStop();
    },
  
    routes: {
      'experiment/:experiment': 'routeExperiment',
      'experiment/:experiment/:stop': 'routeExperiment',
      ':stop': 'routeDefault',
      '*default': 'routeDefault'
    },
  
    routeDefault: function(stop) {
      $('.navbar-fixed-top').addClass('home');
      $experimentContainer.hide();
      
      if (stop) {
        busStop = stop;
      }
      this.navigate(busStop, { replace: true });
      stopPooler.stop();
      this.verticallyAlign();
    },
  
    routeExperiment: function(experiment, stop) {
      $('.navbar-fixed-top').removeClass('home');
      if (experiments[experiment] && _.isFunction(experiments[experiment].callback)) {
        if (stop) {
          busStop = stop;
        }
        this.navigate('experiment/' + experiment + '/' + busStop, { replace: true });
      
        experiments[experiment].callback();
      }
    },
    
    verticallyAlign: function() {
      $('.main-container').each(function() {
        var $container = $(this);
        var height = 0;
        
        $container.children().each(function() {
          height += $(this).height();
        });
        
        if (height < $container.height()) {
          $container.css('padding-top', (($container.height() - height) / 2.65) + 'px');
        }
      });
    },
    
    handleGeolocateStop: function() {
      var thisRouter = this;
      
      $('body').on('click', '.geolocate-stop', function(e) {
        e.preventDefault();
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            if (_.isObject(position)) {
              thisRouter.geolocateStop.apply(thisRouter, [position]);
            }
          }, function() {
            // Handle error
          });
        }
      });
    },
    
    geolocateStop: function(position) {
      var thisRouter = this;
      
      this.getStopsData(function(stops) {
        // Not really accruate
        var min = _.min(stops, function(s) {
          return Math.sqrt(Math.pow((s.lat - position.coords.latitude), 2) + Math.pow((s.lon - position.coords.longitude), 2));
        });
        
        busStop = min.id;
        stopPooler.busStop = busStop;
        thisRouter.navigate(busStop, { replace: true });
      });
    },
    
    getStopsData: function(callback) {
      if (stopsData) {
        callback(stopsData);
      }
      else {
        $.getJSON('./js/stops.json', function(stops) {
          stopsData = stops;
          callback(stopsData);
        });
      }
    }   
  });
  
  var app = new Workspace();

})(jQuery);