const countyInfo = [];
const taoyuanInfo = [];

$.get("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535&format=JSON",
function(data){
  const countyData = data["records"].location;
  console.log(countyData);


  $.getJSON("twMapId.json", function(data2){
    const countyId = data2.map(item => Object.values(item)[1]);
    const countyValue = data2.map(item => Object.values(item)[2]);

    //整理縣市資料

    for (i = 0; i < countyData.length; i++) {
      const wxs = countyData[i].weatherElement;
      const weatherData = {
        county: countyData[i].locationName,
        wx: wxs[0].time[0].parameter.parameterName,
        wxV: wxs[0].time[0].parameter.parameterValue,
        pop: wxs[1].time[0].parameter.parameterName,
        minT: wxs[2].time[0].parameter.parameterName,
        maxT: wxs[4].time[0].parameter.parameterName,
        ci: wxs[3].time[0].parameter.parameterName,
        id: countyId[i],
        value: countyValue[i],
        date: ((wxs[0].time[0].startTime).split(' ')[0]).split('-'),
      };
      
      countyInfo.push(weatherData);
    };

    // 把資料寫入weatherData和infoDate

    const weatherInfo = function(countyInfo){
      let htmlStr = "";
      let timeStr = "";

      for (idx in countyInfo) {
        const { county, wx, wxV, minT, maxT, pop, id, value, date } = countyInfo[idx];
        htmlStr += `
        <a href="javascript:void(0)" title="${county}：${wx}" class="iconZone" name="${id}" value="${value}">
          <div>
            <span class="city">${county}</span>
            <span>${wx}</span>
            <span><i class="fas fa-temperature-low"></i> ${minT}~${maxT}˚C</span>
            <span><i class="fas fa-umbrella"></i>${pop}<i>%</i></span>
          </div>
          <img src="images/weatherImg/${wxV}.svg" alt="${county}：${wx}" title="${county}：${wx}">
        </a>`;
        
        timeStr = `<p><i class="far fa-calendar-alt"></i> ${date}</p>`;
      }
      $(".weatherData").empty();
      $(".weatherData").html(htmlStr);

      $(".infoDate").empty();
      $(".infoDate").html(timeStr);
    };
    weatherInfo(countyInfo);

    // 把資料寫入countyWxPage
    const countyWeather = function(countyInfo, countyValue){
      let wxPageStr = "";

      for (idx in countyInfo) {
        const { county, wx, wxV, minT, maxT, pop, ci, date } = countyInfo[countyValue];

        wxPageStr = `
          <div class="wxPage1">
            <div class="wxPageLocation">
              <span><i class="fas fa-map-marker-alt"></i> ${county}</span>
            </div>
            <div class="wxPageImg">
              <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
            </div>
          </div>
          <div class="wxPage2">
            <div>
              <span> ${date[1]}/${date[2]}</span>
            </div>
            <div>
              <li><span>${wx}</span></li>
              <li><span><i class="fas fa-temperature-low"></i> ${minT} ~ ${maxT}</span><i>˚C</i></li>
              <li><span><i class="fas fa-umbrella"></i> ${pop}</span><i>%</i></li>
              <li><span>${ci}</span></li>
            </div>
          </div>`;
      };
      $(".countyWxPage").empty();
      $(".countyWxPage").html(wxPageStr);
    };

    $("#countySelectBar").on("change", function(){
      const countyValue = $(this).val();
      countyWeather(countyInfo, countyValue);
    });
    $('.weatherData').on('click', 'img', function(e){
      const countyValue = $(e.target).parent('a').attr('value');
      countyWeather(countyInfo, countyValue);
    });
    $('.twMap a').on('click', function(e){
      const countyValue = $(e.target).parent('g').attr('name');
      countyWeather(countyInfo, countyValue);
    });

    // 預設氣象(桃園市)

    const taoyuanData = {
      county: countyData[13].locationName,
        wx: countyData[13].weatherElement[0].time[0].parameter.parameterName,
        wxV: countyData[13].weatherElement[0].time[0].parameter.parameterValue,
        pop: countyData[13].weatherElement[1].time[0].parameter.parameterName,
        minT: countyData[13].weatherElement[2].time[0].parameter.parameterName,
        maxT: countyData[13].weatherElement[4].time[0].parameter.parameterName,
        ci: countyData[13].weatherElement[3].time[0].parameter.parameterName,
        date: ((countyData[13].weatherElement[0].time[0].startTime).split(' ')[0]).split('-'),
    };
    taoyuanInfo.push(taoyuanData);
    
    const taoyuanWeather = function(taoyuanInfo){
      let taoyuanStr = "";

      for (idx in taoyuanInfo) {
        const { county, wx, wxV, minT, maxT, pop, ci, date } = taoyuanInfo[idx];

        taoyuanStr = `
        <div class="wxPage1">
            <div class="wxPageLocation">
              <span><i class="fas fa-map-marker-alt"></i> ${county}</span>
            </div>
            <div class="wxPageImg">
              <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
            </div>
          </div>
          <div class="wxPage2">
            <div>
              <span> ${date[1]}/${date[2]}</span>
            </div>
            <div>
              <li><span>${wx}</span></li>
              <li><span><i class="fas fa-temperature-low"></i> ${minT} ~ ${maxT}</span><i>˚C</i></li>
              <li><span><i class="fas fa-umbrella"></i> ${pop}</span><i>%</i></li>
              <li><span>${ci}</span></li>
            </div>
          </div>`;
      };
      $(".countyWxPage").empty();
      $(".countyWxPage").html(taoyuanStr);
    };
    taoyuanWeather(taoyuanInfo);
  });
});

// click氣象小圖顯示氣象資訊
$('.weatherData').on('click', 'img', function(e){
  const id = $(e.target).parent('a').attr('name');
  
  $(".hidden").removeClass("hidden");
  $(".show").removeClass("show");
  $(".click").removeClass("click");
  

  $(e.target).addClass("hidden");
  $(e.target).siblings("div").addClass("show");
  $(`#${id}`).parent("a").addClass("click");

  if (window.matchMedia('(min-width: 1011px)').matches){
    $(".countyWeather").hide();
    $(".countyWeather").fadeIn("quick");
  } else {
    return;
  }
  
});

// click地圖顯示氣象資訊
$('.twMap a').on('click', function(e){
  
  const id = $(e.target).parent('g').attr('id');

  $(".hidden").removeClass("hidden");
  $(".show").removeClass("show");

  $(`.iconZone[name=${id}] img`).addClass("hidden");
  $(`.iconZone[name=${id}] div`).addClass("show");

  $(".click").removeClass("click");
  $(e.target).parents("a").addClass("click");

  if (window.matchMedia('(min-width: 1011px)').matches){
    $(".countyWeather").hide();
    $(".countyWeather").fadeIn("quick");
  } else {
    return;
  }
});

// click氣象資訊換回氣象小圖
$('.weatherData').on('click', 'div', function(e){

  $(".hidden").removeClass("hidden");
  $(".show").removeClass("show");
  $(".click").removeClass("click");
});