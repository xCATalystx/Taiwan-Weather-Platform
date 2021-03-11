const countyData = [];

$.get("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535&format=JSON",
function(data){
  const countyInfo = data["records"].location;


  $.getJSON("twMapId.json", function(data2){
    const countyId = data2.map(item => Object.values(item)[1]);

    //整理縣市資料

    for (i = 0; i < countyInfo.length; i++) {
      const wxs = countyInfo[i].weatherElement;
      const weatherInfo = {
        county: countyInfo[i].locationName,
        wx: wxs[0].time[0].parameter.parameterName,
        wxV: wxs[0].time[0].parameter.parameterValue,
        pop: wxs[1].time[0].parameter.parameterName,
        minT: wxs[2].time[0].parameter.parameterName,
        maxT: wxs[4].time[0].parameter.parameterName,
        ci: wxs[3].time[0].parameter.parameterName,
        id: countyId[i],
        time: wxs[0].time[0].startTime,
      };
      
      countyData.push(weatherInfo);
    };
    

    //將值寫入weatherData和infoDate

    const weatherData = function(countyData){
      let htmlStr = "";
      let timeStr = "";

      for (idx in countyData) {
        const { county, wx, wxV, minT, maxT, pop, id, time } = countyData[idx];
        htmlStr += `
        <a href="javascript:void(0)" title="${county}：${wx}" class="iconZone" name="${id}">
          <div>
            <span class="city">${county}</span>
            <span>${wx}</span>
            <span><i class="fas fa-temperature-low"></i> ${minT}~${maxT}˚C</span>
            <span><i class="fas fa-umbrella"></i>${pop}<i>%</i></span>
          </div>
          <img src="images/weatherImg/${wxV}.svg" alt="${county}：${wx}" title="${county}：${wx}">
        </a>`;
              
        const date = time.split(' ');
        
        timeStr = `<p><i class="far fa-calendar-alt"></i> ${date[0]}</p>`;
      }
      $(".weatherData").empty();
      $(".weatherData").html(htmlStr);

      $(".infoDate").empty();
      $(".infoDate").html(timeStr);
    };
    weatherData(countyData);
  });
});


$('.weatherData').on('click', 'img', function(e){
  
  $(".hidden").removeClass("hidden");
  $(".show").removeClass("show");

  $(e.target).addClass("hidden");
  $(e.target).siblings("div").addClass("show");
});

$('.weatherData').on('click', 'div', function(e){

  $(".hidden").removeClass("hidden");
  $(".show").removeClass("show");
});