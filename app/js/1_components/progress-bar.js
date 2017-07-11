;(function() {
  'use strict';

  var lastCompletedSlide = 0,
      slides = [...document.querySelectorAll('[data-progress-bar-component] [data-progress-bar-step]')],
      numberOfSlides = slides.length,
      classes = {
        completed: 'is-complete',
        readyForAnimation: 'is-ready-for-animation'
      };

  function next() {
    if (lastCompletedSlide === numberOfSlides) return;
    slides[lastCompletedSlide].classList.add(classes.completed);
    lastCompletedSlide++;
  }

  function previous() {
    if (lastCompletedSlide === 0) return;
    slides[lastCompletedSlide - 1].classList.remove(classes.completed);
    lastCompletedSlide--;
  }

  function addReadyForAnimationClass() {
    setTimeout(function() {
      [...document.querySelectorAll('[data-progress-bar-component]')].forEach(function(component) {
        component.classList.add(classes.readyForAnimation);
      });
    }, 1000);
  }

  function addEventListeners() {
    document.addEventListener('click', function(event) {
      if ('next' in event.target.dataset) {
        next();
      }
      if ('previous' in event.target.dataset) {
        previous();
      }
    });
  }

  function init() {
    if (!slides.length) return;
    console.log('progress-bar active');
    addEventListeners();
    addReadyForAnimationClass();

    // add methods to global SuezApp object for use in other modules
    window.SuezApp = window.SuezApp || {};
    window.SuezApp.progressBar = {
      next: next,
      previous: previous
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
