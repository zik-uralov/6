// $Id$

/**
 * Internal function to check using Ajax if clean URLs can be enabled on the
 * settings page.
 *
 * This function is not used to verify whether or not clean URLs
 * are currently enabled.
 */
Drupal.behaviors.cleanURLsSettingsCheck = function(context) {
  // This behavior attaches by ID, so is only valid once on a page.
  // Also skip if we are on an install page, as Drupal.cleanURLsInstallCheck will handle
  // the processing.
  if ($("#clean-url.clean-url-processed, #clean-url.install").size()) {
    return;
  }
  var url = location.pathname +"admin/settings/clean-urls";
  $("#clean-url .description span").html('<div id="testing">'+ Drupal.t('Testing clean URLs...') +"</div>");
  $("#clean-url p").hide();
  $.ajax({url: location.protocol +"//"+ location.host + url, type: "GET", data: " ", complete: function(response) {
    $("#testing").toggle();
    if (response.status == 200) {
      // Check was successful.
      $("#clean-url input.form-radio").attr("disabled", "");
      $("#clean-url .description span").append('<div class="ok">'+ Drupal.t('Your server has been successfully tested to support this feature.') +"</div>");
    }
    else {
      // Check failed.
      $("#clean-url .description span").append('<div class="warning">'+ Drupal.t('Your system configuration does not currently support this feature. The <a href="http://drupal.org/node/15365">handbook page on Clean URLs</a> has additional troubleshooting information.') +"</div>");
    }
  }});
  $("#clean-url").addClass('clean-url-processed');
};

/**
 * Internal function to check using Ajax if clean URLs can be enabled on the
 * install page.
 *
 * This function is not used to verify whether or not clean URLs
 * are currently enabled.
 */
Drupal.cleanURLsInstallCheck = function() {
  var pathname = location.pathname +"";
  var url = pathname.replace(/\/[^/]*$/, "/") +"node";
  $("#clean-url .description").append('<span><div id="testing">'+ Drupal.settings.cleanURL.testing +"</div></span>");
  $("#clean-url.install").css("display", "block");
  $.ajax({url: location.protocol +"//"+ location.host + url, type: "GET", data: " ", complete: function(response) {
    $("#testing").toggle();
    if (response.status == 200) {
      // Check was successful.
      $("#clean-url input.form-radio").attr("disabled", "");
      $("#clean-url .description span").append('<div class="ok">'+ Drupal.settings.cleanURL.success +"</div>");
      $("#clean-url input.form-radio").attr("checked", 1);
    }
    else {
      // Check failed.
      $("#clean-url .description span").append('<div class="warning">'+ Drupal.settings.cleanURL.failure +"</div>");
    }
  }});
  $("#clean-url").addClass('clean-url-processed');
};

Drupal.installDefaultTimezone = function() {
  var offset = new Date().getTimezoneOffset() * -60;
  $("#edit-date-default-timezone").val(offset);
};

/**
 * Show/hide custom format sections on the date-time settings page.
 */
Drupal.behaviors.dateTime = function(context) {
  // Show/hide custom format depending on the select's value.
  $('select.date-format:not(.date-time-processed)', context).change(function() {
    $(this).addClass('date-time-processed').parents("div.date-container").children("div.custom-container")[$(this).val() == "custom" ? "show" : "hide"]();
  });

  // Attach keyup handler to custom format inputs.
  $('input.custom-format:not(.date-time-processed)', context).addClass('date-time-processed').keyup(function() {
    var input = $(this);
    var url = Drupal.settings.dateTime.lookup +(Drupal.settings.dateTime.lookup.match(/\?q=/) ? "&format=" : "?format=") + Drupal.encodeURIComponent(input.val());
    $.getJSON(url, function(data) {
      $("div.description span", input.parent()).html(data);
    });
  });

  // Trigger the event handler to show the form input if necessary.
  $('select.date-format', context).trigger('change');
};