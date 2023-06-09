var points=[];
var map;
ymaps.ready(init);

function selCoords(){
    map.geoObjects.removeAll();
    points=[];
    switch(document.getElementById("selCoords").value){
        case '1': drawCoords1(true); break;
        case '2': drawCoords2(true); break;
        case '3': drawCoords3(true); break;
        case '4': drawCoords4(true); break;
        case '5': drawCoords5(true); break;
        case '6': drawCoords6(true); break;
        case '7': drawCoords7(true); break;
        default: break;
    }
}
function drawCoords1(forDraw){
    coords1.parcelshops.forEach(function(item,i,arr){
        item.forEach(function(item2,i2,arr2){
            points.push({
                'coordinates': [item2.Latitude,item2.Longitude],
                'name': item2.Name,
                'desc': item2.WorkingTime,
                'addressName': item2.Address.City.RegionAreaName+", "+item2.Address.City.CityAbbr+"."+item2.Address.City.Name+", "+item2.Address.ShortAddress,
                'service': 'Hermes'
            });
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords2(forDraw){
    coords2.features.forEach(function(item,i,arr){
        points.push({
            'coordinates': [item.geometry.coordinates[0],item.geometry.coordinates[1]],
            'name': item.properties.office_name,
            'desc': item.properties.balloonContentHeader,
            'addressName': item.properties.address,
            'service': 'Boxberry'
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords3(forDraw){
    coords3.points.forEach(function(item,i,arr){
        points.push({
            'coordinates': [item.Latitude,item.Longitude],
            'name': item.Name,
            'desc': item.OutDescription,
            'addressName': item.PostCode+", "+item.CountryName+", "+item.Region+", "+item.CitiName+", "+item.Address,
            'service': 'PickPoint'
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords4(forDraw){
    coords4.points.forEach(function(item,i,arr){
        points.push({
            'coordinates': item.coord,
            'name': item.name,
            'desc': item.operationTime,
            'addressName': item.address,
            'service': 'OZON'
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords5(forDraw){
    coords5.Points.forEach(function(item,i,arr){
        points.push({
            'coordinates': [item.Latitude,item.Longitude],
            'name': item.NamePoint,
            'desc': item.PoinType,
            'addressName': item.Address,
            'service': 'DPD'
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords6(forDraw){
    coords6.Points.forEach(function(item,i,arr){
        points.push({
            'coordinates': [item.latitude,item.longitude],
            'name': item.name,
            'desc': item.in_description,
            'addressName': item.city+", "+item.address,
            'service': 'SPSR'
        });
    });
    if(forDraw){ drawPoints(); }
}
function drawCoords7(forDraw){
    for(var key in coords7){
        coords7[key].markers.forEach(function(item,i,arr){
            points.push({
                'coordinates': [item.position[1],item.position[0]],
                'name': item.name.ru,
                'desc': item.name.ru,
                'addressName': key+", "+item.shortaddress.ru,
                'service': 'IML'
            });
        });
    }
    if(forDraw){ drawPoints(); }
}
function drawPoints(){
    if(points.length<1){
        alert("Нет данных для отображения!");
        return false;
    }
    points.forEach(function(item,i,arr){ map.geoObjects.add(buildPlacemark(item)); });
    console.log("draw "+points.length+" points");
}
function drawCompCoord(){
    var minPoint=document.getElementById("selMinPoint").value;
    map.geoObjects.removeAll();
    points=[];
    drawCoords1(false);
    drawCoords2(false);
    drawCoords3(false);
    drawCoords4(false);
    drawCoords5(false);
    drawCoords6(false);
    drawCoords7(false);
    var tempAr=[];
    var count=0;
    points.forEach(function(item,i,arr){
        var latitude=(item.coordinates[0]+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var longitude=(item.coordinates[1]+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var keyOfCoord="coord-"+latitude+"-"+longitude;
        if(!!tempAr[keyOfCoord]){
            if(tempAr[keyOfCoord].name.indexOf(item.service)===-1){
                tempAr[keyOfCoord].name+=(', '+item.service);
                tempAr[keyOfCoord].desc+=(', '+item.name);
                tempAr[keyOfCoord].addressName+=('<hr>'+item.addressName);
                tempAr[keyOfCoord].count++;
            } else {
                tempAr[keyOfCoord+"-"+count]={
                    'coordinates': item.coordinates,
                    'name': item.service,
                    'desc': item.name, //item.desc,
                    'addressName': item.addressName,
                    'count': 1
                };
                count++;
            }
        } else {
            tempAr[keyOfCoord]={
                'coordinates': item.coordinates,
                'name': item.service,
                'desc': item.name, //item.desc,
                'addressName': item.addressName,
                'count': 1
            };
            count++;
        }
        //map.geoObjects.add(buildPlacemark(item));
    });
    points=[];
    for(var key in tempAr) {
        if(tempAr[key].count>=minPoint){
            points.push({
                'coordinates': tempAr[key].coordinates,
                'name': tempAr[key].name,
                'desc': tempAr[key].desc,
                'addressName': tempAr[key].addressName,
                'count': tempAr[key].count
            });
        }
    }
    drawPoints();
}
function drawCompText(){
    var minPoint=document.getElementById("selMinPoint").value;
    map.geoObjects.removeAll();
    points=[];
    
    var tempAr=[];
    var count=0;
    updateCoords.forEach(function(item,i,arr){
        var latitude=item.coord[0];
        var longitude=item.coord[1];
        var address=item.address;
        if(!!item.realCoords){
            latitude=item.realCoords[0];
            longitude=item.realCoords[1];
        }
        if(!!item.realName){ address=item.realName; }
        var latitudeText=(latitude+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var longitudeText=(longitude+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var keyOfCoord="coord-"+latitudeText+"-"+longitudeText;
        
        if(!!tempAr[keyOfCoord]){
            if(tempAr[keyOfCoord].name.indexOf(item.service)===-1){
                tempAr[keyOfCoord].name+=(', '+item.service);
                tempAr[keyOfCoord].desc+=(',<br> '+item.service+": "+item.name);
                tempAr[keyOfCoord].addressName+=('<hr>'+address);
                tempAr[keyOfCoord].count++;
            } else {
                tempAr[keyOfCoord+"-"+count]={
                    'coordinates': [latitude,longitude],
                    'name': item.service,
                    'desc': item.service+": "+item.name,
                    'addressName': address,
                    'count': 1
                };
                count++;
            }
        } else {
            tempAr[keyOfCoord]={
                'coordinates': [latitude,longitude],
                'name': item.service,
                'desc': item.service+": "+item.name,
                'addressName': address,
                'count': 1
            };
            count++;
        }
    });
    for(var key in tempAr) {
        if(tempAr[key].count>=minPoint){
            points.push({
                'coordinates': tempAr[key].coordinates,
                'name': '<div style="font-size: 12px;">'+tempAr[key].name+'</div>',
                'desc': '<div style="font-size: 12px;">'+tempAr[key].desc+'</div>',
                'addressName': '<div style="font-size: 12px;">'+tempAr[key].addressName+'</div>',
                'count': tempAr[key].count
            });
        }
    }
    drawPoints();
}
function buildPlacemark(pointData){
    var iconContent="";
    var preset={};
    if(!!pointData.count){
        var colorIcon="redIcon";
        iconContent=pointData.count;
        switch(pointData.count){
            case 1: colorIcon="blueIcon"; break;
            case 2: colorIcon="darkOrangeIcon"; break;
            case 3: colorIcon="nightIcon"; break;
            case 4: colorIcon="darkBlueIcon"; break;
            case 5: colorIcon="pinkIcon"; break;
            case 6: colorIcon="grayIcon"; break;
            case 7: colorIcon="brownIcon"; break;
            case 8: colorIcon="darkGreenIcon"; break;
            case 9: colorIcon="violetIcon"; break;
            case 10: colorIcon="blackIcon"; break;
            case 11: colorIcon="yellowIcon"; break;
            case 12: colorIcon="greenIcon"; break;
            case 13: colorIcon="orangeIcon"; break;
            case 14: colorIcon="lightBlueIcon"; break;
            case 15: colorIcon="oliveIcon"; break;
            default: break;
        }
        preset={ preset: 'islands#'+colorIcon };
    }
	if(pointData.desc.toUpperCase().indexOf("ПОСТАМ") >=0 || pointData.name.indexOf("PickPoint") >= 0){
		colorIcon="blackIcon";
		preset={ preset: 'islands#'+colorIcon };
	}
    return new ymaps.Placemark(pointData.coordinates, {
        // всплывающая подсказка (выводим адрес объекта)
        hintContent: pointData.name,
        iconContent: iconContent,
        // Содержимое балуна
        balloonContent: '<strong>'+pointData.name+'</strong><br/>'+pointData.desc+'<br/><i>'+pointData.addressName+'</i>'
    }, preset);
}
function init(){
    map=new ymaps.Map("map", {
        center: [55.708562,37.653768], // координаты центра карты, при загрузке
        zoom: 7,  // коэффициент масштабирования
        // элементы управления картой, список элементов можно посмотреть на этой странице
        // https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/controls-docpage/
        controls: [ 'zoomControl' ]
    });
}

function test(){
    console.log(updateCoords.length);
    var countFalse=0;
    var countNA=0;
    updateCoords.forEach(function(item,i,arr){
        if(!!!item.realName){
            countFalse++;
        } else if(item.realName==="na"){
            countNA++;
        }
    });
    console.log(countFalse);
    console.log(countNA);
}

function test_old2(){
    console.log(comparedCoords.length);
    getRealData(0,comparedCoords.length);
}
function getRealData(i,maxCount){
    if(i>=maxCount){
        var text=JSON.stringify(comparedCoords);
        $.ajax({
            type: "POST",
            url: "work.php",
            data: {text: text},
            success: function(msg,status,xhr){ }
        });
    } else {
        $.ajax({
            type: "GET",
            url: "https://geocode-maps.yandex.ru/1.x/",
            data: {format: 'json', geocode: comparedCoords[i].address},
            success: function(msg,status,xhr){
                var ans=msg;
                var realName=false;
                var realCoords=false;
                if(ans.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found*1===1){
                    if(!!ans.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text){
                        realName=ans.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
                    }
                    if(!!ans.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos){
                        realCoords=ans.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
                        realCoords=[realCoords[1],realCoords[0]];
                    }
                }
                comparedCoords[i].realName=realName;
                comparedCoords[i].realCoords=realCoords;
                getRealData(i+1,maxCount);
            },
            error: function(){
                var realName="na";
                var realCoords="na";
                comparedCoords[i].realName=realName;
                comparedCoords[i].realCoords=realCoords;
                getRealData(i+1,maxCount);
            }
        });
    }
}
function test_old(){
    points=[];
    drawCoords1(false);
    drawCoords2(false);
    drawCoords3(false);
    drawCoords4(false);
    drawCoords5(false);
    drawCoords6(false);
    drawCoords7(false);
    var tempAr=[];
    points.forEach(function(item,i,arr){
        tempAr.push({
            service: item.service,
            coord: item.coordinates,
            name: item.name,
            address: item.addressName,
        });
    });
    var text=JSON.stringify(tempAr);
    $.ajax({
        type: "POST",
        url: "work.php",
        data: {text: text},
        success: function(msg,status,xhr){ }
    });
}