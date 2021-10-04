var city
var APIKey = 'fed67933791ff7a3c16fb39c61d918b3'
var lat
var lon
var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistoryArray')) || []

console.log(searchHistoryArray.length)
console.log(searchHistoryArray)

$("#search-field").keyup(function(event) {
    if (event.keyCode === 13) {
        city = $('#search-field').val()
        citySearch()
    }
});

$('#search-button').click(function() {
    city = $('#search-field').val()
    citySearch()
})

$('#search-history').click(function(event) {//why does this work regardless of if i type in 'event' as the function's parameter?
    city = $(event.target).text()//why am i getting warning "'event' is depreciated. ts(6385)"?
    citySearch()
})

$('#clear-button').click(function() {
    searchHistoryArray = [];
    localStorage.clear();
    $('#search-history').html('')
    $('#clear-button').css('visibility','hidden')
})

function init() {
    for (let i = 0; i < searchHistoryArray.length; i++) {
        var historyButton = document.createElement('button')
        historyButton.setAttribute('class','history-city col-12')
        $(historyButton).text(searchHistoryArray[i])
        $('#search-history').append(historyButton)
    }
    if (searchHistoryArray.length > 0) {
        $('#clear-button').css('visibility','visible')
    }
}

function citySearch() {
    console.log(city)
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey)
    .then(response => response.json())
    .then(data => {
        lat = data.coord.lat
        lon = data.coord.lon
        getData()
        addHistory()
        $('#search-field').val('')
    })
}

function getData() {
    console.log(lat + lon)
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        $('#data-city').text(city)
        $('#data-now-icon').attr('src','http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png')
        $('#data-now-icon').attr('alt',data.current.weather[0].description)
        $('#output').css('visibility','visible')
        $('#data-now').text('(' + moment().format('M/DD/YYYY') + ')')//TODO: add timezone data?
        $('#data-temp').text(data.current.temp + ' °F')
        $('#data-wind').text(data.current.wind_speed + ' MPH')
        $('#data-humidity').text(data.current.humidity + ' %')
        $('#data-uv-index').text(data.current.uvi)
        if (data.current.uvi > 10) {
            $('#data-uv-index').css('background','purple')
        } else if (data.current.uvi > 7) {
            $('#data-uv-index').css('background','red')
        } else if (data.current.uvi > 5) {
            $('#data-uv-index').css('background','orange')
        } else if (data.current.uvi > 2) {
            $('#data-uv-index').css('background','gold')
        } else {
            $('#data-uv-index').css('background','green')
        }
        $('#card-holder').html('')
        for (let i = 0; i < 5; i++) {
            var weatherCard = document.createElement('div');
            var weatherCardTitle = document.createElement('h5')
            var weatherCardIcon = document.createElement('img')
            var weatherCardData = document.createElement('p')
            weatherCard.setAttribute('class', 'weather-card card col')
            $(weatherCardTitle).text(moment().add(i + 1, 'days').format('M/DD/YYYY'))
            $(weatherCardIcon).attr('src','http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png')
            $(weatherCardData).html('Temp: ' + data.daily[i].temp.day + ' °F<br>Wind: ' + data.daily[i].wind_speed + ' MPH<br>Humidity: ' + data.daily[i].humidity + ' %')
            $('#card-holder').append(weatherCard);
            weatherCard.append(weatherCardTitle)
            weatherCard.append(weatherCardIcon)
            weatherCard.append(weatherCardData)
        }
    })
}

function addHistory() {
    if (!searchHistoryArray.includes(city)) {
        searchHistoryArray.push(city)//why am i getting warning "push does not exist on type 'string'. ts(2339)"?
        localStorage.setItem('searchHistoryArray',JSON.stringify(searchHistoryArray))
        console.log(searchHistoryArray)
        var historyButton = document.createElement('button')
        historyButton.setAttribute('class','history-city col-12')
        $(historyButton).text(city)
        $('#search-history').append(historyButton)
    }
    $('#clear-button').css('visibility','visible')
}

init()