Ext.tip.QuickTipManager.init();
var mainPanel;
var maskViewed=false;
var isMainMask=false;

Ext.onReady(function(){ viewPage(); });
function setMask(flag,isMain,msg){
    isMain=!!isMain;
    if(flag && !!!msg){ msg="Загрузка"; }
    if(flag && isMain){
        Ext.getBody().unmask();
        Ext.getBody().mask(msg);
        maskViewed=true;
        isMainMask=true;
    }
    if(flag && !maskViewed){
        if(isMain){ isMainMask=true; }
        Ext.getBody().mask(msg);
        maskViewed=true;
    } else if(!flag){
        if(isMainMask){
            if(isMain){
                Ext.getBody().unmask();
                maskViewed=false;
            }
        } else {
            Ext.getBody().unmask();
            maskViewed=false;
        }
    }
}
function viewPage(){
    Ext.Ajax.on('beforerequest',function(){ setMask(true,false,"Загрузка"); }, Ext.getBody());
    Ext.Ajax.on('requestcomplete',function(){ setMask(false); } ,Ext.getBody());
    Ext.Ajax.on('requestexception',function(){ setMask(false); }, Ext.getBody());

    var listCompany=Ext.create('Ext.grid.Panel', {
        width: 200,
        border: false,
        region: 'north',
        hideHeaders: true,
        store: Ext.create('Ext.data.Store',{
            fields:['my_id','name','color','url','check'],
            data: []
        }),
        viewConfig:{ markDirty:false },
        columns: {
            defaults: {menuDisabled: true,sortable:false,resizable:false},
            items: [
            {xtype: 'checkcolumn', width:25, dataIndex: 'check'},
            {dataIndex: 'name', flex: 1, menuDisabled: true, sortable: false, renderer : function(value, meta, record){
                return record.getData()['name']+" ("+record.getData()['cnt']+")";
            } },
            {xtype:'actioncolumn',menuDisabled: true,
                width:20,
                items: [{
                    tooltip: 'Синхронизировать',
                    iconCls: 'link_but',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec=grid.getStore().getAt(rowIndex);
                        scanCoords(rec,grid);
                    }
                }]
            },
            {dataIndex: 'color', width:20, menuDisabled: true, sortable: false, renderer : function(value, meta, record){
                switch(record.getData()['color']){
                    case "blueIcon": meta.tdCls+=' status_blueIcon'; break;
                    case "darkOrangeIcon": meta.tdCls+=' status_darkOrangeIcon'; break;
                    case "nightIcon": meta.tdCls+=' status_nightIcon'; break;
                    case "darkBlueIcon": meta.tdCls+=' status_darkBlueIcon'; break;
                    case "pinkIcon": meta.tdCls+=' status_pinkIcon'; break;
                    case "grayIcon": meta.tdCls+=' status_grayIcon'; break;
                    case "brownIcon": meta.tdCls+=' status_brownIcon'; break;
                    case "darkGreenIcon": meta.tdCls+=' status_darkGreenIcon'; break;
                    case "violetIcon": meta.tdCls+=' status_violetIcon'; break;
                    case "blackIcon": meta.tdCls+=' status_blackIcon'; break;
                    case "yellowIcon": meta.tdCls+=' status_yellowIcon'; break;
                    case "greenIcon": meta.tdCls+=' status_greenIcon'; break;
                    case "orangeIcon": meta.tdCls+=' status_orangeIcon'; break;
                    case "lightBlueIcon": meta.tdCls+=' status_lightBlueIcon'; break;
                    case "oliveIcon": meta.tdCls+=' status_oliveIcon'; break;
                    case "redIcon": meta.tdCls+=' status_redIcon'; break;
                    default: break;
                }
                return "";
            } }
        ]},
        listeners: { 'select': function(rm,rec,i){
                groupCompany.getSelectionModel().deselect(groupCompany.getSelectionModel().getSelection()[0]);
                getCoords(rec.get('name'));
            }
        }
    });

    var groupCompany=Ext.create('Ext.grid.Panel', {
        width: 200,
        border: false,
        region: 'center',
        hideHeaders: true,
        store: Ext.create('Ext.data.Store',{
            fields:['my_id','name','color','url'],
            data: []
        }),
        columns: {
            defaults: {menuDisabled: true,sortable:false,resizable:false},
            items: [
            {text: 'Группировка', dataIndex: 'name', flex: 1, menuDisabled: true, sortable: false},
            {dataIndex: 'color', width:20, menuDisabled: true, sortable: false, renderer : function(value, meta, record){
                switch(record.getData()['color']){
                    case "blueIcon": meta.tdCls+=' status_blueIcon'; break;
                    case "darkOrangeIcon": meta.tdCls+=' status_darkOrangeIcon'; break;
                    case "nightIcon": meta.tdCls+=' status_nightIcon'; break;
                    case "darkBlueIcon": meta.tdCls+=' status_darkBlueIcon'; break;
                    case "pinkIcon": meta.tdCls+=' status_pinkIcon'; break;
                    case "grayIcon": meta.tdCls+=' status_grayIcon'; break;
                    case "brownIcon": meta.tdCls+=' status_brownIcon'; break;
                    case "darkGreenIcon": meta.tdCls+=' status_darkGreenIcon'; break;
                    case "violetIcon": meta.tdCls+=' status_violetIcon'; break;
                    case "blackIcon": meta.tdCls+=' status_blackIcon'; break;
                    case "yellowIcon": meta.tdCls+=' status_yellowIcon'; break;
                    case "greenIcon": meta.tdCls+=' status_greenIcon'; break;
                    case "orangeIcon": meta.tdCls+=' status_orangeIcon'; break;
                    case "lightBlueIcon": meta.tdCls+=' status_lightBlueIcon'; break;
                    case "oliveIcon": meta.tdCls+=' status_oliveIcon'; break;
                    case "redIcon": meta.tdCls+=' status_redIcon'; break;
                    default: break;
                }
                return "";
            } }
        ]},
        listeners: { 'select': function(rm,rec,i){
                listCompany.getSelectionModel().deselect(listCompany.getSelectionModel().getSelection()[0]);
                var arCompany=[];
                listCompany.getStore().getData().items.forEach(function(el,i,arr){
                    if(el.get('check')){arCompany.push("'"+el.get('name')+"'")}
                });
                if(arCompany.length>0){
                    getCoordsGroup(rec.get('my_id'),rec.get('name'),arCompany.join(','));
                } else {
                    Ext.Msg.alert('Ошибка', 'Сначала выберите компании.');
                }
            }
        }
    });
    var selectPanel=Ext.create('Ext.Panel', { region: 'west', layout: 'border', items: [listCompany,groupCompany],
        width: 220,
        scrollable: 'y',
        tbar: [
            {text: "Синх-ть с YandexMap", style: {borderColor: 'black'}, handler: function(){ requestSyncYMap(); } },
            '-',
            {text: "Сбросить БД", style: {borderColor: 'black'}, handler: function(){ dropDB(true); } }
        ]
    });
    var mapPanel=Ext.create('Ext.Panel', {
        title: 'Карта ПВЗ.',
        region: 'center',
        contentEl: 'map',
        flex: 1,
        tools: [{
            type: 'refresh',
            tooltip: 'Обновить карту',
            callback: function(){
                if(listCompany.getSelectionModel().getSelection().length>0){
                    getCoords(listCompany.getSelectionModel().getSelection()[0].get('name'));
                } else if(groupCompany.getSelectionModel().getSelection().length>0){
                    var arCompany=[];
                    listCompany.getStore().getData().items.forEach(function(el,i,arr){
                        if(el.get('check')){arCompany.push("'"+el.get('name')+"'")}
                    });
                    if(arCompany.length>0){
                        getCoordsGroup(groupCompany.getSelectionModel().getSelection()[0].get('my_id'),groupCompany.getSelectionModel().getSelection()[0].get('name'),arCompany.join(','));
                    } else {
                        Ext.Msg.alert('Ошибка', 'Сначала выберите компании.');
                    }
                }
            }
        }]
    });

    mainPanel=Ext.create('Ext.Panel', {
        title: 'Карта пунктов выдачи товара.',
        bodyPadding: 5,
        layout: 'border',
        items: [selectPanel,mapPanel],
        tools: [{
            type: 'save',
            tooltip: 'Выгрузить из БД',
            callback: function() { FromDBToStr(); }
        },{
            type: 'restore',
            tooltip: 'Загрузить в БД',
            callback: function() { FromStrToDB(); }
        },{
            type: 'search',
            tooltip: 'Поиск несинхронизированных координат',
            callback: function() { findNonSyncCoord(); }
        }],
        getListCompanyGrid: function(){
            return listCompany;
        },
        setCompany: function(data){
            listCompany.getStore().loadData(data.company);
            groupCompany.getStore().loadData(data.group);
        },
        setCoords: function(data){ mapPanel; },
        updateTitle: function(count){
            mainPanel.setTitle('Карта пунктов выдачи товара. [ Всего в БД <span style="color: red;">'+count+'</span> записей]');
        },
        updateTitleSyncYMap: function(i,count){
            if(i<count){
                mainPanel.setTitle('Всего записей для обновления <span style="color: red;">'+count+'</span>. Осталось обновить <span style="color: green;">'+(count-i)+'</span> записей]');
            } else { getCountAll(); }
        },
        updateTitleFromStrToDB: function(i,count){
            if(i<count){
                mainPanel.setTitle('Всего записей для сохранения <span style="color: red;">'+count+'</span>. Осталось <span style="color: green;">'+(count-i)+'</span> записей]');
            } else { getCountAll(); }
        },
        updateMapTitle: function(name,count){
            mapPanel.setTitle('Карта ПВЗ <span style="color: red;">'+name+'</span>. [ <span style="color: red;">'+count+'</span> записей]');
        }
    });
    
    Ext.create('Ext.container.Viewport',{ items: [mainPanel], layout: 'fit' });
    
    initWebSQL();
}