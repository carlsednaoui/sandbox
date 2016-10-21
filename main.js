console.log('sandbox is working!');

var PLAN_MAPPER = {
  1: {
    id_month: 1,
    id_year: 2,
    price_month: '$29',
    price_year: '$149'
  },
  2: {
    id_month: 3,
    id_year: 4,
    price_month: '$99',
    price_year: '$499'
  },
  3: {
    id_month: 5,
    id_year: 6,
    price_month: '$499',
    price_year: '$2,499'
  }
}

$('.switch-input').change(function() {
  if($(this).is(':checked')){
      $('.price-container').each(function(i, el) {
        var subIndex = $(this).data('subscription-index');
        $(this).find('.price').first().text(PLAN_MAPPER[subIndex].price_month);
        $(this).find('.duration').first().text('month');

        var signup_url = 'https://app.mailcharts.com/signup?plan=' + PLAN_MAPPER[subIndex].id_month;
        $(this).find('a').first().attr('href', signup_url);
      });
    } else {
      $('.price-container').each(function(i, el) {
        var subIndex = $(this).data('subscription-index');
        $(this).find('.price').first().text(PLAN_MAPPER[subIndex].price_year);
        $(this).find('.duration').first().text('year');

        var signup_url = 'https://app.mailcharts.com/signup?plan=' + PLAN_MAPPER[subIndex].id_year;
        $(this).find('a').first().attr('href', signup_url);
      });
    }
})