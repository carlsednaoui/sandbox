console.log('sandbox is working!');

// data comes from https://app.mailcharts.com/explore?q=dHlwZT1jb21wYW5pZXMmY29tcGFueUlkPTEwNTImY29tcGFueUlkPTEwNTMmY29tcGFueUlkPTIzOCZjb21wYW55SWQ9OTkmY29tcGFueUlkPTE4NDgmc3RhcnREYXRlPTIwMTUtMTAtMDEmZW5kRGF0ZT0yMDE1LTExLTAx
$('#calendar').fullCalendar({
  eventClick: function(event) {
    if (event.url) {
      window.open(event.url);
      return false;
    }
  },
  displayEventTime: false,
  header: {
    right:  'month, agendaWeek, agendaDay, prev,next'
  },
  firstDay: 1
});

var colors = ['#1DCE6D', '#2C83D1', '#00D3C5', '#A864C1', '#D19675'];
var companyNames = [];
var startDate;

$.getJSON('/data/mc-data-for-calendar-report.json', function (data) {
  // Generate company list
  $.each(data, function(i, el) {
    if ($.inArray(el.companyName, companyNames) == -1) {
      companyNames.push(el.companyName);
    }
  });

  $.each(data, function(i, email) {
    $('#calendar').fullCalendar('renderEvent', {
      title: email.subject + ' - ' + email.companyName,
      start: moment(email.sentAt),
      end: moment(email.sentAt).add('30', 'minutes'),
      url: 'http://www.mailcharts.com/emails?guid=' + email.guid,
      color: colors[companyNames.indexOf(email.companyName)]
    }, true);
  });

});

// TODO: Get this to work
// $('#calendar').fullCalendar({
//   defaultDate: startDate
// });

// $('#calendar').fullCalendar('renderEvent', {title: email.subject, start: moment(email.sentAt)}, true);