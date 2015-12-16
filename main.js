console.log('sandbox is working!');


// data comes from https://app.mailcharts.com/explore?q=dHlwZT1jb21wYW5pZXMmY29tcGFueUlkPTEwNTImY29tcGFueUlkPTEwNTMmY29tcGFueUlkPTIzOCZjb21wYW55SWQ9OTkmY29tcGFueUlkPTE4NDgmc3RhcnREYXRlPTIwMTUtMTAtMDEmZW5kRGF0ZT0yMDE1LTExLTAx


// initialize fullcalendar
$('#calendar').fullCalendar({
  // open email on click
  eventClick: function(event) {
    if (event.url) {
      window.open(event.url);
      return false;
    }
  },
  
  // clean up calendar view by removing the time of the email
  displayEventTime: false,

  // add navigation to the calendar
  header: {
    left: 'title',
    right: 'month,agendaWeek,agendaDay prev,next'
  },

  // start the week on Mondays
  firstDay: 1,

  // render a qtip tooltip on hover
  eventRender: function(event, element) {
    element.qtip({
      content: event.title,
      style: {
        classes: 'qtip-dark qtip-rounded custom-qtip-styles'
      },
      position: {
        target: 'mouse'
      }
    });

    // without qtip
    // element.attr('title', event.title);
  }
});


// define calendar variables
var colors = ['#1DCE6D', '#2C83D1', '#00D3C5', '#A864C1', '#D19675'];
var companyNames = [];
var startDate;
var companiesTable = [];

// get the data and generate the calendar events
$.getJSON('/data/mc-data-for-calendar-report.json', function (data) {
  
  $.each(data, function(i, el) {
    // generate company list
    if ($.inArray(el.companyName, companyNames) == -1) {
      companyNames.push(el.companyName);
    }

    // get the oldest start date
    // this is used to start the calendar on that date
    if (startDate == undefined) {
      startDate = el.sentAt;
    } else if (el.sentAt < startDate) {
      startDate = el.sentAt;
    }
  });

  $.each(data, function(i, email) {
    // generate all events
    // we should consider passing these in as an array directly from the munger
    // http://fullcalendar.io/docs/event_data/events_array/
    $('#calendar').fullCalendar('renderEvent', {
      title: email.subject + ' - ' + email.companyName + ' - Sent at: ' + moment(email.sentAt).format('h:mma'),
      start: moment(email.sentAt),
      end: moment(email.sentAt).add('30', 'minutes'),
      url: 'http://www.mailcharts.com/emails?guid=' + email.guid,
      color: colors[companyNames.indexOf(email.companyName)]
    }, true);
  });

  // initialize at the right date
  $('#calendar').fullCalendar('gotoDate', moment(startDate));
});


var dataStructureForTable = {
  headers: [
    'Week',
    'Day',
    'Company A'
    , 'Company B'
    , 'Company C'
  ]
  , data: [

  ]
};
