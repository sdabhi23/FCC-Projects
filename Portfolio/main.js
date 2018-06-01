function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(23.016466, 72.471849),
        zoom: 10,
    }
    var map = new google.maps.Map(document.getElementById("contactMap"), mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(23.016466, 72.471849),
    });
    marker.setMap(map);
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}

$('#topBtn').click(function() {
    $('body,html').animate({
        scrollTop : 0
    }, 500);
});

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dots");
    if (n > x.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace("btn-danger", "btn-default");
    }
    x[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className = dots[slideIndex-1].className.replace("btn-default", "btn-danger");
}

$(function () {
    $('[data-toggle="popover"]').popover()
})