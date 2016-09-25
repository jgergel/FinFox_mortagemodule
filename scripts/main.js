var purchaseType = ""
// disabling button transition style on click
$('button').click(function() {
  this.style.transition = 'none'
});

// landing page button animate
$('.landing-page__button').click(function() {
  $(this).hide('easeInOutCubic');
  $('.landing-page__form').fadeIn();
});

// user info flow
$('.info__button--inactive').click(function(event) {
  $('.info__button--inactive').hide();
  const infoDynamicTitle = document.createElement('h3');

  infoDynamicTitle.innerText = 'How much is your purchase' + '?';
  $('.info__title').hide();
  $('#info').prepend(infoDynamicTitle);

  $('.info-dollar-sign').css('display', 'inline').fadeIn();
  $('.info__input').css('display', 'inline').fadeIn();
  $('.info__button-submit').fadeIn();
});

$('.suggestions__footer-link').click(function() {
  $("html, body").animate(
    { scrollTop: "800px" },
    800
  );
});


  $('#landing-page').hide();
  $('#info').show();
  $('.info__button-submit').click(function(e) {
    e.preventDefault();
    var amtBorrowed = $('.info__input').val();
    var data = {
      purchaseType: purchaseType,
      amtBorrowed: amtBorrowed,
      userSession : "08062013_0:ad6208ecc36590c456d594fbd7bbcd01a51dd451078f4653d126781425478ee158000832dab72b10e4e0eeb3e75c9089f5f476ea82576202409b7fd7a39ed674"
    };

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'https://risehackathon-barclays.herokuapp.com/api/mortageSolutions',
        dataType : 'json',
        data: JSON.stringify(data),
        success : function(result) {
          _res = result
          result = result.response
          if (Array.isArray(result))
            console.log(result)
          else
            console.log(result)

          $('#info').hide();
          $('#suggestions').show();
          $('#charts').show();


          var ctx = document.getElementById("pieChart")
          var data = {
            labels: [
                "credit",
                "debit",
            ],
            datasets: [
                {
                    data: [_res.credit,_res.debit],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                    ]
                }]
          };
          var myChart = new Chart(ctx, {
              type: 'pie',
              data: data,
              options: {

              }
          });



          $('#income').text('$' + _res.credit);
          $('#expenses').text('$' + _res.debit);
          $('#net-income').text('$' + (_res.credit - _res.debit));
          if (Array.isArray(result)) {
            var suggestionsContent = document.querySelectorAll('.suggestions__list__dynamic-content');
            result.forEach(function(content, i) {
              suggestionsContent[i].innerText += content;
            });
            console.log(window.name)
            $('.customer-name').text("smit thakkar");
          }
          else {
            $('.suggestions__list').append('<li>'+ result+'</li>')
          }

        },
        error: function(result) {
           console.log(result);
        }
    });
  })
  $('.info__button').click(function(e) {
      e.preventDefault();
       purchaseType = $(this).text()
  })
