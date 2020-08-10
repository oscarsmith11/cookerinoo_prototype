function switchTrend(option) {
  console.log(option.value);
  switch (option.value) {
    case "favorites":
      window.location.href = "/explore/favorites";
      break;
    case "top":
      window.location.href = "/explore/top-trends";
      break;
    case "new":
      window.location.href = "/explore/new-trends";
      break;
  }
}

function redirectFilter(trendC) {
  const trend = trendC.querySelector('.keyword').innerHTML.trim();
  console.log(trend);
  window.location.href = "/filter/" + trend;
}
