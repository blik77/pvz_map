<?php
getOzonCity();
function requestPayload($url,$data=array()){
    $data_string=json_encode($data);
    $ch=curl_init($url);
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CAINFO, 'cacert.pem');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        //'Content-Type: text/xml',
        //'Content-Length: '.strlen($data_string),
        )
    );
    $result=curl_exec($ch);
    curl_close($ch);
    return $result;
}
function getOzonCity(){
    $ozonCity=[[2,"Москва"],
        [5911,"Санкт-Петербург"],
        [2495,"Архангельск"],
        [17400,"Астрахань"],
        [30544,"Барнаул"],
        [9262,"Белгород"],
        [6643,"Брянск"],
        [34773,"Владивосток"],
        [23949,"Владимир"],
        [15870,"Волгоград"],
        [14558,"Воронеж"],
        [26575,"Екатеринбург"],
        [18791,"Ижевск"],
        [32105,"Иркутск"],
        [17606,"Казань"],
        [6443,"Калининград"],
        [7224,"Калуга"],
        [29998,"Кемерово"],
        [25198,"Киров"],
        [10687,"Краснодар"],
        [31498,"Красноярск"],
        [15406,"Липецк"],
        [12590,"Махачкала"],
        [5094,"Мурманск"],
        [18484,"Набережные Челны"],
        [24336,"Нижний Новгород"],
        [30399,"Новокузнецк"],
        [27862,"Новосибирск"],
        [29285,"Омск"],
        [8125,"Орел"],
        [23137,"Оренбург"],
        [20481,"Пенза"],
        [25949,"Пермь"],
        [389,"Подольск"],
        [11907,"Пятигорск"],
        [9796,"Ростов-на-Дону"],
        [13415,"Рязань"],
        [20997,"Самара"],
        [16629,"Саратов"],
        [5943,"Смоленск"],
        [11555,"Ставрополь"],
        [27725,"Сургут"],
        [3057,"Сыктывкар"],
        [13962,"Тамбов"],
        [3391,"Тверь"],
        [21029,"Тольятти"],
        [28518,"Томск"],
        [7643,"Тула"],
        [27228,"Тюмень"],
        [20024,"Ульяновск"],
        [21576,"Уфа"],
        [34311,"Хабаровск"],
        [27638,"Ханты-Мансийск"],
        [19198,"Чебоксары"],
        [22671,"Челябинск"],
        [35109,"Южно-Сахалинск"],
        [799,"Ярославль"]];
}
//echo requestPayload("https://www.ozon.ru/json/pvzservice.asmx/GetByAreaId",array("areaId"=>799));
echo requestPayload("https://www.ozon.ru/json/pvzservice.asmx/GetByAreaId?areaId=2",array("areaId"=>799));
?>