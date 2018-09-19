// Copyright 2018 Team 254. All Rights Reserved.
// Author: pat@patfairbank.com (Patrick Fairbank)
//
// Client-side logic for the display configuration page.

var displayTemplate = Handlebars.compile($("#displayTemplate").html());
var websocket;

var configureDisplay = function(displayId) {
  // Convert configuration string into map.
  var configurationMap = {}
  $.each($("#displayConfiguration" + displayId).val().split("&"), function(index, param) {
    var keyValuePair = param.split("=");
    configurationMap[keyValuePair[0]] = keyValuePair[1];
  });

  websocket.send("configureDisplay", {
    Id: displayId,
    Nickname: $("#displayNickname" + displayId).val(),
    Type: parseInt($("#displayType" + displayId).val()),
    Configuration: configurationMap
  });
};

var undoChanges = function() {
  window.location.reload();
};

var reloadDisplay = function(displayId) {
  websocket.send("reloadDisplay", displayId);
};

var reloadAllDisplays = function() {
  websocket.send("reloadAllDisplays");
};

// Handles a websocket message to refresh the display list.
var handleDisplayConfiguration = function(data) {
  $("#displayContainer").empty();

  $.each(data.Displays, function(displayId, display) {
    var displayRow = displayTemplate(display);
    $("#displayContainer").append(displayRow);
    $("#displayNickname" + displayId).val(display.Nickname);
    $("#displayType" + displayId).val(display.Type);

    // Convert configuration map to query string format.
    var configurationString = $.map(Object.entries(display.Configuration), function(entry) {
      return entry.join("=");
    }).join("&");
    $("#displayConfiguration" + displayId).val(configurationString);
  });
};

$(function() {
  // Set up the websocket back to the server.
  websocket = new CheesyWebsocket("/setup/displays/websocket", {
    displayConfiguration: function(event) { handleDisplayConfiguration(event.data); }
  });
});
