window.onscroll = () => scrollFunction();

const scrollFunction = () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    $("#topBtn").toggle(true);
  } else {
    $("#topBtn").toggle(false);
  }
};

$("#topBtn").click(() => $("body,html").animate({scrollTop: 0},500));

$(".navbar-nav>li>a").on("click", () => $(".navbar-collapse").collapse("hide"));
