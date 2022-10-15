'use strict'
// 1行目に記載している 'use strict' は削除しないでください

let actual;
let expected;

function test(actual, expected) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log("Yay! Test PASSED.");
    } else {
        console.error("Test FAILED. Keep trying!");
        console.log("    actual: ", actual);
        console.log("  expected: ", expected);
        console.trace();
    }
}

// 使用する変数※使いまわす可能性のあるもの
let h3 = document.getElementsByTagName("h3")[0];
let h4 = document.getElementsByTagName("h4")[0];
let h5 = document.getElementsByTagName("h5")[0];
let h6 = document.getElementsByTagName("h6")[0];
let dateInput = document.getElementsByClassName("input")[0];
let usageInput = document.getElementsByClassName("input")[1];
let depositInput = document.getElementsByClassName("input")[2];
let drawerInput = document.getElementsByClassName("input")[3];
let calcuAmount = 0;
let arrayOfKey = ["date", "usage","deposit","drawer","amount"]


//口座を開設しすべて非表示にする。口座が開設されていた場合は開設しない。
//ローカルストレージの各データにデータが無ければ、初期値を保存する。※amountがnullだと、データ処理ができないので何か入れておく必要があった。
function makeAccount(){
    h3.style.display = "none";
    h4.style.display = "none";
    h5.style.display = "none";
    h6.style.display = "none";

    let arrayInitialValue = ["****-**-**", "通帳作成", 100, 0, 100]

    if (JSON.parse(localStorage.getItem("date")) === null || JSON.parse(localStorage.getItem("usage")) === null || JSON.parse(localStorage.getItem("deposit")) === null || JSON.parse(localStorage.getItem("drawer")) === null || JSON.parse(localStorage.getItem("amount")) === null){
        for (let i = 0; i < arrayInitialValue.length; i++){
            let array = [];
            array.push(arrayInitialValue[i]);
            let setjson = JSON.stringify(array);
            localStorage.setItem(arrayOfKey[i], setjson);
        }
        window.alert("口座を作成しました。初回特典で100円が入金されました。")
    } else {
        window.alert("口座は開設済です。")
    }
}
const accountBookButton = document.getElementById("bt1");
accountBookButton.addEventListener("click", makeAccount)

//約束事だけの表示⇔非表示切替
function promise(){
    h3.style.display = "none";
    h5.style.display = "none";
    h6.style.display = "none";

    if (h4.style.display === "flex"){
        h4.style.display = "none";
    } else if (h4.style.display !== "flex"){
        h4.style.display = "flex";
    }
}
const promiseButton = document.getElementById("bt2");
promiseButton.addEventListener("click", promise)

//自分の通帳を非表示⇔表示切替する。
function passBook(){
    h4.style.display = "none";
    h5.style.display = "none";
    h6.style.display = "none";

    if (h3.style.display === "flex"){
        h3.style.display = "none";
    } else if (h3.style.display !== "flex"){
        h3.style.display = "flex";
    }
}

//管理者画面の表示⇔非表示切替
function admin(){
    h3.style.display = "none";

    if (h4.style.display === "flex"){
        h4.style.display = "none";
        h5.style.display = "none";
        h6.style.display = "none";
    } else if (h4.style.display !== "flex"){
        h4.style.display = "flex";
        h5.style.display = "flex";
        h6.style.display = "flex";
    }
}
const adminButton = document.getElementById("bt4");
adminButton.addEventListener("click", admin)

//今日の日付を返す
const toDay = function (){
    let date = new Date();
    let yyyy = date.getFullYear();
    let mm = ("0" + (date.getMonth() + 1)).slice(-2);
    let dd = ("0" + date.getDate()).slice(-2);
    return yyyy + "-" + mm + "-" + dd;
}

//預金のチェックが入ったら引出額に0を代入し入力不可にする。
function clickDeposit(){
    dateInput.value = toDay() 
    usageInput.value = null;
    depositInput.value =null;
    drawerInput.value = 0;
    document.getElementById("usage").disabled = false;
    document.getElementById("deposit").disabled = false;
    document.getElementById("drawer").disabled = true;
}
const depositCheckButton = document.getElementsByTagName("label")[0];
depositCheckButton.addEventListener("click", clickDeposit)

//引出のチェックが入ったら預金額に0を代入し入力不可にする。
function clickDrawer(){
    dateInput.value = toDay()
    usageInput.value = null;
    depositInput.value = 0;
    drawerInput.value = null;
    document.getElementById("usage").disabled = false;
    document.getElementById("deposit").disabled = true;
    document.getElementById("drawer").disabled = false;
}
const drawerCheckButton = document.getElementsByTagName("label")[1];
drawerCheckButton.addEventListener("click", clickDrawer)

//金利のチェックが入ったら名目を金利支払いにして、預金額、引出し額を入力不可にする。※預金額は金利、引出し額は関数内で0処理。
function clickInterest(){
    dateInput.value = toDay()
    usageInput.value = "金利支払い";
    depositInput.value = null;
    drawerInput.value = null;
    document.getElementById("usage").disabled = true;
    document.getElementById("deposit").disabled = true;
    document.getElementById("drawer").disabled = true;
}
const interestCheckButton = document.getElementsByTagName("label")[2];
interestCheckButton.addEventListener("click", clickInterest)

//記帳する。
//預金、引出し、金利のどれが選択されているかをif文で判定する・
//預金だった場合は、記録日、名目、預金額、引出し額(※0でなければならない)、預金総額に預金額を加算してデータ格納。
//引出だった場合は、記録日、名目、預金額(※0でなければならない)、引出し額、預金総額から引出し額を減算してデータ格納。
//金利だった場合は、記録日、名目(※金利支払いでなければならない)、預金額(※その時点の総額×0.05の数値)、引出し額(0でなければならない)、預金総額へ預金額(金利)を加算してデータ格納。
function entryPassbook(){
    //チェックボックスの入力値を変数へ代入する。
    let bank = document.getElementsByTagName("form")[0].bank.value
    //現在の入力値を再代入する。
    let dateValue = dateInput.value;
    let usageValue = usageInput.value;
    let depositValue = Number(depositInput.value);
    let drawerValue = Number(drawerInput.value);
    let sevedAmount = JSON.parse(localStorage.getItem("amount"))  
    if (JSON.parse(localStorage.getItem("date")) === null || JSON.parse(localStorage.getItem("usage")) === null || JSON.parse(localStorage.getItem("deposit")) === null || JSON.parse(localStorage.getItem("drawer")) === null || JSON.parse(localStorage.getItem("amount")) === null){
        window.alert("口座が作成されていません。")
        passBook();
        return false;
    }
    //チェックボックスを判定し、計算する。
    if (bank === "deposit"){
        if (usageValue !== "" && depositValue > 0 && drawerValue === 0){
            calcuAmount = sevedAmount[sevedAmount.length - 1] + depositValue;
        } else {
            window.alert("入力値が適切ではありません。")
            return false;
        }
    } else if (bank === "drawer"){
        if (usageValue !== "" && depositValue === 0 && drawerValue > 0){
            calcuAmount = sevedAmount[sevedAmount.length - 1] - drawerValue;
        } else {
            window.alert("入力値が適切ではありません。")
            return false;
        }
    } else if (bank === "interest"){
        if (usageValue === "金利支払い"){
            depositValue = Math.floor(sevedAmount[sevedAmount.length - 1] * 0.05)
            calcuAmount = sevedAmount[sevedAmount.length - 1] + depositValue;
        } else {
            window.alert("入力値が適切ではありません。")
            return false;
        }
    } else {
        window.alert("預金/引出/金利のどれも選択されていません。")
        return false;
    }
    //格納する新しいデータ変数を配列にまとめ、ローカルストレージに格納されている現在データへ追加する。
    //JSON.parseでデータを展開し取り出し、JSON.stringifyで再変換し格納する。圧縮と解凍みたいな処理、これやらないとバグる。
    //あと、配列も入れ子になるのでflatで毎度平坦化。
    let arrayOfValue = [dateValue,usageValue,depositValue,drawerValue,calcuAmount]
    for (let i = 0; i < arrayOfKey.length; i++){
        let setjson = JSON.parse(localStorage.getItem(arrayOfKey[i]));
        setjson.push(arrayOfValue[i]);
        setjson.flat(Infinity)
        localStorage.setItem(arrayOfKey[i], JSON.stringify(setjson));
    }
    displayPassbook()
}
const entryPassbookButton = document.getElementById("bt5");
entryPassbookButton.addEventListener("click", entryPassbook)

//削除する。最新の1行を消去するが、記録が1行しかない場合は実行負荷。1行も無いと動かなくなる！
function deletePassbook(){
    const result = window.confirm("最新の1行を消去します。本当に消去してもよろしいですか？")
    if (result){
        for (let i = 0; i < arrayOfKey.length; i++){
            let setjson = JSON.parse(localStorage.getItem(arrayOfKey[i]));
            if (setjson.length !== 1){
                setjson.pop(arrayOfKey[i]);
                localStorage.setItem(arrayOfKey[i], JSON.stringify(setjson));
                displayPassbook();
            } else {
                window.alert("1行目まで消去することはできません。")
                break;
            }
        }
    } 
}
const deletePassbookButton = document.getElementById("bt6");
deletePassbookButton.addEventListener("click", deletePassbook)

//ローカルストレージ内の記録を「自分の通帳」へ転記する。
//最大で最新の記録からさかのぼって10桁を表示する。10桁以下だった場合は、上から詰めて表示し残りは空白(デフォルトで-)にする。
function displayPassbook(){
    let dateRecord = JSON.parse(localStorage.getItem("date"));
    let usageRecord = JSON.parse(localStorage.getItem("usage"));
    let depositRecord = JSON.parse(localStorage.getItem("deposit"));
    let drawerRecord = JSON.parse(localStorage.getItem("drawer"));
    let amountRecord = JSON.parse(localStorage.getItem("amount"));
    let arrayRecord = [dateRecord, usageRecord, depositRecord, drawerRecord, amountRecord];
    let recordIndex = 0;
    let combineRecord = [];
    let labelTd = document.getElementsByTagName("td");
    if (JSON.parse(localStorage.getItem("date")) === null || JSON.parse(localStorage.getItem("usage")) === null || JSON.parse(localStorage.getItem("deposit")) === null || JSON.parse(localStorage.getItem("drawer")) === null || JSON.parse(localStorage.getItem("amount")) === null){
        window.alert("口座が作成されていません。")
        passBook();
        return false;
    }
    //tebleの内容を全てリフレッシュ("-"を入力")する.※デリート時10桁以下の場合に、前の数値が表示に残ってしまう為。
    for (let i = 0; i < 50; i++){
        labelTd[i].textContent = "-"
    }
    //レコードの長さを判定し変数へ格納する。基本的にデータの長さは同じなので、代表してdateの長さを使う。
    if (dateRecord.length < 10){
        recordIndex = dateRecord.length;
    } else {
        recordIndex = 10;
    }
    //表示するデータを一つの配列にまとめる。
    for (let i = dateRecord.length - recordIndex; i < dateRecord.length; i++){
        for (const record of arrayRecord){
            combineRecord.push(record[i])
        }
    }
    //一つに纏めたデータをテーブルに書き込む。
    for (let i = 0; i < combineRecord.length; i++){
        labelTd[i].textContent = combineRecord[i]
    }
    passBook()
}
const displayPssBookButton = document.getElementById("bt3");
displayPssBookButton.addEventListener("click", displayPassbook)