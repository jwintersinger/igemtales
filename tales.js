var elements = {
  detector: {
    hitboxes: [
      { tl_x: 212, tl_y: 128, w: 266, h: 40 }
    ],
    link_url: 'http://2013.igem.org/Team:Calgary/Project/OurSensor/Detector',
    //image_url: 'img/detector.png'
    image_url: 'http://2013.igem.org/wiki/images/a/ad/Detector.png'
   },

  linker: {
    hitboxes: [
      { tl_x: 276, tl_y: 61,  w: 39, h: 71 },
      { tl_x: 356, tl_y: 164, w: 79, h: 128 },
    ],
    link_url: 'http://2013.igem.org/Team:Calgary/Project/OurSensor/Linker',
    //image_url: 'img/linker.png'
    image_url: 'http://2013.igem.org/wiki/images/3/3f/Linker.png'

  },

  modelling: {
    hitboxes: [
      { tl_x: 0, tl_y: 266, w: 210, h: 163 }
    ],
    link_url: 'http://2013.igem.org/Team:Calgary/Project/OurSensor/Modeling',
    //image_url: 'img/modelling.png'
    image_url: 'http://2013.igem.org/wiki/images/6/6b/Modelling.png'
  },

  prototype: {
    hitboxes: [
      { tl_x: 453, tl_y: 296, w: 243, h: 96 }
    ],
    link_url: 'http://2013.igem.org/Team:Calgary/Project/OurSensor/Prototype',
    //image_url: 'img/prototype.png'
    image_url: 'http://2013.igem.org/wiki/images/3/31/Prototype.png'
  },

  reporter: {
    hitboxes: [
      { tl_x: 252, tl_y: 1, w: 66, h: 63 }
    ],
    link_url: 'http://2013.igem.org/Team:Calgary/Project/OurSensor/Reporter',
    //image_url: 'img/reporter.png'
    image_url: 'http://2013.igem.org/wiki/images/d/dd/Reporter.png'
  },
};

var all_elem_names = '';
$.each(elements, function(elem_name) {
  all_elem_names += (elem_name + ' ');
});

//=====================================


function is_within(x, y, box) {
  return x >= box.tl_x && y >= box.tl_y &&
    x <= box.tl_x + box.w && y <= box.tl_y + box.h;
}

function find_target(x, y) {
  var under_cursor = null;

  $.each(elements, function(elem_name, elem) {
    $.each(elem.hitboxes, function(idx, hitbox) {
      if(is_within(x, y, hitbox)) {
        under_cursor = elem_name;
        return false; // Stop iterating
      }
    });

    if(under_cursor !== null) {
      return false; // Stop iterating
    }
  });

  return under_cursor;
}

function get_rel_cursor_pos(elem, event) {
  if ('pageX' in event) { // all browsers except IE before version 9
    var pageX = event.pageX;
    var pageY = event.pageY;
  }
  else {  // IE before version 9
    var pageX = event.clientX + document.documentElement.scrollLeft;
    var pageY = event.clientY + document.documentElement.scrollTop;
  }

  return {
    rel_x: pageX - $(elem).offset().left,
    rel_y: pageY - $(elem).offset().top,
  };
}

function preload_images() {
  $.each(elements, function(elem_name, elem) {
    var img = new Image();
    img.src = elem.image_url;
  });
}

function configure_mousemove(container) {
  var default_image_url = container.css('backgroundImage');
  var prev_target = null;

  var on_deactivate = function() {
    container.removeClass('active');
    container.css('backgroundImage', default_image_url);
  };

  container.mousemove(function(event) {
    var cursor_pos = get_rel_cursor_pos(this, event);
    var target = find_target(cursor_pos.rel_x, cursor_pos.rel_y);
    
    if(target === prev_target)
      return;

    if(target === null) {
      on_deactivate();
    } else {
      container.addClass('active');
      var image_url = "url('" + elements[target].image_url + "')";
      container.css('backgroundImage', image_url);
    }

    prev_target = target;
  }).mouseleave(function() {
    on_deactivate();
  });
}

function configure_click(container) {
  container.click(function(evt) {
    evt.preventDefault();

    var cursor_pos = get_rel_cursor_pos(this, evt);
    var target = find_target(cursor_pos.rel_x, cursor_pos.rel_y);
    if(target === null) {
      return;
    }
    
    window.location = elements[target].link_url;
  });
}

$(document).ready(function() {
  preload_images();

  var container = $('#tales-img');
  configure_mousemove(container);
  configure_click(container);
});
