var city
var APIKey = 'fed67933791ff7a3c16fb39c61d918b3'
var weatherData
var now = moment().format('M/DD/YYYY');

$('#search-button').click(function() {
    city = $('#search-field').val().trim()
    weatherData = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey
    fetch(weatherData)
    .then(response => response.json())
    .then(data => console.log(data))
    
})