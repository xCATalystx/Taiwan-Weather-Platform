const townSelectData = [];
const townWeatherData = [];
const forecastData = [];

$('.searchBtn').on('click', function(){
    if (townWeatherData.length === 0){
        alert("請選擇縣市及鄉鎮！");
    };
});

$("#countySelect").on("change", function(){
    const countyValue = $(this).val();
    townSelectData.length = 0;
    townWeatherData.length = 0;
    
    
    $.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-${countyValue}?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535`,
    function(data){        
        const townInfo = data["records"].locations[0].location;
        
        //將鄉鎮資料寫入townSelect
        for (i = 0; i < townInfo.length; i++) {           
            const townSelectInfo = {
                i: i,
                town: townInfo[i].locationName,
            };
            
            townSelectData.push(townSelectInfo);            
        };

        const selectData = function(townSelectData){
            let selectStr = "";

            for (idx in townSelectData) {
                const {i, town} = townSelectData[idx];
                selectStr += `
                <option value="${i}">${town}</option>
                `;                    
            };
            
            $('#townSelect').html(`<option value disabled selected>選擇鄉鎮</option>`)
            $('#townSelect').append(selectStr);
        };
        selectData(townSelectData);

        //整理鄉鎮的氣象資料
        $('#townSelect').on('change', function(){
            const townValue = $(this).val();

            const wxs = townInfo[townValue].weatherElement;
            //console.log(wxs);

            //鄉鎮的當日氣象
            
            const townWeatherInfo = { 
                county: data["records"].locations[0].locationsName,
                town: townInfo[townValue].locationName,
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
            townWeatherData.length = 0;
            townWeatherData.push(townWeatherInfo);

            //鄉鎮的氣象預報
            forecastData.length = 0;
            for (i = 1; i < (wxs[0].time).length; i = i + 2){
                const forecastInfo = {
                    time: (wxs[0].time[i].startTime).split(' ')[0],
                    wx: wxs[6].time[i].elementValue[0].value,
                    wxV: wxs[6].time[i].elementValue[1].value,
                    pop: wxs[0].time[i].elementValue[0].value,
                    minT: wxs[8].time[i].elementValue[0].value,
                    maxT: wxs[12].time[i].elementValue[0].value,
                };
                forecastData.push(forecastInfo);
            };

            // 點擊搜尋鈕
            $('.searchBtn').unbind('click').on('click', function(){
                if (townWeatherData.length === 0){
                    alert("請選擇縣市及鄉鎮！");
                } else {
                    const weatherData = function(townWeatherData){
                        let wrapStr = "";
                        let textStr = "";
                        
                        
                        for (idx in townWeatherData) {
                            const {county, town, time, wx, wxV, pop, rh, minT, maxT, minAT, maxAT, uvi, uviV, wd, ws, ci} = townWeatherData[idx];
        
                            const date = time.split('-');
        
                            wrapStr = `
                            <div class="weatherImg">
                              <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                            </div>
                            <div class="location">
                                <span><i class="fas fa-map-marker-alt"></i>${county} ${town}</span>
                            </div>
                            <div class="weatherIcon">
                              <td class="date">
                                <span>${date[1]}/${date[2]}</span>
                              </td>
                              <button class="temperature">
                                <i class="fas fa-temperature-low"></i>
                                <span>${minT}~${maxT}˚C</span>
                              </button>
                              <button class="pop">
                                <i class="fas fa-umbrella"></i>
                                <span>${pop}<i>%</i></span>
                              </button>
                              <button class="wind">
                                <i class="fas fa-wind"></i>
                                <span>${wd}(風速${ws}級)</span>
                              </button>
                              <button class="uvi">
                                <i class="far fa-sun"></i>
                                <span>${uvi}</span>
                              </button>
                            </div>
                            <div class="ci">
                              <span>${ci}</span>
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
                    weatherData(townWeatherData);
        
                    const forecast = function(forecastData){
                        let forecastStr = "";
                                
                        for (idx in forecastData) {
                            const { time, wx, wxV, pop, minT, maxT } = forecastData[idx];
        
                            const date = time.split('-');
        
                            forecastStr += `
                            <div class="dayInfo">
                                <p>${date[1]}/${date[2]}</p>
                            </div>
                            <div class="dayWeather">
                                <div>
                                    <span>${wx}</span>
                                    <span><i class="fas fa-temperature-low"></i> ${minT}~${maxT}˚C</span>
                                    <span><i class="fas fa-umbrella"></i>${pop}<i>%</i></span>
                                </div>
                                <img src="images/weatherImg/${wxV}.svg" alt="${wx}">
                            </div>`;
                        };
                        $(".weekWeather").empty();
                        $(".weekWeather").html(forecastStr);                
                    };
                    forecast(forecastData);  
                };             
            });        
        });
    });
});