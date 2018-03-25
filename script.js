var START = new Date('Mar 23, 2018'); // Inclusive
var END = new Date('Apr 22, 2018'); // Exclusive
var MS_IN_DAY = 24 * 60 * 60 * 1000;
var DELAY = 5 * 60 * 60 * 1000; // Delay time to show yesterday's results after midnight until 5AM
var TODAY = new Date(Date.now() - DELAY);
var YESTERDAY = new Date(Date.now() - DELAY - MS_IN_DAY);
var TOTAL_DAYS = Math.round((END.getTime() - START.getTime()) / MS_IN_DAY);
var PUSHUPS_DAILY = 1;
var TOTAL_PUSHUPS = PUSHUPS_DAILY * TOTAL_DAYS;

//var dataPromise = httpGET('https://rawgit.com/aslushnikov/toetouching-challenge/master/toetouching.js');
var dataPromise = httpGET('http://localhost:8888/toetouching.js');

window.addEventListener('DOMContentLoaded', function() {
  dataPromise.then(renderPushups);
});

function renderPushups(pushups) {
  var contestants = [
    {
      name: 'andrey',
      total: 0,
      today: 0,
      el: document.querySelector('.contestant.a'),
    },
    {
      name: 'sergey',
      total: 0,
      today: 0,
      el: document.querySelector('.contestant.s'),
    },
    {
      name: 'timur',
      total: 0,
      today: 0,
      el: document.querySelector('.contestant.t'),
    },
  ];
  var progress = eval(pushups);
  for (var entry of progress)
    entry.date = new Date(entry.date);

  for (var entry of progress) {
    for (var contestant of contestants) {
      if (entry.date <= TODAY)
        contestant.total += entry[contestant.name];
      if (entry.date > YESTERDAY && entry.date <= TODAY)
        contestant.today = entry[contestant.name];
    }
  }

  var daysIn = 0;
  for (var date = START; date < TODAY && date < END; date = new Date(date.getTime() + MS_IN_DAY))
    ++daysIn;

  document.querySelector('.subtitle').textContent = `Day ${daysIn} of ${TOTAL_DAYS}`;

  for (var contestant of contestants) {
    contestant.el.querySelector('.progress-today .progress-label').textContent = `today: ${contestant.today}/${PUSHUPS_DAILY}`;
    contestant.el.querySelector('.progress-total .progress-label').textContent = `total: ${contestant.total}/${TOTAL_PUSHUPS}`;
  }

  requestAnimationFrame(function () {
    for (var contestant of contestants) {
      var progressToday = contestant.el.querySelector('.progress-today .progress-fill');
      progressToday.style.setProperty('width', Math.round(contestant.today * 100 / PUSHUPS_DAILY) + '%');
      var progressTotal = contestant.el.querySelector('.progress-total .progress-fill');
      progressTotal.style.setProperty('width', Math.round(contestant.total * 100 / TOTAL_PUSHUPS) + '%');
    }
    if (TODAY > END) {
      var congrats = document.querySelector('.congratulations-text');
      congrats.classList.add('animation');
    }
  });
}

function httpGET(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE)
        resolve(xhr.responseText);
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  });
}
