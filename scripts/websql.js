var db,countAllItem=0,countTr=0,tempAr=[];
var companyArr=[
    {id: '0',name: 'Hermes',color: 'redIcon',url: 'https://pschooser.hermesrussia.ru/psChooserData/PsChooserView?BUId=1000&_=1536658110824'}
    ,{id: '1',name: 'Boxberry',color: 'blueIcon',url: 'https://boxberry.ru/find_an_office/ajax/list.php?country_id=643&city_id='}
    ,{id: '2',name: 'PickPoint',color: 'darkOrangeIcon',url: 'http://pickpoint.ru/postamats.xml'}
    ,{id: '3',name: 'ozon',color: 'nightIcon',url: 'https://www.ozon.ru/context/map/?areaid=2'}
    ,{id: '4',name: 'DPD',color: 'darkBlueIcon',url: 'https://www.dpd.ru/mktg/chooser/departmentsToExcel.do2'}
    ,{id: '5',name: 'SPSR',color: 'pinkIcon',url: 'https://www.spsr.ru/webapi/pickpoint?city='}
    ,{id: '6',name: 'IML',color: 'grayIcon',url: 'https://iml.ru/specials/c2c/Abakan'}
    ,{id: '7',name: 'DELLIN',color: 'brownIcon',url: 'https://www.dellin.ru/api/contacts.json'}
    ,{id: '8',name: 'PONY',color: 'darkGreenIcon',url: 'https://www.ponyexpress.ru/support/servisy-samoobsluzhivaniya/offices/'}
    ,{id: '9',name: 'KCE',color: 'violetIcon',url: 'http://www.cse.ru/sitecontent/city-mosrus/lang-rus/region-contacts/'}
    //,{id: '10',name: 'Dimex',color: 'blackIcon',url: 'http://www.dimex.ws/regiony-prisutstviya/moskva/'}
    ,{id: '11',name: 'Grastin',color: 'yellowIcon',url: 'https://grastin.ru/samovyvz/moscow.html'}
    ,{id: '12',name: 'GlavPunkt',color: 'greenIcon',url: 'http://glavpunkt.ru/punkts.json'}
    //,{id: '13',name: 'Aximus',color: 'orangeIcon',url: 'https://www.axiomus.ru/punkty_vidachi_zakaza.php'}
    ,{id: '14',name: 'shop logistics',color: 'lightBlueIcon',url: 'https://client-shop-logistics.ru/index.php?jsoncallback=jQuery17108890494456823643_1537725775015&route=calculate%2Fgeography%2Fget_map_data&code=1195780&_=1537725776749'}
    ,{id: '15',name: 'EX Mail',color: 'oliveIcon',url: 'https://exmail.ws/contacts/'}
 ];

function initWebSQL(){
    if(openDatabase!==undefined){
        db=openDatabase('pvz_map', '1.0', 'DB for coords pvz.',400*1024*1024);
        db.transaction(function(tx){
            tx.executeSql('DROP TABLE IF EXISTS company');
            tx.executeSql('CREATE TABLE IF NOT EXISTS company (id unique, name, color, url)');
            companyArr.forEach(function(el,i,arr){
                tx.executeSql("INSERT INTO company (id, name, color, url) VALUES ("+el.id+",'"+el.name+"','"+el.color+"','"+el.url+"')");
            });
            tx.executeSql("CREATE TABLE IF NOT EXISTS coordinates (service, coordLatX, coordLongY, name, desc, address, "+
"realname default 'na', realcoordLatX default 0, realcoordLongY default 0, checkupd default 0)");
            
            tx.executeSql('SELECT c.*,COUNT(co.coordLatX) cnt FROM company c LEFT OUTER JOIN coordinates co ON c.name=co.service GROUP BY c.name ORDER BY c.id',[],function(tx,results){
                var ans={company: [], group: []};
                for (var i=0;i<results.rows.length;i++){
                    ans.company.push({my_id: results.rows.item(i).id, name: results.rows.item(i).name, color: results.rows.item(i).color, url: results.rows.item(i).url, check: true, cnt: results.rows.item(i).cnt});
                }
                ans.group.push({my_id: "gr_1", name: "От 1 и более", color: "blueIcon", url: ""});
                ans.group.push({my_id: "gr_2", name: "От 2 и более", color: "darkOrangeIcon", url: ""});
                ans.group.push({my_id: "gr_3", name: "От 3 и более", color: "nightIcon", url: ""});
                ans.group.push({my_id: "gr_4", name: "От 4 и более", color: "darkBlueIcon", url: ""});
                ans.group.push({my_id: "gr_5", name: "От 5 и более", color: "pinkIcon", url: ""});
                ans.group.push({my_id: "gr_6", name: "От 6 и более", color: "grayIcon", url: ""});
                ans.group.push({my_id: "gr_7", name: "От 7 и более", color: "brownIcon", url: ""});
                ans.group.push({my_id: "gr_8", name: "От 8 и более", color: "darkGreenIcon", url: ""});
                ans.group.push({my_id: "gr_9", name: "От 9 и более", color: "blackIcon", url: ""});
                
                ans.group.push({my_id: "only_1", name: "Только где 1 пвз", color: "blueIcon", url: ""});
                ans.group.push({my_id: "only_2", name: "Только где 2 пвз", color: "darkOrangeIcon", url: ""});
                ans.group.push({my_id: "only_3", name: "Только где 3 пвз", color: "nightIcon", url: ""});
                ans.group.push({my_id: "only_4", name: "Только где 4 пвз", color: "darkBlueIcon", url: ""});
                ans.group.push({my_id: "only_5", name: "Только где 5 пвз", color: "pinkIcon", url: ""});
                ans.group.push({my_id: "only_6", name: "Только где 6 пвз", color: "grayIcon", url: ""});
                ans.group.push({my_id: "only_7", name: "Только где 7 пвз", color: "brownIcon", url: ""});
                ans.group.push({my_id: "only_8", name: "Только где 8 пвз", color: "darkGreenIcon", url: ""});
                ans.group.push({my_id: "only_9", name: "Только где 9 пвз", color: "blackIcon", url: ""});
                
                mainPanel.setCompany(ans);
                getCountAll();
            }, null);
        });
    } else { alert("Данный браузер или его версия не поддерживает работу с WebSQL!"); }
}
function dropDB(reload){
    Ext.Msg.show({
        title:'Сброс Базы Данных!',
        message: 'Вы действительно хотите удалить все данные из БД?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function(btn){
            if(btn==='yes'){
                db.transaction(function(tx){
                    tx.executeSql('DROP TABLE IF EXISTS company', [], function(tx,results){
                        tx.executeSql('DROP TABLE IF EXISTS coordinates', [], function(tx,results){
                            if(reload){ location.reload(); }
                        });
                    });
                });
            }
        }
    });
}
function getCoords(name){
    points=[];
    map.geoObjects.removeAll();
    var color="redIcon";
    companyArr.forEach(function(el,i,arr){ if(el.name===name){ color=el.color; } });
    getCountCompany(name,true);
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM coordinates WHERE service='"+name+"'", [], function(tx,results){
            for(var i=0;i<results.rows.length;i++){
                var coordinates=[results.rows.item(i).coordLatX,results.rows.item(i).coordLongY];
                var addressName=results.rows.item(i).address;
                if(results.rows.item(i).realcoordLatX!==0 && results.rows.item(i).realcoordLongY!==0){
                    coordinates=[results.rows.item(i).realcoordLatX,results.rows.item(i).realcoordLongY];
                }
                if(results.rows.item(i).realname!=="na"){
                    addressName=results.rows.item(i).realname;
                }
                points.push({
                    'coordinates': coordinates,
                    'name': results.rows.item(i).name,
                    'desc': results.rows.item(i).desc,
                    'addressName': addressName,
                    'service': results.rows.item(i).service,
                    'color': color
                });
            }
            drawPoints();
        }, null);
    });
}
function getCoordsForYSync(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM coordinates WHERE realcoordLatX=0 AND realcoordLongY=0", [], function(tx,results){
            var ans=[];
            for(var i=0;i<results.rows.length;i++){
                ans.push({
                    coord: results.rows.item(i).coordLongY+","+results.rows.item(i).coordLatX,
                    name: results.rows.item(i).name,
                    desc: results.rows.item(i).desc,
                    address: results.rows.item(i).address,
                    service: results.rows.item(i).service,
                    realname: results.rows.item(i).realname
                });
            }
            syncYMap(0,0,ans);
        }, null);
    });
}
function getCountAll(){
    db.transaction(function (tx) {
        tx.executeSql("SELECT count(*) cnt FROM coordinates", [], function (tx, results) {
            mainPanel.updateTitle(results.rows.item(0).cnt);
        }, null);
    });
}
function getCountCompany(name,print){
    db.transaction(function (tx) {
        tx.executeSql("SELECT count(*) cnt FROM coordinates WHERE service='"+name+"'", [], function (tx, results) {
            if(print){ mainPanel.updateMapTitle(name,results.rows.item(0).cnt); }
            else {  }
        }, null);
    });
}
function getCoordsGroup(my_id,name,arCompany){
    var minPoint=my_id.replace("gr_","")*1;
    var flagOnly=false;
    if(my_id.indexOf("only")!==-1){
        minPoint=my_id.replace("only_","")*1;
        flagOnly=true;
    }
    points=[];
    map.geoObjects.removeAll();
    
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM coordinates WHERE service in ("+arCompany+")", [], function(tx,results){
            for(var i=0;i<results.rows.length;i++){
                var coordinates=[results.rows.item(i).coordLatX,results.rows.item(i).coordLongY];
                var addressName=results.rows.item(i).address;
                if(results.rows.item(i).realcoordLatX!==0 && results.rows.item(i).realcoordLongY!==0){
                    coordinates=[results.rows.item(i).realcoordLatX,results.rows.item(i).realcoordLongY];
                }
                if(results.rows.item(i).realname!=="na"){
                    addressName=results.rows.item(i).realname;
                }
                points.push({
                    'coordinates': coordinates,
                    'name': results.rows.item(i).name,
                    'desc': results.rows.item(i).desc,
                    'addressName': addressName,
                    'service': results.rows.item(i).service,
                    'color': "redIcon"
                });
            }
            drawPointsGroup(minPoint,name,flagOnly);
        }, null);
    });
}

function FromDBToStr(){
    var coords=[];
    setMask(true,false,"Подождите, идет извлечение координат из БД.");
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM coordinates", [], function(tx,results){
            for(var i=0;i<results.rows.length;i++){
                var service=results.rows.item(i).service;
                var coordLatX=results.rows.item(i).coordLatX;
                var coordLongY=results.rows.item(i).coordLongY;
                var name=results.rows.item(i).name;
                var desc=results.rows.item(i).desc;
                var address=results.rows.item(i).address;
                var realname=results.rows.item(i).realname;
                var realcoordLatX=results.rows.item(i).realcoordLatX;
                var realcoordLongY=results.rows.item(i).realcoordLongY;
                
                coords.push({
                    service: service,
                    coordLatX: coordLatX,
                    coordLongY: coordLongY,
                    name: name,
                    desc: desc,
                    address: address,
                    realname: realname,
                    realcoordLatX: realcoordLatX,
                    realcoordLongY: realcoordLongY
                });
            }
            var ta=Ext.create('Ext.form.field.TextArea', {});
            var win=Ext.create('Ext.window.Window', {
                title: 'Скопируйте текст в файл и сохраните.',
                height: 600,
                width: 600,
                layout: 'fit',
                defaultFocus: ta,
                modal: true,
                items: [ta],
                buttons: [{
                    text: 'Закрыть',
                    handler: function(){ win.close(); }
                }]
            });
            ta.setValue(JSON.stringify(coords));
            win.show();
            setMask(false);
        }, null);
    });
}
function FromStrToDB(){
    var ta=Ext.create('Ext.form.field.TextArea', {});
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте сюда текст из файла с координатами и сохраните.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Сохранить',
            handler: function(){
                Ext.Msg.show({
                    title:'Восстановление Базы Данных!',
                    message: 'Все существующие данные будут удалены из БД?',
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    fn: function(btn){
                        if(btn==='yes'){
                            var coords=JSON.parse(ta.getValue().replace(/'/igm,"''"));
                            countAllItem=0;countTr=0;tempAr=[];
                            if(!!coords.length && coords.length>0){
                                countAllItem=coords.length;
                                db.transaction(function(tx){ tx.executeSql("DELETE FROM coordinates"); });
                                mainPanel.updateTitleFromStrToDB(0,countAllItem);
                                coords.forEach(function(el,i,arr){
                                    db.transaction(function(tx){
                                        if(countTr===0){ setMask(true,false,"Подождите, идет сохранение координат в БД."); }
                                        var query="INSERT INTO coordinates (service, coordLatX, coordLongY, name, desc, address, realname, realcoordLatX, realcoordLongY, checkupd) "+
"VALUES ('"+el.service+"',"+el.coordLatX*1+","+el.coordLongY*1+",'"+el.name+"','"+el.desc+"','"+el.address+"','"+el.realname+"',"+el.realcoordLatX*1+","+el.realcoordLongY*1+",1)";
                                        tx.executeSql(query, [], function(tx,results){
                                            countTr++;
                                            mainPanel.updateTitleFromStrToDB(countTr,countAllItem);
                                            checkFinish(0,countTr,"");
                                        }, function(tx,results){
                                            countTr++;
                                            mainPanel.updateTitleFromStrToDB(countTr,countAllItem);
                                            checkFinish(0,countTr,"");
                                            console.log(i+" - ERROR");
                                        });
                                    });
                                });
                                
                            } else { Ext.Msg.alert('Ошибка', 'Неправильный формат данных.'); }
                            win.close();
                        }
                    }
                });
            }
        }]
    });
    win.show();
}

function checkFinish(countUpd,countIns,service){
    if(countTr===countAllItem){
        setMask(false);
        alert("Updated: "+countUpd+", Inserted: "+countIns);
        getCountAll();
        //getCoords(service);
        countAllItem=0;
        countTr=0;
        console.log("Updated: "+countUpd+", Inserted: "+countIns);
        db.transaction(function(tx){ tx.executeSql("DELETE FROM coordinates WHERE checkupd=0"); });
        if(service!==""){
            db.transaction(function(tx){
                tx.executeSql("SELECT count(*) cnt FROM coordinates WHERE service='"+service+"'",[],function(tx,results){
                    mainPanel.getListCompanyGrid().getStore().findRecord('name',service).set('cnt',results.rows.item(0).cnt);
                    results.rows.item(0).cnt;
                });
            });
        }
    }
}
function applyCoords(service){
    var countUpd=0,countIns=0;
    if(tempAr.length>0){
        db.transaction(function(tx){ tx.executeSql("UPDATE coordinates SET checkupd=0 WHERE service='"+service+"'"); });
        tempAr.forEach(function(el,i,arr){
            db.transaction(function(tx){
                if(countTr===0){ setMask(true,false,"Подождите, идет сохранение координат в БД."); }

                var queryMatch="SELECT count(*) cnt FROM coordinates WHERE service='"+service+"' AND name='"+el.name+"' AND address='"+el.address+"' AND coordLatX="+el.coordLatX*1+" AND coordLongY="+el.coordLongY*1;
                db.transaction(function(tx){
                    tx.executeSql(queryMatch, [], function(tx,results){
                        var query="UPDATE coordinates SET desc='"+el.desc+"', checkupd=1 "+
"WHERE service='"+service+"' AND name='"+el.name+"' AND address='"+el.address+"' AND coordLatX="+el.coordLatX*1+" AND coordLongY="+el.coordLongY*1;
                        if(results.rows.item(0).cnt>0){
                            countUpd++;
                            tx.executeSql(query,[],function(tx,results){ countTr++; checkFinish(countUpd,countIns,service); });
                        } else {
                            query="INSERT INTO coordinates (service, coordLatX, coordLongY, name, desc, address, checkupd) "+
"VALUES ('"+service+"',"+el.coordLatX*1+","+el.coordLongY*1+",'"+el.name+"','"+el.desc+"','"+el.address+"',1)";
                            countIns++;
                            tx.executeSql(query,[],function(tx,results){ countTr++; checkFinish(countUpd,countIns,service); });
                        }
                    }, null);
                });

            });
        });
        tempAr=[];
    }
}

function scanCoords(rec,grid){
    switch(rec.get('name')){
        case "Hermes": scanHermes(rec.get('url')); break;
        case "Boxberry": scanBoxberry(rec.get('url')); break;
        case "PickPoint": scanPickPoint(rec.get('url')); break;
        case "ozon": scanozon(rec.get('url')); break;
        case "DPD": scanDPD(rec.get('url')); break;
        case "SPSR": scanSPSR(rec.get('url')); break;
        case "IML": scanIML(rec.get('url')); break;
        case "DELLIN": scanDELLIN(rec.get('url')); break;
        case "PONY": scanPONY(rec.get('url')); break;
        case "KCE": scanKCE(rec.get('url')); break;
        //case "Dimex": scanDimex(rec.get('url')); break;
        case "Grastin": scanGrastin(rec.get('url')); break;
        case "GlavPunkt": scanGlavPunkt(rec.get('url')); break;
        //case "Aximus": scanAximus(rec.get('url')); break;
        case "shop logistics": scanShopLogistics(rec.get('url')); break;
        case "EX Mail": scanEXMail(rec.get('url')); break;
        default: break;
    }
    //grid.getSelectionModel().select(rec,false,true);
}

function scanHermes(url){
    var service="Hermes";
    Ext.Ajax.request({
        cors: true,
        useDefaultXhrHeader: false,
        url: url,
        method: 'POST',
        params: { },
        headers: { },
        success: function(response){
            var coords=JSON.parse(response.responseText);
            countAllItem=0;countTr=0;tempAr=[];
            coords.parcelshops.forEach(function(item,i,arr){
                item.forEach(function(item2,i2,arr2){
                    var coordLatX=(""+item2.Latitude+"").replace(/,/igm,".");
                    var coordLongY=(""+item2.Longitude+"").replace(/,/igm,".");
                    var name=item2.Name.replace(/'/igm,"''");
                    var desc=item2.WorkingTime.replace(/'/igm,"''");
                    var address=(item2.Address.City.RegionAreaName+", "+item2.Address.City.CityAbbr+"."+item2.Address.City.Name+", "+item2.Address.ShortAddress).replace(/'/igm,"''");
                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
            });
            applyCoords(service);
        },
        failure: function(response){ }
    });
}
function scanBoxberry(url){
    var service="Boxberry";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте текст из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue();
                coords=coords.replace(/\\n/igm," ");
                coords=coords.replace(/\\t/igm," ");
                coords=coords.replace(/"\\[^uU]/igm," \\");
                coords=coords.replace(/""/igm,"\"");
                coords=coords.replace(/\n/igm," ");
                coords=coords.replace(/  /igm," ");
                coords=coords.replace(/\s\s/igm," ");
                coords=coords.replace(/ "/igm,"\"");
                coords=coords.replace(/" /igm,"\"");
                coords=coords.replace(/ :/igm,":");
                coords=coords.replace(/: /igm,":");
                coords=coords.replace(/"balloonContentBody":".*?"\}/igm,'"balloonContentBody":""}');
                coords=coords.replace(/[^\{\}\[\]:,]"[^\{\}\[\]:,]/igm,function(str,offset,s){return str.replace(/\"/igm," "); });
                
                coords=JSON.parse(coords);
                countAllItem=0;countTr=0;tempAr=[];
                coords.features.forEach(function(item,i,arr){
                    var coordLatX=(""+item.geometry.coordinates[0]+"").replace(/,/igm,".");
                    var coordLongY=(""+item.geometry.coordinates[1]+"").replace(/,/igm,".");
                    var name=item.properties.office_name.replace(/'/igm,"''");
                    var desc=item.properties.balloonContentHeader.replace(/'/igm,"''");
                    var address=item.properties.address.replace(/'/igm,"''");

                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanPickPoint(url){
    var service="PickPoint";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте текст из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue();
                coords=coords.replace(/\n/igm," ");
                coords=coords.replace(/\t/igm," ");
                coords=coords.replace(/\s\s/igm," ");
                coords=coords.replace(/^.*?<ptinfo>/igm,"<ptinfo>");
                var xmlDoc,parser;
                if(window.DOMParser){
                    parser=new DOMParser();
                    xmlDoc=parser.parseFromString(coords,"text/xml");
                } else {
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async=false;
                    xmlDoc.loadXML(coords);
                }
                coords=xmlDoc.getElementsByTagName("pt");

                countAllItem=0;countTr=0;tempAr=[];
                for(var i=0;i<coords.length;i++){
                    var coordLatX=coords[i].getElementsByTagName("latitude")[0].childNodes[0].nodeValue.replace(/,/igm,".");
                    var coordLongY=coords[i].getElementsByTagName("longitude")[0].childNodes[0].nodeValue.replace(/,/igm,".");
                    var name=coords[i].getElementsByTagName("PT_Name")[0].childNodes[0].nodeValue.replace(/'/igm,"''");
                    var desc=coords[i].getElementsByTagName("Outdoor")[0].childNodes[0].nodeValue.replace(/'/igm,"''");
                    var address=(coords[i].getElementsByTagName("PostCode")[0].childNodes[0].nodeValue+", "+
                            coords[i].getElementsByTagName("Region")[0].childNodes[0].nodeValue+", "+
                            coords[i].getElementsByTagName("City")[0].childNodes[0].nodeValue+", "+
                            coords[i].getElementsByTagName("ADDRESS")[0].childNodes[0].nodeValue).replace(/'/igm,"''");
                    tempAr.push({coordLatX: coordLatX, coordLongY: coordLongY, name: name, desc: desc, address: address});
                    countAllItem++;
                }
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanozon(url){
    var service="ozon";
    Ext.Msg.alert('Внимание', 'Загрузка координат происходит из статичного скрипта.');
    countAllItem=0;countTr=0;tempAr=[];
    coords_ozon.forEach(function(el,i,arr){
        var coordLatX=(""+el.coord[0]+"").replace(/,/igm,".");
        var coordLongY=(""+el.coord[1]+"").replace(/,/igm,".");
        var name=el.name.replace(/'/igm,"''");
        var desc=el.name.replace(/'/igm,"''");
        var address=el.address.replace(/'/igm,"''");
        tempAr.push({coordLatX: coordLatX, coordLongY: coordLongY, name: name, desc: desc, address: address});
        countAllItem++;
    });
    applyCoords(service);
}
function scanDPD(url){
    var service="DPD";
    Ext.Msg.alert('Внимание', 'Загрузка координат происходит из статичного скрипта.');
    countAllItem=0;countTr=0;tempAr=[];
    coords_dpd.forEach(function(el,i,arr){
        var coordLatX=(""+el[2]+"").replace(/,/igm,".");
        var coordLongY=(""+el[3]+"").replace(/,/igm,".");
        var name=el[0].replace(/'/igm,"''");
        var desc=el[4].replace(/'/igm,"''");
        var address=el[1].replace(/'/igm,"''");
        tempAr.push({coordLatX: coordLatX, coordLongY: coordLongY, name: name, desc: desc, address: address});
        countAllItem++;
    });
    applyCoords(service);
}

function scanSPSR(url){
    var service="SPSR";
    Ext.Ajax.request({
        cors: true,
        useDefaultXhrHeader: false,
        url: 'https://www.spsr.ru/webapi/all_offices?locale=ru',
        method: 'GET',
        params: { },
        headers: { },
        success: function(response){
            var cities=JSON.parse(response.responseText);
            if(cities.length>0){
                var citiAr=[];
                countAllItem=0;countTr=0;tempAr=[];
                cities.forEach(function(item,i,arr){
                    citiAr[item.id]={count: 0, flag: false, name: item.city, id: item.id };
                });
                scanSPSRCity(url,service,citiAr);
            }
        },
        failure: function(response){ }
    });
}
function scanSPSRCity(url,service,citiAr){
    var tempCity="",tempId=0;
    citiAr.forEach(function(item,i,arr){
        if(!item.flag && tempCity===""){ tempCity=item.name; tempId=item.id; }
    });
    if(tempCity!==""){
        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: url+tempCity,
            method: 'GET',
            params: { },
            headers: { },
            success: function(response){
                var coords=JSON.parse(response.responseText);
                citiAr[tempId].count=coords.length;
                if(coords.length>0){
                    coords.forEach(function(item){
                        var coordLatX=(""+item.latitude+"").replace(/,/igm,".");
                        var coordLongY=(""+item.longitude+"").replace(/,/igm,".");
                        var name=item.name.replace(/'/igm,"''");
                        var desc=item.in_description.replace(/'/igm,"''");
                        var address=(tempCity+", "+item.address).replace(/'/igm,"''");
                        
                        tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                        countAllItem++;
                    });
                    citiAr[tempId].flag=true;
                    scanSPSRCity(url,service,citiAr);
                } else {
                    citiAr[tempId].flag=true;
                    scanSPSRCity(url,service,citiAr);
                }
            },
            failure: function(response){ }
        });
    } else { applyCoords(service); }
}

function scanIML(url){
    var service="IML";
    Ext.Ajax.request({
        cors: true,
        useDefaultXhrHeader: false,
        url: 'https://iml.ru/files/pvz.js?1537431844',//url,
        method: 'GET',
        params: { },
        headers: { },
        success: function(response){
            var coords=response.responseText;
            coords=coords.replace(/\\"/igm," ");
            coords=coords.replace(/\\n/igm," ");
            coords=coords.replace(/\\t/igm," ");
            coords=coords.replace(/"\\[^uU\/]/igm," \\");
            coords=coords.replace(/ "/igm,"\"");
            coords=coords.replace(/" /igm,"\"");
            coords=coords.replace(/ :/igm,":");
            coords=coords.replace(/: /igm,":");
            coords=coords.replace(/[^:]""[^:]/igm,"\"");
            coords=coords.replace(/\n/igm," ");
            coords=coords.replace(/  /igm," ");
            coords=coords.replace(/\s\s/igm," ");
            
            coords=coords.match(/var pvz = \{.*?var courierCities = \[\];/i)[0];
            coords=coords.replace(/var pvz = /igm,"");
            coords=coords.replace(/;\s*?var courierCities = \[\];$/igm,"");
            
            coords=JSON.parse(coords);
            
            countAllItem=0;countTr=0;tempAr=[];            
            for(var key in coords){
                var nameArea=key;
                if(!!coords[key].name.ru){ nameArea=coords[key].name.ru; }
                coords[key].markers.forEach(function(item,i,arr){
                    
                    var coordLatX=(""+item.position[1]+"").replace(/,/igm,".");
                    var coordLongY=(""+item.position[0]+"").replace(/,/igm,".");
                    var name=item.name.ru.replace(/'/igm,"''");
                    var desc=item.name.ru.replace(/'/igm,"''");
                    var address=(nameArea+", "+item.shortaddress.ru).replace(/'/igm,"''");
                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
            }
            applyCoords(service);
        },
        failure: function(response){ }
    });
}
function scanDELLIN(url){
    var service="DELLIN";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте текст из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue();
                coords=JSON.parse(coords);
                //console.log(coords);
                countAllItem=0;countTr=0;tempAr=[];
                coords.forEach(function(item,i,arr){
                    var coordLatX=(""+item.terminal.latitude+"").replace(/,/igm,".");
                    var coordLongY=(""+item.terminal.longitude+"").replace(/,/igm,".");
                    var name=item.name.replace(/'/igm,"''");
                    var desc=item.address.replace(/'/igm,"''");
                    var address=item.terminal.terminalAddress.replace(/'/igm,"''");
                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanPONY(url){
    var service="PONY";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте код страницы (CTRL+U в хроме) из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue(),cities;
                coords=coords.replace(/\n/igm," ");
                coords=coords.replace(/\s\s/igm," ");
                
                cities=coords.match(/<script id="findMapCityAutocompleteList".*?<\/script>/igm)[0];
                cities=cities.replace(/<script id="findMapCityAutocompleteList" type="application\/json">/igm,"");
                cities=cities.replace(/<\/script>/igm,"");
                cities=JSON.parse(cities);
                
                coords=coords.match(/arObjects\.PLACEMARKS\[arObjects\.PLACEMARKS\.length\].*?\}\);/igm);
                
                countAllItem=0;countTr=0;tempAr=[];
                coords.forEach(function(item,i,arr){
                    var tempItem=item.replace(/arObjects\.PLACEMARKS\[arObjects\.PLACEMARKS\.length\] = BX_YMapAddPlacemark\(map, /igm,"");
                    tempItem=tempItem.replace(/\);$/igm,"");
                    tempItem=tempItem.replace(/'/igm,"\"");
                    tempItem=JSON.parse(tempItem);
                    
                    var coordLatX=(""+tempItem.LAT+"").replace(/,/igm,".");
                    var coordLongY=(""+tempItem.LON+"").replace(/,/igm,".");
                    var name=tempItem.TEXT.replace(/'/igm,"''");
                    var desc=tempItem.TEXT.replace(/'/igm,"''");
                    var address=tempItem.TEXT.replace(/'/igm,"''");
                    cities.forEach(function(el,i,arr){
                        if(el.cityId===tempItem.CITY){ address=el.region+", "+el.city+", "+address; }
                    });
                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanKCE(url){
    var service="KCE";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте код страницы (CTRL+U в хроме) из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue();
                coords=coords.replace(/\n/igm," ");
                coords=coords.replace(/\r/igm," ");
                coords=coords.replace(/\t/igm," ");
                coords=coords.replace(/[\s]{2,}/igm," ");
                coords=coords.replace(/> </igm,"><");
                
                coords=coords.match(/Адрес, контакты<\/h2>.*?<\/td>/igm);
                
                //console.log(coords);
                countAllItem=0;countTr=0;tempAr=[];
                coords.forEach(function(el,i,arr){
                    var tempStr=el.replace(/Адрес, контакты<\/h2>/,"");
                    tempStr=tempStr.replace(/<.*?>/igm,"");
                    tempStr=tempStr.replace(/^ /igm,"");
                    tempStr=tempStr.replace(/&.*?;/igm,"");
                    arr[i]=tempStr;
                    
                    var coordLatX=0;
                    var coordLongY=0;
                    var name=tempStr.replace(/'/igm,"''");
                    var desc=tempStr.replace(/'/igm,"''");
                    var address=tempStr.replace(/'/igm,"''");
                    tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                    countAllItem++;
                });
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanDimex(){
    
}
function scanGrastin(url){
    var service="Grastin";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте код страницы (CTRL+U в хроме) из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue();
                coords=coords.replace(/\n/igm," ");
                coords=coords.replace(/\s\s/igm," ");
                
                coords=coords.match(/var places = .*?\} \] \}; <\/script>/igm)[0];
                coords=coords.replace(/var places = /igm,"");
                coords=coords.replace(/; <\/script>/igm,"");
                coords=coords.replace(/'/igm,"\"");
                coords=coords.replace(/ "/igm,"\"");
                coords=coords.replace(/" /igm,"\"");
                coords=coords.replace(/[^\{\}\[\]:,]"[^\{\}\[\]:,]/igm,function(str,offset,s){return str.replace(/\"/igm," "); });
                eval("coords="+coords);
                
                var nameArea="";
                countAllItem=0;countTr=0;tempAr=[];
                for(var key in coords){
                    var tempArGr=coords[key];
                    if(key==="mo"){ nameArea="Московская область, "; }
                    else if(key==="msk"){ nameArea="Москва, "; }
                    else if(key==="nn"){ nameArea="Нижний Новгород, "; }
                    else if(key==="orl"){ nameArea="Орел, "; }
                    else if(key==="spb"){ nameArea="Санкт-Петербург, "; }
                    tempArGr.forEach(function(el,i,arr){
                        var coordLatX=(""+el.coords[0]+"").replace(/,/igm,".");
                        var coordLongY=(""+el.coords[1]+"").replace(/,/igm,".");
                        var name=el.hint.replace(/'/igm,"''");
                        var desc=el.hint.replace(/'/igm,"''");
                        var address=(nameArea+el.adr).replace(/'/igm,"''");
                        tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                        countAllItem++;
                    });
                }
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanGlavPunkt(url){
    var service="GlavPunkt";
    var ta=Ext.create('Ext.form.field.TextArea', {});
    url='http://glavpunkt.ru/punkts-widget';
    window.open(url,'_blank');
    window.parent.focus();
    var win=Ext.create('Ext.window.Window', {
        title: 'Скопируйте код страницы (CTRL+U в хроме) из открывщейся вкладки сюда.',
        height: 600,
        width: 600,
        layout: 'fit',
        defaultFocus: ta,
        modal: true,
        items: [ta],
        buttons: [{
            text: 'Отправить',
            handler: function(){
                var coords=ta.getValue(),cities;
                coords=coords.replace(/\\n/igm," ");
                coords=coords.replace(/\s\s/igm," ");
                
                cities=coords.match(/var cities = .*?var allpvz = /igm)[0];
                cities=cities.replace(/var cities = /igm,"");
                cities=cities.replace(/;\s*?var allpvz = $/igm,"");
                cities=JSON.parse(cities);
                
                coords=coords.match(/var allpvz = .*?var def_city/igm)[0];
                coords=coords.replace(/var allpvz = /igm,"");
                coords=coords.replace(/;\s*?var def_city$/igm,"");
                coords=JSON.parse(coords);
                
                var tempCoord;
                countAllItem=0;countTr=0;tempAr=[];
                for(var key in coords){
                    var nameCity="";
                    for(var idCityArea in cities){
                        for(var idNameCity in cities[idCityArea].cities){
                            if(cities[idCityArea].cities[idNameCity].id===key){ nameCity=cities[idCityArea].cities[idNameCity].name+", "; }
                        }
                    }
                    for(var id in coords[key]){
                        tempCoord=coords[key][id];
                        
                        var coordLatX=(""+tempCoord.gps["0"]+"").replace(/,/igm,".");
                        var coordLongY=(""+tempCoord.gps["1"]+"").replace(/,/igm,".");
                        var name=tempCoord.addr.replace(/'/igm,"''");
                        var desc=(tempCoord.addr+" ("+tempCoord.operator+")").replace(/'/igm,"''");
                        var address=(nameCity+tempCoord.addr).replace(/'/igm,"''");
                        tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address});
                        countAllItem++;
                    }
                }
                applyCoords(service);
                win.close();
            }
        }]
    });
    win.show();
}
function scanAximus(url){
    
}
function scanShopLogistics(url){
    var service="shop logistics";
    Ext.Ajax.request({
        cors: true,
        useDefaultXhrHeader: false,
        url: url,
        method: 'POST',
        params: { },
        headers: { },
        success: function(response){
            var coords=response.responseText;
            coords=coords.match(/"pickups":\[.*?\]/i)[0];
            coords=coords.replace(/"pickups":/igm,"");
            coords=JSON.parse(coords);
            
            countAllItem=0;countTr=0;tempAr=[];
            coords.forEach(function(item,i,arr){
                var coordLatX=(""+item.latitude+"").replace(/,/igm,".");
                var coordLongY=(""+item.longitude+"").replace(/,/igm,".");
                var name=item.name.replace(/'/igm,"''");
                var desc=item.name.replace(/'/igm,"''");
                var address=(item.name).replace(/'/igm,"''");
                address=address.replace(/ПВЗ ?/igm,"");
                tempAr.push({coordLatX: coordLatX,coordLongY: coordLongY,name: name,desc: desc,address: address, pickup_places_id: item.pickup_places_id, city_id: item.city_id});
                countAllItem++;
            });
            scanAddressSL(0);
        },
        failure: function(response){ }
    });
}
function scanAddressSL(i){
    var service="shop logistics";
    if(i<tempAr.length){
        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: "https://client-shop-logistics.ru/index.php",
            method: 'GET',
            params: { jsoncallback: 'jQuery', route: 'calculate/geography/get_pickup_info', pickup_places_id: tempAr[i].pickup_places_id, city_id: tempAr[i].city_id, code: 1195780 },
            success: function(response){
                var address=response.responseText;
                
                address=address.replace(/\\n/igm," ");
                address=address.replace(/\\r/igm," ");
                address=address.replace(/\s\s/igm," ");
                address=address.replace(/^jQuery\(/igm," ");
                address=address.replace(/\);$/igm," ");
                address=JSON.parse(address);
                address=address.html;
                
                address=address.match(/<b>Адрес:<\/b><br>.*?<br>/i)[0];
                address=address.replace(/<b>Адрес:<\/b><br>/igm,"");
                address=address.replace(/<br>/igm,"");
                if(address!==""){
                    tempAr[i].address=address;
                }
                scanAddressSL(i+1);
            },
            failure: function(response){ }
        });
    } else {
        applyCoords(service);
    }
}
function scanEXMail(url){
    var service="EX Mail";
    Ext.Msg.alert('Внимание', 'Загрузка координат происходит из статичного скрипта.');
    countAllItem=0;countTr=0;tempAr=[];
    coords_exmail.forEach(function(el,i,arr){
        var coordLatX=0;
        var coordLongY=0;
        var name=el.name.replace(/'/igm,"''");
        var desc=el.name.replace(/'/igm,"''");
        var address=el.address.replace(/'/igm,"''");
        tempAr.push({coordLatX: coordLatX, coordLongY: coordLongY, name: name, desc: desc, address: address});
        countAllItem++;
    });
    applyCoords(service);
}

function findNonSyncCoord(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM coordinates WHERE realcoordLatX=0 OR realcoordLongY=0", [], function(tx,results){
            var coordAr=[];
            setMask(true,false,"Подождите, идет извлечение координат из БД.");
            for(var i=0;i<results.rows.length;i++){
                var coordLatX=results.rows.item(i).coordLatX;
                var coordLongY=results.rows.item(i).coordLongY;
                var service=results.rows.item(i).service;
                var name=results.rows.item(i).name;
                var address=results.rows.item(i).address;
                var desc=results.rows.item(i).desc;
                var realname=results.rows.item(i).realname;
                var realcoordLatX=results.rows.item(i).realcoordLatX;
                var realcoordLongY=results.rows.item(i).realcoordLongY;
                coordAr.push({
                    coordLatX: coordLatX,
                    coordLongY: coordLongY,
                    service: service,
                    name: name,
                    address: address,
                    desc: desc,
                    realname: realname,
                    realcoordLatX: realcoordLatX,
                    realcoordLongY: realcoordLongY
                });
            }
            drawNonSyncCoord(coordAr);
        }, null);
    });
}
function drawNonSyncCoord(data){
    setMask(false);
    var coordPanel=Ext.create('Ext.grid.Panel', {
        store: Ext.create('Ext.data.Store',{
            fields:['coordLatX','coordLongY','service','name','address','desc'],
            data: data
        }),
        columns: {
            defaults: {menuDisabled: true},
            items: [{ xtype: 'rownumberer', width: 50 },
            {text: 'Компания', dataIndex: 'service'},
            {text: 'Название ПВЗ', dataIndex: 'name'},
            {text: 'Адрес', dataIndex: 'address', flex: 1}
        ]},
        listeners: {
            'rowdblclick': function(vt,rec){ editNonSyncCoord(rec); }
        }
    });
    var win=Ext.create('Ext.window.Window', {
        title: 'Адреса не синхронизированыые с YandexMap.',
        height: 500,
        width: 700,
        layout: 'fit',
        modal: true,
        items: [coordPanel],
        buttons: [{
            text: 'Закрыть',
            handler: function(){ win.close(); }
        }]
    });
    win.show();
}
function editNonSyncCoord(rec){
    var serviceText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Компания',
        value: rec.get('service')
    });
    var nameText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Название ПВЗ',
        value: rec.get('name')
    });
    var addressText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Адрес ПВЗ',
        value: rec.get('address')
    });
    var descText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Описание ПВЗ',
        value: rec.get('desc')
    });
    var realnameText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Новый адрес ПВЗ',
        readOnly: false,
        value: rec.get('realname')
    });
    var realcoordLatXText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Новая широта ()',
        readOnly: false,
        value: rec.get('realcoordLatX')
    });
    var realcoordLongYText=Ext.create('Ext.form.field.Text',{
        fieldLabel: 'Новая долгота ()',
        readOnly: false,
        value: rec.get('realcoordLongY')
    });
    var win=Ext.create('Ext.window.Window', {
        title: 'Адреса не синхронизированыые с YandexMap.',
        height: 210,
        width: 800,
        bodyPadding: 5,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        modal: true,
        defaults: {readOnly: true, labelWidth: 115},
        items: [serviceText,nameText,addressText,descText,realnameText],
        buttons: [{
            text: 'Сохранить',
            handler: function(){
                if(realnameText.getValue()!==""){
                    rec.set('realname',realnameText.getValue());
                    var query="UPDATE coordinates SET realname='"+realnameText.getValue().replace(/'/igm,"''")+"'"+
"WHERE service='"+rec.get('service')+"' AND name='"+rec.get('name').replace(/'/igm,"''")+"' AND address='"+rec.get('address').replace(/'/igm,"''")+"' AND coordLatX="+rec.get('coordLatX')*1+" AND coordLongY="+rec.get('coordLongY')*1;
                    db.transaction(function(tx){
                        tx.executeSql(query, [], function(tx,results){
                            win.close();
                        }, null);
                    });
                } else {
                    Ext.Msg.alert('Ошибка', 'Поле "Новый адрес ПВЗ" не должно быть пустым');
                }
            }
        },{
            text: 'Закрыть',
            handler: function(){ win.close(); }
        }]
    });
    win.show();
}
/*function scanozon_old(url){
    var service="ozon";
    Ext.Ajax.request({
        cors: true,
        useDefaultXhrHeader: false,
        url: 'https://www.ozon.ru/json/location.asmx/GetHeaderInfoByAreaId',//url,
        method: 'POST',
        jsonData: { areaId:25949 },
        headers: {
            ':authority': 'www.ozon.ru',
            ':method': 'POST',
            ':path': '/json/location.asmx/getheaderinfobyareaid',
            ':scheme': 'https',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            
            'Content-Type': 'application/json; charset=windows-1251',
            'Access-Control-Allow-Headers': 'Content-Type, accept, accept-encoding, accept-language, content-length'
        },
        success: function(response){
            var coords=JSON.parse(response.responseText);
            var count=0,countTr=0;
            if(coords.parcelshops.length>0){ db.transaction(function(tx){ tx.executeSql("DELETE FROM coordinates WHERE service='"+service+"'"); }); }
            coords.parcelshops.forEach(function(item,i,arr){
                item.forEach(function(item2,i2,arr2){
                    var coordLatX=(""+item2.Latitude+"").replace(/,/igm,".");
                    var coordLongY=(""+item2.Longitude+"").replace(/,/igm,".");
                    var name=item2.Name.replace(/'/igm,"''");
                    var desc=item2.WorkingTime.replace(/'/igm,"''");
                    var address=(item2.Address.City.RegionAreaName+", "+item2.Address.City.CityAbbr+"."+item2.Address.City.Name+", "+item2.Address.ShortAddress).replace(/'/igm,"''");
                    var realname="null";
                    var realcoordLatX="'null'";
                    var realcoordLongY="'null'";
                    
                    db.transaction(function(tx){
                        if(countTr===0){ setMask(true,false,"Подождите, идет сохранение координат в БД."); }
                        tx.executeSql("INSERT INTO coordinates (service, coordLatX, coordLongY, name, desc, address, realname, realcoordLatX, realcoordLongY) "+
"VALUES ('"+service+"',"+coordLatX*1+","+coordLongY*1+",'"+name+"','"+desc+"','"+address+"','"+realname+"',"+realcoordLatX+","+realcoordLongY+")");
                        countTr++;
                        if(countTr===count){ setMask(false); alert("insert "+count+" records"); }
                    });
                    count++;
                });
            });
            getCountAll();
            getCoords(service);
        },
        failure: function(response){ }
    });
}*/