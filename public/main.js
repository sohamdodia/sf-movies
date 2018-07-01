let locations = [];
let markersArray = [];
$("#search").on('change keyup paste', function () {
    let value = $('#search').val();
    if(value.length > 2) {
        $.ajax({
            type: "GET",
            url: "/autocomplete?term=" + value,
            success: function(data){
                if (data.length > 0) {
                    clearOverlays(markersArray);
                    let text = '<p>Click on a movie to get information.</p>';
                    text += "<ul id='titles'>";
                    for (let i = 0; i < data.length; i++) {
                        text += "<li class='title'>" + data[i].title + "</li>";
                    }
                    text += "</ul>";
                    $("#movies").html(text);
                }
            },
            error: function(error) {
                console.log('error', error);
                alert('Something went wrong');
            }
        });
    }
});

$(document).on("click", ".title", function(){ 
    let title = $(this).text();
    clearOverlays(markersArray);
    $.ajax({
        type: "GET",
        url: "/search?title=" + title,
        success: function(data) {
            locations.length = 0;
            for (let i = 0; i < data.length; i++) {
                let tempArr = [];
                tempArr.push(data[i].title);
                tempArr.push(data[i].lat);
                tempArr.push(data[i].lng);
                tempArr.push(i);
                locations.push(tempArr);
            }
          
            let infowindow = new google.maps.InfoWindow();
        
            let marker, i;
          
            for (let i = 0; i < locations.length; i++) {  
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                  map: map
                });
                let html ="<div>" + "<h3>"+ data[i].title + "</h3>";
                if (data[i].locations) {
                    html += "<p>Location:" + data[i].locations +"</p>";
                }
                html += "<p>Actors:" + data[i].actor1 + "," + data[i].actor2 + "," + data[i].actor3 +"</p>";
                if (data[i].funFacts) {
                    html += "<p>Fun facts: "+ data[i].funFacts +"</p>";
                }
                if (data[i].productionCompany) {
                    html += "<p>Production Company: " + data[i].productionCompany +"</p>";
                }
                if (data[i].releaseYear) {
                    html += "<p>Year: "+ data[i].releaseYear + "</p>";
                }
                html += "<\/div>";
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    markersArray.push(marker);
                    return function() {
                        infowindow.setContent(html);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        },
        error: function(error) {
            console.log('error', error);
            alert('Something went wrong!');
        }
    });
});

function clearOverlays(markersArray) {
    for (let i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}