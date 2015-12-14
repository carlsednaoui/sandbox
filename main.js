console.log('sandbox is working!');

// data comes from https://app.mailcharts.com/explore?q=dHlwZT1jb21wYW5pZXMmY29tcGFueUlkPTEwNTImY29tcGFueUlkPTEwNTMmY29tcGFueUlkPTIzOCZjb21wYW55SWQ9OTkmY29tcGFueUlkPTE4NDgmc3RhcnREYXRlPTIwMTUtMTAtMDEmZW5kRGF0ZT0yMDE1LTExLTAx
$('#calendar').fullCalendar({
  
})

var colors = ['#1DCE6D', '#2C83D1', '#00D3C5', '#A864C1', '#D19675'];
var companyNames = [];

$.getJSON('/data/mc-data-for-calendar-report.json', function (data) {
  // Generate company list
  $.each(data, function(i, el) {
    if ($.inArray(el.companyName, companyNames) == -1) {
      companyNames.push(el.companyName);
    }
  });

  $.each(data, function(i, email) {
    $('#calendar').fullCalendar('renderEvent', {
      title: email.subject,
      start: moment(email.sentAt),
      color: colors[companyNames.indexOf(email.companyName)]
    }, true);
  })

});

// $('#calendar').fullCalendar('renderEvent', {title: email.subject, start: moment(email.sentAt)}, true);