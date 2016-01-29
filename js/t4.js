/*jshint browser: true, jquery: true*/
/*
 * jquery.accordion.js
 * 
 * Implementing accordion.js
 *     $(document).accordion();
 *
 * This is an example of the object used to store target
 * data: target ids, their sources, and the initial height.
 * Each target can have multiple sources
 *
 * { 
 *   targId1: {
 *               sources: [elem, elem,..],
 *               height: 84
 *             },
 *   targId2: {
 *               sources: [elem, elem,..],
 *               height: 84
 *             },
 *   ...
 * }   
 *
 * 
 *
 */

(function ($) {
  'use strict';

  $.fn.accordion = function (opts) {
    var defaults = {
      singleOpen: true,
      icons: true,
      animationSpeed: 400
    };
    var options = $.extend({}, defaults, opts);

    /* VARiables 
    =============================================== */
    var aSources, // array of source elements
      aTargetIds = {}; // object that stores target info


    /* FUNCTIONS 
    =============================================== */

    /* populate aTargetIds object w sources  */
    function getTargetIds() {
      var targetId, i;
      for (i = 0; i < aSources.length; i += 1) {
        targetId = aSources[i].getAttribute('data-accordion-target');
        if (aTargetIds.hasOwnProperty(targetId)) {
          aTargetIds[targetId].sources.push(aSources[i]);
        } else {
          aTargetIds[targetId] = {
            sources: [aSources[i]]
          };
        }
      }
    }

    /* populate the 'height' property for each target in the
     * aTargets object
     */
    function getTargetHeights() {
      var tId, elem;
      for (tId in aTargetIds) {
        if (aTargetIds.hasOwnProperty(tId)) {
          elem = document.getElementById(tId);
          aTargetIds[tId].height = elem.clientHeight;
        }
      }
    }

    /* Sets the target element height to zero 
     * param: targetId (string)
     */
    function zeroHeight(targetId) {
      document.getElementById(targetId).style.height = '0';
    }

    function setTransitionSpeed() {
      $('.accordion-target').css('transition-duration', options.animationSpeed);
    }

    /* Sets all target element heights to zero */
    function zeroAllElementHeights() {
      var tId, i;
      for (tId in aTargetIds) {
        if (aTargetIds.hasOwnProperty(tId)) {
          zeroHeight(tId);
          if (options.icons) {
            for (i = 0; i < aTargetIds[tId].sources.length; i += 1) {
              aTargetIds[tId].sources[i].classList.remove('accordion-open');
              aTargetIds[tId].sources[i].classList.add('accordion-closed');
            }
          }
        }
      }
    }

    /* The Event Handler*/
    function accordionAction(e) {
      var src = e.target;
      var tId = e.target.getAttribute('data-accordion-target');
      var theTarget = document.getElementById(tId);
      var prop, i;

      if (options.singleOpen) {
        // make sure all sources are closed
        zeroAllElementHeights();
        // and all sources have a class of 'accordion-closed'
        for (prop in aTargetIds) {
          if (aTargetIds.hasOwnProperty(prop)) {
            if (options.icons) {
              for (i = 0; i < aTargetIds[prop].sources.length; i += 1) {
                aTargetIds[prop].sources[i].classList.remove('accordion-open');
                aTargetIds[prop].sources[i].classList.add('accordion-closed');
              }
            }
          }
        }
      }
      // toggle open/closed state
      if (theTarget.clientHeight === 0) {
        // open target element
        theTarget.style.height = aTargetIds[tId].height + 'px';
        // change source(s) icon
        if (options.icons) {
          for (i = 0; i < aTargetIds[tId].sources.length; i += 1) {
            aTargetIds[tId].sources[i].classList.remove('accordion-closed');
            aTargetIds[tId].sources[i].classList.add('accordion-open');
          }
        }
      } else {
        theTarget.style.height = '0';
        if (options.icons) {
          for (i = 0; i < aTargetIds[tId].sources.length; i += 1) {
            aTargetIds[tId].sources[i].classList.remove('accordion-open');
            aTargetIds[tId].sources[i].classList.add('accordion-closed');
          }
        }
      }
    }

    /* Adds a 'click' listener to all Source elements */
    function addListenersToSources() {
      var srcs, tId, i;
      for (tId in aTargetIds) {
        if (aTargetIds.hasOwnProperty(tId)) {
          srcs = aTargetIds[tId].sources;
          for (i = 0; i < srcs.length; i += 1) {
            srcs[i].addEventListener('click', accordionAction);
          }
        }
      }
    }


    /* APPLICATION 
    =============================================== */

    // get array of accordion source elements
    aSources = document.querySelectorAll('[data-accordion-target]');

    // get the accordion target ids from the sources
    getTargetIds();

    // Get the height of each of the targets.
    getTargetHeights();

    // Set height of all targets to zero
    zeroAllElementHeights();

    // Set the transition speed
    setTransitionSpeed();

    // add click eventListener to each Source element
    addListenersToSources();

  };
}(jQuery));

/*jshint browser: true, jquery: true*/

/* -----------------------------
 *    Back To Top Plugin
 * ----------------------------- */

(function ($) {

  $.fn.backtotop = function (opts) {

    if ($('#back-to-top').length) {

      var bttElem = $('#back-to-top'),
        defaults = {
          scrollSpeed: 500
        },
        options = $.extend({}, defaults, opts),
        distanceFromTop = 100, // px
        scrollTop,
        backToTop = function () {
          scrollTop = $(window).scrollTop();
          if (scrollTop > distanceFromTop) {
            //            $('#back-to-top').fadeIn();
            bttElem.fadeIn();
          } else {
            $('#back-to-top').fadeOut();
            bttElem.fadeOut();
          }
        };
      //      $('#back-to-top').hide();
      backToTop();
      $(window).on('scroll', function () {
        backToTop();
      });
      //      $('#back-to-top').on('click', function (e) {
      bttElem.on('click', function (e) {
        e.preventDefault();
        // 'html' for FF, 'body' for Chrome
        $('html, body').animate({
          scrollTop: 0
        }, options.scrollSpeed);
      });

    } // if
  }; // $.fn.backtotop
})(jQuery);

/* -----------------------------
 *    Even Heights Plugin
 * ----------------------------- */

(function ($) {
  'use strict';
  $.fn.evenHeight = function () {
    var tallest = 0,
      $columns = this;

    $columns.each(function (i, col) {
      var colHeight = $(col).outerHeight();
      if (colHeight > tallest) {
        tallest = colHeight;
      }
    });
    $columns.css('min-height', tallest);
    return $columns;
  };
})(jQuery);

/* --------------------------------------
 *    Tool Tip
 * -------------------------------------- */

/*
 * jquery.tooltip.js
 *
 * add class="tooltip" to an element
 * add data-tip-text="Tooltip text" to the same element
 *
 */

(function ($) {

  $.fn.tooltip = function (opts) {

    var defaults = {
        fadeSpeed: 200
      },
      options = $.extend({}, defaults, opts);


    // Create and style the tooltip div... and hide it
    $('body').append('<div id="tooltip-container"></div>');
    var tooltipContainer = $('#tooltip-container');
    tooltipContainer.css({
      "display": "none",
    });



    $(this)
      .mouseover(function (e) {
        tooltipContainer.html($(this).data('tip-text'));
        tooltipContainer.fadeIn(options.fadeSpeed);
      })
      .mousemove(function (e) {

        var tooltipWidth = tooltipContainer.outerWidth(),
          tooltipHeight = tooltipContainer.outerHeight(),
          pageWidth = $('body').width();

        if (e.pageX < pageWidth / 2) {
          tooltipContainer.css('left', (e.pageX - 20) + 'px');
        } else {
          tooltipContainer.css('left', (e.pageX - tooltipWidth + 20) + 'px');
        }

        if (e.pageY < (tooltipHeight + 20)) {
          tooltipContainer.css('top', (e.pageY + 30) + 'px');
        } else {
          tooltipContainer.css('top', (e.pageY - tooltipHeight - 20) + 'px');
        }

      })
      .mouseout(function (e) {
        tooltipContainer.fadeOut(options.fadeSpeed);
      });

  };

})(jQuery);
