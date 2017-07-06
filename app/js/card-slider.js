//  The setTimeouts used in this file, together with the delays, are used to time the changes in display
//  property of the slides and their subsequent fade-in effects. If the browser sets the display property
//  of a slide to 'block', it still takes some time for the element to be able to animate from one set of
//  css rules to another. This is what the delays are for. Browsers do not provide an event for the
//  change of a display property of an element, so we need to make do with manual delays.
;(function() {
  'use strict';

  var elements = {},
      selectors = {
        container: '[data-slide-component]',
        slide: '[data-slide]'
      },
      classes = {
        1: 'slide-ready',
        2: 'slide-visible',
        3: 'slide-passed-1',
        4: 'slide-passed-2',
        5: 'slide-passed-3'
      },
      states = {
        numberOfStates: 5,
        1: {
          display: 'none',
          class: classes[1]
        },
        2: {
          display: 'block',
          class: classes[2]
        },
        3: {
          display: 'block',
          class: classes[3]
        },
        4: {
          display: 'block',
          class: classes[4]
        },
        5: {
          display: 'block',
          class: classes[5]
        }
      },
      currentSlide = 0; //  0 = first slide

  //  utility functions
  function changeSlideState(slide, moveUp, init) {
    var currentState = parseInt(slide.getAttribute('data-slide-state'), 10),
        newState = moveUp ? currentState + 1 : currentState - 1;

    //  if used to init the component, set newState back to currentState
    if (init) newState = currentState;

    //  set display (with a delay if the slide fades to ready position from active position)
    if (newState === 1 && currentState === 2) {
      setTimeout(function() {
        slide.style.display = states[newState].display;
      }, 500);
    } else {
      slide.style.display = states[newState].display;
    }
    //  set new class (with a delay if the slide fades to active position from ready position)
    if (newState === 2 && currentState === 1) {
      setTimeout(function() {
        slide.classList.add(states[newState].class);
      }, 250);
    } else {
      slide.classList.add(states[newState].class);
    }
    //  remove old class if not init
    if (!init) slide.classList.remove(states[currentState].class);
    //  update data-slide-state
    slide.setAttribute('data-slide-state', newState);
  }

  function next() {
    //  when at the last slide, don't allow further progression
    if (elements.slides.length === currentSlide + 1) return;
    for (var i = -2; i <= 1; i++) {
      if (elements.slides[currentSlide + i]) {
        changeSlideState(elements.slides[currentSlide + i], true);
      }
    }
    currentSlide++;
    window.SUEZ.progressBar.next();
  }

  function previous() {
    //  when at the first slide, don't allow further regression
    if (currentSlide === 0) return;
    //  change currentSlide first, start the rest after a delay
    changeSlideState(elements.slides[currentSlide], false);
    setTimeout(function() {
      for (var i = -3; i <= -1; i++) {
        if (elements.slides[currentSlide + i]) {
          changeSlideState(elements.slides[currentSlide + i], false);
        }
      }
      currentSlide--;
    }, 250);
    window.SUEZ.progressBar.previous();
  }

  //  init functions
  function initElements() {
    elements.container = document.querySelector(selectors.container);
    elements.slides = elements.container ? [...elements.container.querySelectorAll(selectors.slide)] : null;
  }

  function initSlides() {
    //  for each slide...
    elements.slides.forEach(function(slide) {
      //  ...set data-slide-state...
      slide.setAttribute('data-slide-state', '1');
      //  ...and change slide state
      changeSlideState(slide, false, true);
    });
    //  change first slide state, move it up the chain
    changeSlideState(elements.slides[0], true);
  }

  function addEventHandlers() {
    elements.container.addEventListener('click', function(event) {
      if ('slideNext' in event.target.dataset && event.target.closest('.' + classes[2])) {
        next();
      }
      if ('slidePrevious' in event.target.dataset && event.target.closest('.' + classes[2])) {
        previous();
      }
    });
  }

  function init() {
    initElements();
    if (!elements.container) return;
    console.log('slider active');
    initSlides();
    addEventHandlers();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
