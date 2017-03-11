angular.module("WeatherForecastApp", [])
    .controller("WeatherForecastController", ["$scope", "$http",
        "GoogleGeolocationService", "DarkSkyWeatherService",
		function($scope, $http, GoogleGeolocationService,
				 DarkSkyWeatherService){
                        
                        
			// Setting up to refer back to the controller                    
			var wfc = this;
             
            /* 
			wfc.selected_lat = 0;
			wfc.selected_lon = 0;
            */ 
    
    
			// Setting a name for the app
			wfc.app_name = "Weather App";
    
    
			// Cities that will be populated in a dropdown box
			wfc.cities =
			[
				{
					name: "Amarillo",
					url_name: "Amarillo",
					state: "TX",
					//lat: 0,
					//lon: 0
				},
				{  
					name: "Lawton",
					url_name: "Lawton",
					state: "OK",
					//lat: 0,
					//lon: 0
				},
				{
					name: "Boise",
					url_name: "Boise",
					state: "ID",
					//lat: 0,
					//lon: 0
				},
				{
					name: "Del Rio",
					url_name: "Del Rio",
					stat: "TX",
					//lat: 0,
					//lon: 0
				},
				{
					name: "Fort Collins",
					url_name: "Fort Collins",
					state: "CO",
					//lat: 0,
					//lon: 0
				},
				{
					name: "Farmington",
					url_name: "Farmington",
					state: "NM",
					//lat: 0,
					//lon: 0
				},
			];
			
           
			// Getting the lat and long from Google Maps
			wfc.getLatLonForSelected = function(){
				GoogleGeolocationService.geoLocate(wfc.selected_city)
					.then(function(res){
						//wfc.selected_lat = res.data.results[0].geometry.location.lat;
						//wfc.selected_lon = res.data.results[0].geometry.location.lon;
						
						wfc.selected_city.lat = wfc.selected_lat;
						wfc.selected_city.lon = wfc.selected_lon;
						
						var google_static_maps_key = "AIzaSyBUM57jM-ptgNExMBfExzbcAXGO7Dn7A3o";
						
						wfc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
													 wfc.selected_lat + "," + wfc.selected_lon + 
													 "&zoom=10&size=600x300&key=" + google_static_maps_key;
													 
						console.log("Google Static Map API URL");
						console.log(wfc.google_static_maps_url);
						
					wfc.getCurrentConditions();
				})
				.catch(function(err){
					console.log(err);
				});
		};
		
		// Calling the weather service to get the current conditions
		wfc.getCurrentConditions = function(){
			DarkSkyWeatherService.getCurrentConditions(wfc.selected_city)
				.then(function(res){
					console.log(res);
						
					//Weather Conditions from Dark Sky
					wfc.observation_time = new Date(res.data.currently.time * 1000);
					wfc.temperature      = res.data.currently.temperature;
					wfc.dewpoint         = res.data.currently.dewPoint;
					wfc.windBearing      = res.data.currently.windBearing;
					wfc.windSpeed        = res.data.currently.windSpeed;
					wfc.summary          = res.data.currently.summary;
						
				})
				.catch(function(err){
				    console.log(err);
					
				});
		};
		
		wfc.selected_city = wfc.cities[0];
		wfc.getLatLonForSelected();
			
    }])
      // The directive for the weather service to be used
	.directive('myConditionsSpecial', ['$sce', function($sce){
    
        /* https://docs.angularjs.org/guide/directive
        The restrict option is typically set to:

        'A' - only matches attribute name
        'E' - only matches element name
        'C' - only matches class name
        'M' - only matches comment
        */

        return{
            restrict: 'E',
            scope: true,
            templateUrl: $sce.trustAsResourceUrl('currentConditions.html')
        };
    }])
    //Factory for Google Maps
    .factory('GoogleGeolocationService', ['$sce', '$http',
        function($sce, $http){
                
            var geolocationService = {};
                
            //API Key for Gogole
            var key = "AIzaSyBUM57jM-ptgNExMBfExzbcAXGO7Dn7A3o";
                
            geolocationService.geoLocate = function(location){
                    
                var address = "+" + location.name + "," + location.state;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                           address + "&key=" + key;
                    
                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.get(trustedurl);
            };
                
            return geolocationService;
			
		}])
     //Factory for the Dark Sky Weather service
    .factory('DarkSkyWeatherService', ['$sce','$http',
        function($sce, $http){
    
			var darkSkyWeatherService = {};
    
			//API Key
			var key = "0e75b37cd483f69c71f04be6b87bb34f";
    
			darkSkyWeatherService.getCurrentConditions = function(location){
        
				//API Use
				var url = "https://api.darksky.net/forecast/" +
						  key + "/" + location.lat + "," + location.lon;
                        
				console.log("DarkSky API Url:");
				console.log(url);
            
				var trustedurl = $sce.trustAsResourceUrl(url);
				return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});
				
			};
    
			return darkSkyWeatherService;
		}
	]);