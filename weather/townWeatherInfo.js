const townSelectInfo = [];
const townWeatherInfo = [];
const forecastInfo = [];

$('.searchBtn').on('click', function(){
    if (townWeatherInfo.length === 0){
        alert("請選擇縣市及鄉鎮！");
    };
});

// 選擇縣市
$("#countySelect").on("change", function(){
    const countyValue = $(this).val();
    townSelectInfo.length = 0;
    townWeatherInfo.length = 0;
    
    // 依縣市索取鄉鎮的氣象資料
    $.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-${countyValue}?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535`,
    function(data){
        console.log(data);        
        const townData = data["records"].locations[0].location;
        
        //將鄉鎮地區寫入townSelect
        for (i = 0; i < townData.length; i++) {           
            const townSelectData = {
                i: i,
                town: townData[i].locationName,
            };
            
            townSelectInfo.push(townSelectData);            
        };

        const selectInfo = function(townSelectInfo){
            let selectStr = "";

            for (idx in townSelectInfo) {
                const {i, town} = townSelectInfo[idx];
                selectStr += `
                <option value="${i}">${town}</option>
                `;                    
            };
            
            $('#townSelect').html(`<option value disabled selected>選擇鄉鎮</option>`)
            $('#townSelect').append(selectStr);
        };
        selectInfo(townSelectInfo);

        //整理鄉鎮的氣象資料
        $('#townSelect').on('change', function(){
            const townValue = $(this).val();

            const wxs = townData[townValue].weatherElement;

            //鄉鎮的當日氣象            
            const townWeatherData = { 
                county: data["records"].locations[0].locationsName,
                town: townData[townValue].locationName,
                time: (wxs[0].time[0].startTime).split(' ')[0],
                wx: wxs[6].time[0].elementValue[0].value,
                wxV: wxs[6].time[0].elementValue[1].value,
                pop: wxs[0].time[0].elementValue[0].value,
                rh: wxs[2].time[0].elementValue[0].value,
                minT: wxs[8].time[0].elementValue[0].value,
                maxT: wxs[12].time[0].elementValue[0].value,
                minAT: wxs[11].time[0].elementValue[0].value,
                maxAT: wxs[5].time[0].elementValue[0].value,
                T: wxs[1].time[0].elementValue[0].value,
                uvi: wxs[9].time[0].elementValue[1].value,
                uviV: wxs[9].time[0].elementValue[0].value,
                wd: wxs[13].time[0].elementValue[0].value,
                ws: wxs[4].time[0].elementValue[1].value,
                ci: (wxs[10].time[0].elementValue[0].value).split('。')[3],
            };
            townWeatherInfo.length = 0;
            townWeatherInfo.push(townWeatherData);

            //鄉鎮的氣象預報
            forecastInfo.length = 0;
            for (i = 1; i < (wxs[0].time).length; i = i + 2){
                const forecastData = {
                    time: (wxs[0].time[i].startTime).split(' ')[0],
                    wx: wxs[6].time[i].elementValue[0].value,
                    wxV: wxs[6].time[i].elementValue[1].value,
                    pop: wxs[0].time[i].elementValue[0].value,
                    minT: wxs[8].time[i].elementValue[0].value,
                    maxT: wxs[12].time[i].elementValue[0].value,
                };
                forecastInfo.push(forecastData);
            };

            // 點擊搜尋鈕
            $('.searchBtn').unbind('click').on('click', function(){
                if (townWeatherInfo.length === 0){
                    alert("請選擇縣市及鄉鎮！");
                } else {
                    // 把資料寫入weatherWrap和weatherText
                    const weatherInfo = function(townWeatherInfo){
                        let wrapStr = "";
                        let textStr = "";
                        
                        
                        for (idx in townWeatherInfo) {
                            const {county, town, time, wx, wxV, pop, rh, minT, maxT, minAT, maxAT, uvi, uviV, wd, ws, ci} = townWeatherInfo[idx];
        
                            const date = time.split('-');
        
                            wrapStr = `
                            <div class="weatherImg">
                              <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                            </div>
                            <div class="location">
                                <span><i class="fas fa-map-marker-alt"></i> ${county} ${town}</span>
                            </div>
                            <div class="ci">
                              <span>${ci}</span>
                            </div>
                            <div class="weatherIcon">
                              <button class="temperature">
                                <i class="fas fa-temperature-low"></i>
                                <span>${minT}~${maxT}˚C</span>
                              </button>
                              <button class="pop">
                                <i class="fas fa-umbrella"></i>
                                <span>${pop}<i>%</i></span>
                              </button>
                              <button class="uvi">
                                <i class="far fa-sun"></i>
                                <span>${uvi}</span>
                              </button>
                              <button class="wind">
                                <i class="fas fa-wind"></i>
                                <span>${wd}</span>
                                <span>(風速${ws}級)</span>
                              </button>
                            </div>
                            `
        
                            textStr = `
                            <div class="currentDate">
                                <h1>${date[0]} / ${date[1]} / ${date[2]}</h1>
                            </div>
                            <div class="weatherText">
                                <ul>
                                    <li>天氣現象：<span>${wx}</span></li>
                                    <li>濕度：<span>${rh}</span><i>%</i></li>
                                    <li>降雨機率：<span>${pop}</span><i>%</i></li>
                                    <li>溫度：<span>${minT}～${maxT}</span><i>˚C</i></li>
                                    <li>體感溫度：<span>${minAT}～${maxAT}</span><i>˚C</i></li>
                                    <li>紫外線指數：<span>${uviV} (${uvi})</span></li>
                                    <li>風向：<span>${wd}(風速${ws}級)</span></li>
                                    <li>舒適度：<span>${ci}</span></li>
                                </ul>
                            </div>
                            `
                        }
                        $(".weatherWrap").empty();
                        $(".weatherWrap").html(wrapStr);
        
                        $(".weatherText").empty();
                        $(".weatherText").html(textStr);

                        $(".weather").hide();
                        $(".weather").fadeIn("quick");
                    };
                    weatherInfo(townWeatherInfo);
                    
                    // 把氣象預報寫入weekWeather
                    const forecast = function(forecastInfo){
                        let forecastStr = "";
                                
                        for (idx in forecastInfo) {
                            const { time, wx, wxV, pop, minT, maxT } = forecastInfo[idx];
        
                            const date = time.split('-');
        
                            forecastStr += `
                            <div class="dayWeather">
                                <div class="forecastInfo">
                                    <li class="forecastDate"><span> ${date[1]}/${date[2]}<span>
                                    <li><span>${wx}</span></li>
                                    <li><span><i class="fas fa-temperature-low"></i> ${minT}~${maxT}˚C</span></li>
                                    <li><span><i class="fas fa-umbrella"></i>${pop}<i>%</i></span></li>
                                </div>
                                <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                                <div class="timeInfo">
                                    <p>${date[1]}/${date[2]}</p>
                                </div>
                            </div>`;
                        };
                        $(".weekWeather").empty();
                        $(".weekWeather").html(forecastStr)

                        $(".weekWeather").hide();
                        $(".weekWeather").fadeIn("quick");
                    };
                    forecast(forecastInfo);  
                };             
            });        
        });
    });
});

// 預設氣象(新北市新莊區)

const xinzhuangWxInfo = [];
const xinzhuangForecast = [];

$.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-071?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535`,
    function(data){        
        const xinzhuangData = data["records"].locations[0].location[5];
        const wxs = xinzhuangData.weatherElement;
        // 新莊區當日氣象
        const xinzhuangWxData = { 
            county: data["records"].locations[0].locationsName,
            town: xinzhuangData.locationName,
            time: (wxs[0].time[0].startTime).split(' ')[0],
            wx: wxs[6].time[0].elementValue[0].value,
            wxV: wxs[6].time[0].elementValue[1].value,
            pop: wxs[0].time[0].elementValue[0].value,
            rh: wxs[2].time[0].elementValue[0].value,
            minT: wxs[8].time[0].elementValue[0].value,
            maxT: wxs[12].time[0].elementValue[0].value,
            minAT: wxs[11].time[0].elementValue[0].value,
            maxAT: wxs[5].time[0].elementValue[0].value,
            T: wxs[1].time[0].elementValue[0].value,
            uvi: wxs[9].time[0].elementValue[1].value,
            uviV: wxs[9].time[0].elementValue[0].value,
            wd: wxs[13].time[0].elementValue[0].value,
            ws: wxs[4].time[0].elementValue[1].value,
            ci: (wxs[10].time[0].elementValue[0].value).split('。')[3],
        };
        xinzhuangWxInfo.push(xinzhuangWxData);

        // 新莊區氣象預報
        for (i = 1; i < (wxs[0].time).length; i = i + 2){
            const forecastData = {
                time: (wxs[0].time[i].startTime).split(' ')[0],
                wx: wxs[6].time[i].elementValue[0].value,
                wxV: wxs[6].time[i].elementValue[1].value,
                pop: wxs[0].time[i].elementValue[0].value,
                minT: wxs[8].time[i].elementValue[0].value,
                maxT: wxs[12].time[i].elementValue[0].value,
            };
            xinzhuangForecast.push(forecastData);
        };

        // 把新莊氣象資料寫入weatherWrap和weatherText
        const weatherInfo = function(xinzhuangWxInfo){
            let wrapStr = "";
            let textStr = "";
            
            
            for (idx in xinzhuangWxInfo) {
                const {county, town, time, wx, wxV, pop, rh, minT, maxT, minAT, maxAT, uvi, uviV, wd, ws, ci} = xinzhuangWxInfo[idx];

                const date = time.split('-');

                wrapStr = `
                <div class="weatherImg">
                  <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                </div>
                <div class="location">
                    <span><i class="fas fa-map-marker-alt"></i> ${county} ${town}</span>
                </div>
                <div class="ci">
                  <span>${ci}</span>
                </div>
                <div class="weatherIcon">
                  <button class="temperature">
                    <i class="fas fa-temperature-low"></i>
                    <span>${minT}~${maxT}˚C</span>
                  </button>
                  <button class="pop">
                    <i class="fas fa-umbrella"></i>
                    <span>${pop}<i>%</i></span>
                  </button>
                  <button class="uvi">
                    <i class="far fa-sun"></i>
                    <span>${uvi}</span>
                  </button>
                  <button class="wind">
                    <i class="fas fa-wind"></i>
                    <span>${wd}</span>
                    <span>(風速${ws}級)</span>
                  </button>
                </div>
                `

                textStr = `
                <div class="currentDate">
                    <h1>${date[0]} / ${date[1]} / ${date[2]}</h1>
                </div>
                <div class="weatherText">
                    <ul>
                        <li>天氣現象：<span>${wx}</span></li>
                        <li>濕度：<span>${rh}</span><i>%</i></li>
                        <li>降雨機率：<span>${pop}</span><i>%</i></li>
                        <li>溫度：<span>${minT}～${maxT}</span><i>˚C</i></li>
                        <li>體感溫度：<span>${minAT}～${maxAT}</span><i>˚C</i></li>
                        <li>紫外線指數：<span>${uviV} (${uvi})</span></li>
                        <li>風向：<span>${wd}(風速${ws}級)</span></li>
                        <li>舒適度：<span>${ci}</span></li>
                    </ul>
                </div>
                `
            }
            $(".weatherWrap").empty();
            $(".weatherWrap").html(wrapStr);

            $(".weatherText").empty();
            $(".weatherText").html(textStr);
        };
        weatherInfo(xinzhuangWxInfo);
        
        // 把新莊氣象預報寫入weekWeather
        const forecast = function(xinzhuangForecast){
            let forecastStr = "";
                    
            for (idx in xinzhuangForecast) {
                const { time, wx, wxV, pop, minT, maxT } = xinzhuangForecast[idx];

                const date = time.split('-');

                forecastStr += `
                <div class="dayWeather">
                    <div class="forecastInfo">
                        <li class="forecastDate"><span> ${date[1]}/${date[2]}<span>
                        <li><span>${wx}</span></li>
                        <li><span><i class="fas fa-temperature-low"></i> ${minT}~${maxT}˚C</span></li>
                        <li><span><i class="fas fa-umbrella"></i>${pop}<i>%</i></span></li>
                    </div>
                    <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                    <div class="timeInfo">
                        <p>${date[1]}/${date[2]}</p>
                    </div>
                </div>`;
            };
            $(".weekWeather").empty();
            $(".weekWeather").html(forecastStr)

            $(".weekWeather").hide();
            $(".weekWeather").fadeIn("quick");
        };
        forecast(xinzhuangForecast);
    }
);

