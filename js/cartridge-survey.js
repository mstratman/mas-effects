$(document).ready(function() {

  $('.imageGallery1 a').simpleLightbox();
  $('.imageGallery2 a').simpleLightbox();

  $("#q1-yes").click(function() {
    showInterestedForm();
    submitQ1("yes");
  });
  $("#q1-maybe").click(function() {
    showInterestedForm();
    submitQ1("maybe");
  });
  $("#q1-no").click(function() {
    showDisinterestedForm();
    submitQ1("no");
  });

  $("#show-more-gallery").click(function(e) {
    e.preventDefault();
    $("#gallery-preview").hide();
    $("#gallery-more").show();
    $("#show-more-gallery").hide();
  });

  $("#show-more-details").click(function(e) {
    e.preventDefault();
    $("#more-details").show();
    $("#show-more-details").hide();
  });



  $("#cartridge-yes-or-no").submit(function(e) {
    e.preventDefault();
    var $form = $(this);
    $.post($form.attr("action"), $form.serialize())
      .then(function() {
        // TODO: When will this be called
        alert("Thank you!");
      });
  });

  $("#cartridge-email-form").submit(function(e) {
    e.preventDefault();
    var $form = $(this);
    $.post($form.attr("action"), $form.serialize())
      .then(function() {
        $("#email-signup-done").show();
      });
  });

  /* Netlify can't see these
  $(".toggle-btn").each(function(t) {
    var name = $(this).attr("name");
    $(this).after('<input type="hidden" name="' + name + '-qty" value="0">');
  });
  */

  $(".toggle-btn").click(function(e) {
    if ($(this).data("is-picked")) {
      $(this).data("is-picked", false);
      $(this).removeClass("btn-success");
      $(this).addClass("btn-outline-primary");
      $(this).val("Add");
      $(this).next("input").val("0");
    } else {
      $(this).data("is-picked", true);
      $(this).removeClass("btn-outline-primary");
      $(this).addClass("btn-success");
      $(this).val("Added");
      $(this).next("input").val("1");
    }
  });

});

function submitQ1(answer) {
  //$("#back-to-question").hide();

  $("#initial-answer").val(answer);
  $("#q1-answer").val(answer);

  var $form = $("#cartridge-yes-or-no");
  $.post($form.attr("action"), $form.serialize()).then(function() {
      //
  });
}

function showDisinterestedForm() {
  $("#if-interested").hide();
  $("#if-not-interested").show();
}
function showInterestedForm() {
  $("#if-interested").show();
  $("#if-not-interested").hide();
  location.hash = "#thank-you";
}
