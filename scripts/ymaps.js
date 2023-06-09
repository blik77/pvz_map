var points=[];
var map;

ymaps.ready(initYMaps);
function initYMaps(){
    map=new ymaps.Map("map", {
        center: [55.708562,37.653768], // координаты центра карты, при загрузке
        zoom: 7,  // коэффициент масштабирования
        // элементы управления картой, список элементов можно посмотреть на этой странице
        // https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/controls-docpage/
        controls: [ 'zoomControl' ]
    });
}

function drawPoints(){
    map.geoObjects.removeAll();
    if(points.length<1){ alert("Нет данных для отображения!"); return false; }
    points.forEach(function(item,i,arr){ map.geoObjects.add(buildPlacemark(item)); });
    console.log("draw "+points.length+" points");
    points=[];
}
function drawPointsGroup(minPoint,name,flagOnly){
    var tempAr=[];
    var count=0;
    points.forEach(function(item,i,arr){
        var latitude=(item.coordinates[0]+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var longitude=(item.coordinates[1]+"").replace(/(\d{2,3})\.(\d{4}).*/g, '$1_$2');
        var keyOfCoord="coord-"+latitude+"-"+longitude;
        if(!!tempAr[keyOfCoord]){
            if(tempAr[keyOfCoord].name.indexOf(item.service)===-1){
                tempAr[keyOfCoord].name+=(', '+item.service);
                tempAr[keyOfCoord].desc+=(',<br> '+item.service+": "+item.name);
                tempAr[keyOfCoord].addressName+=('<hr>'+item.addressName);
                tempAr[keyOfCoord].count++;
            } else {
                tempAr[keyOfCoord+"-"+count]={
                    'coordinates': item.coordinates,
                    'name': item.service,
                    'desc': item.name,
                    'addressName': item.addressName,
                    'count': 1
                };
                count++;
            }
        } else {
            tempAr[keyOfCoord]={
                'coordinates': item.coordinates,
                'name': item.service,
                'desc': item.name,
                'addressName': item.addressName,
                'count': 1
            };
            count++;
        }
    });
    points=[];
    for(var key in tempAr) {
        if((tempAr[key].count>=minPoint && !flagOnly) || (tempAr[key].count===minPoint && flagOnly)){
            points.push({
                'coordinates': tempAr[key].coordinates,
                'name': '<div style="font-size: 12px;">'+tempAr[key].name+'</div>',
                'desc': '<div style="font-size: 12px;">'+tempAr[key].desc+'</div>',
                'addressName': '<div style="font-size: 12px;">'+tempAr[key].addressName+'</div>',
                'count': tempAr[key].count
            });
        }
    }
    mainPanel.updateMapTitle(name,points.length);
    drawPoints();
}
function buildPlacemark(pointData){
    var iconContent="";
    var preset={};
    var colorIcon="redIcon";
    if(!!pointData.color){ colorIcon=pointData.color; }
    if(!!pointData.count){
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
    }
    if(pointData.desc.toUpperCase().indexOf("ПОСТАМ")>=0 || pointData.name.indexOf("PickPoint")>=0){ colorIcon="blackIcon"; }
    preset={ preset: 'islands#'+colorIcon };
    return new ymaps.Placemark(pointData.coordinates, {
        // всплывающая подсказка (выводим адрес объекта)
        hintContent: pointData.name,
        iconContent: iconContent,
        // Содержимое балуна
        balloonContent: '<strong>'+pointData.name+'</strong><br/>'+pointData.desc+'<br/><i>'+pointData.addressName+'</i>'
    }, preset);
}

function requestSyncYMap(){
    getCoordsForYSync();
}
function syncYMap(i,maxCount,coordAr){
    if(i===0 && maxCount===0){ maxCount=coordAr.length; }
    mainPanel.updateTitleSyncYMap(i,maxCount);
    if(i<maxCount){
        var address=coordAr[i].address;
        if(coordAr[i].realname!=="" && coordAr[i].realname!=="na"){ address=coordAr[i].realname; }
        var params={ format: 'json', geocode: address, results: 1 };
        if(coordAr[i].coord!=="0,0"){ params.ll=coordAr[i].coord; }
        
        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: "https://geocode-maps.yandex.ru/1.x/",
            method: 'GET',
            params: params,
            success: function(response){
                var ans=JSON.parse(response.responseText);
                var realname='na',realcoordLatX=0,realcoordLongY=0,realCoords=[0,0];
                if(ans.response.GeoObjectCollection.featureMember.length>0){
                    if(!!ans.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text){
                        realname=ans.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
                    }
                    if(!!ans.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos){
                        realCoords=ans.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
                        realcoordLatX=realCoords[1];
                        realcoordLongY=realCoords[0];
                    }
                }
                if(realcoordLatX!==0 && realcoordLongY!==0){
                    var query="UPDATE coordinates SET realname='"+realname+"',realcoordLatX='"+realcoordLatX+"',realcoordLongY='"+realcoordLongY+"'"+
" WHERE service='"+coordAr[i].service+"' AND name='"+coordAr[i].name.replace(/'/igm,"''")+"' AND address='"+coordAr[i].address.replace(/'/igm,"''")+"'";
console.log(query);
                    db.transaction(function(tx){ tx.executeSql(query); });
                }
                syncYMap(i+1,maxCount,coordAr);
            },
            failure: function(response){ syncYMap(i+1,maxCount,coordAr); }
        });
    }
}