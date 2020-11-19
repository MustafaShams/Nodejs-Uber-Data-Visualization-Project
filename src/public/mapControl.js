require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/GraphicsLayer",
	"esri/Graphic",
	"esri/widgets/Search",
	"esri/widgets/Home",
	"esri/widgets/Editor",
	"esri/layers/FeatureLayer",
], function (Map, MapView, GraphicsLayer, Graphic, Search, Home, Editor, FeatureLayer) {
	var map = new Map({
		basemap: "topo-vector"
	});

	var view = new MapView({
		container: "viewDiv",
		map: map,
		center: [-73.935242, 40.730610], // longitude, latitude
		zoom: 10
	});
	var markerSymbol = {
		type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
		color: "lightblue",
		size: 5,
		outline: {
			// autocasts as new SimpleLineSymbol()
			color: [0, 0, 0],
			width: 1.5
		},



	};
	var layer = new GraphicsLayer({
		title: "LatLayer"
	});


	const editThisAction = {
		title: "Edit feature",
		id: "edit-this",
		className: "esri-icon-edit"
	};


	var homeButton = new Home({
		view: view
	});

	view.ui.add(homeButton, {
		position: "top-left"
	});



	// Add widget to top-right of the view




	const template = {
		title: "{latitude},{longitude}",
		content: [{
			type: "fields",
			fieldInfos: [{
					fieldName: "latitude"
				},
				{
					fieldName: "longitude"
				},
				{
					fieldName: "time"
				},
				{
					fieldName: "date"
				},
				{
					fieldName: "type"
				}
			],
		}, ],

		actions: [editThisAction]
	};

	function getAddress(lat, lon) {
		console.log(lat, lon)
		return "Hello";
	}


	var uvRenderer = {
		type: "simple",
		symbol: markerSymbol
	};




	$("#submit").click(function () {
		var sendKey;
		var sendField;
		sendKey = $("#searchBar").val();
		sendField = $("#data_selection").val();
		if (sendKey) {
			var url = "http://localhost:3000/searchLatLon?field=" + sendField + "&id=" + sendKey;
			$.get(url, function (info) {
				layer.removeAll();
				//console.log(data);
				var data = info[0];
				for (var x = 0; x < data.length; x++) {
					var lat = data[x].lat;
					var lon = data[x].lon;
					var time = data[x].time;
					var date = data[x].date;
					var type = "uber";
					createPoint(lat, lon, time, date, type);
				}
				data1 = info[1]
				for (var x = 0; x < data1.length; x++) {
					var lat = data1[x].lat;
					var lon = data1[x].lon;
					var time = data1[x].time;
					var date = data1[x].date;
					var type = "lyft";
					createPoint(lat, lon, time, date, type);
				}

				const layerPoint = new FeatureLayer({

					// create an instance of esri/layers/support/Field for each field object
					fields: [{
							name: "Latitude",
							alias: "Latitude",
							type: "string"
						},
						{
							name: "Longitude",
							alias: "Longitude",
							type: "string"
						},
						{
							name: "Time",
							alias: "Time",
							type: "string"
						},
						{
							name: "Date",
							alias: "Date",
							type: "string"
						},
						{
							name: "type",
							alias: "Type",
							type: "string",
							editable: false
						}
					],
					objectIdField: "name", // inferred from fields array if not specified
					geometryType: "point", // geometryType and spatialReference are inferred from the first feature
					// in the source array if they are not specified.
					source: layer.graphics, //  an array of graphics with geometry and attributes
					symbol: markerSymbol,

					// popupTemplate and symbol are not required in each feature
					// since those are handled with the popupTemplate and
					// renderer properties of the layer
					popupTemplate: template,
					// a default simple renderer will be applied if not set.
					renderer: uvRenderer // UniqueValueRenderer based on `type` attribute
				});





				map.add(layerPoint);
				let editor = new Editor({
					view: view,
					// Pass in the configurations.
					layer: layerPoint
				});


				view.popup.on("trigger-action", function (event) {
					// If the zoom-out action is clicked, the following code executes
					if (event.action.id === "edit-this") {
						console.log("Editing")
						editThis();
					}
				});

				var initial, updated;

				function editThis() {


					// If the EditorViewModel's activeWorkflow is null, make the popup not visible
					if (!editor.viewModel.activeWorkFlow) {

						var currPop = view.popup
						currPop.visible = false;
						// Call the Editor update feature edit workflow
						initial = view.popup.selectedFeature.attributes;
						editor.startUpdateWorkflowAtFeatureEdit(
							view.popup.selectedFeature


						);
						view.ui.add(editor, "bottom-right");
						view.popup.spinnerEnabled = false;
					}

					// We need to set a timeout to ensure the editor widget is fully rendered. We
					// then grab it from the DOM stack
					setTimeout(function () {
						// Use the editor's back button as a way to cancel out of editing
						let arrComp = editor.domNode.getElementsByClassName(
							"esri-editor__back-button esri-interactive"
						);
						if (arrComp.length === 1) {
							// Add a tooltip for the back button
							arrComp[0].setAttribute(
								"title",
								"Cancel edits, return to popup"
							);
							// Add a listerner to listen for when the editor's back button is clicked
							arrComp[0].addEventListener("click", function (evt) {
								// Prevent the default behavior for the back button and instead remove the editor and reopen the popup
								evt.preventDefault();
								view.ui.remove(editor);
								//currPop.visible = true;
								view.popup.open({
									features: features
								});

							});
						}
					}, 150);
				}

				view.popup.watch("visible", function (event) {
					// Check the Editor's viewModel state, if it is currently open and editing existing features, disable popups
					if (editor.viewModel.state === "editing-existing-feature") {
						view.popup.close();
					} else {
						// Grab the features of the popup
						features = view.popup.features;
					}
				});

				layerPoint.on("apply-edits", function (results) {
					console.log(results)
					view.ui.remove(editor);
					if (results.edits.deleteFeatures) {
						var previous = results.edits.deleteFeatures[0].attributes
						var previousData = [previous.Date, previous.Time, previous.Latitude, previous.Longitude, previous.type]
						console.log("Delete", previousData);
						
						var url = "http://localhost:3000/delteLatLon?data=" + previousData;
						$.get(url, function (data) {})
						editor.viewModel.cancelWorkflow();
					} else {

						console.log("EDITS");
						// Once edits are applied to the layer, remove the Editor from the UI



						// Iterate through the features
						features.forEach(function (feature) {
							// Reset the template for the feature if it was edited
							feature.popupTemplate = template;
						});



						// Open the popup again and reset its content after updates were made on the feature
						if (features) {
							console.log("reseting popup");
							var newFeature = features
							view.popup.open({
								features: newFeature
							});

						}
						view.popup.close()
						updated = view.popup.selectedFeature.attributes

						var previousData = [initial.Date, initial.Time, initial.Latitude, initial.Longitude, initial.type]
						var updatedData = [updated.Date, updated.Time, updated.Latitude, updated.Longitude, initial.type]

						console.log("Old:", previousData);
						console.log("New:", updatedData);

						var url = "http://localhost:3000/editLatLon?old=" + previousData + "&new=" + updatedData;
						console.log("updating");
						$.get(url, function (data) {})
						// Cancel the workflow so that once edits are applied, a new popup can be displayed
						editor.viewModel.cancelWorkflow();

					}



				});

			});
		}
	});


	function createPoint(lat, lon, time, date, type) {
		var point = {
			type: "point", // autocasts as new Point()
			longitude: lon,
			latitude: lat,
		};

		var attributes = {
			Name: lat + ", " + lon, // The name of the
			Latitude: lat,
			Longitude: lon,
			Time: time,
			Date: date,
			Type: type
		};
		// Create popup template
		var pointGraphic = new Graphic({
			geometry: point,
			symbol: markerSymbol,
			attributes: attributes
		});

		//view.graphics.add(pointGraphic);
		layer.graphics.push(pointGraphic);
		//map.add(layer);

	}




	var search = new Search({
		view: view
	});
	//view.ui.add(search, "top-right"); // Add to the map

	view.on("click", function (evt) {
		view.hitTest(evt).then(function (response) {
			if (response.results.length) {
				try {
					var graphic = response.results.filter(function (result) {
						// check if the graphic belongs to the layer of interest
						return result.graphic.layer === layer;
					})[0].graphic;

					search.clear();
					view.popup.clear();
					if (search.activeSource) {
						var geocoder = search.activeSource.locator; // World geocode service
						var params = {
							location: evt.mapPoint
						};
						geocoder.locationToAddress(params)
							.then(function (response) { // Show the address found
								var address = response.address;
								showPopup(address, evt.mapPoint, graphic.attributes);
							}, function (err) { // Show no address found
								showPopup("No address found.", evt.mapPoint);
							});
					}
				} catch (err) {}
				// do something with the result graphic
			}
		});
	});



	function showPopup(address, pt, info) {

		console.log(info);
		var popContent = "A call from " + address + " was made on " + info.Date + " at " + info.Time

		view.popup.open({
			title: +Math.round(pt.longitude * 100000) / 100000 + ", " + Math.round(pt.latitude * 100000) / 100000,
			content: popContent,
			location: pt,
			actions: [editThisAction],
		});
		console.log(view.popup);
	}

	view.popup.dockOptions = {
		// Disable the dock button so users cannot undock the popup
		buttonEnabled: false,
		// Dock the popup when the size of the view is less than or equal to 600x1000 pixels
	};




	map.on("click", function (e) {
		//get the associated node info when the graphic is clicked
		var node = e.graphic.getNode();
		console.log(node);
	});





});