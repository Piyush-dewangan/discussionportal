$(document).ready(function () {
    initialise();
    $('#new-form').click(function () {
        $('#area-2').children().slice(1).remove();
        $('#area-2').children().show(500);

    })
    $('#submitbtn').click(function () {

        if (checkip()) {
            alert("Invalid input or Some text is present in search bar")
        }
        else {
            let sub = $('#subject').val().trim();
            let que = $('#question').val().trim();
            let currentId = Date.now();
            putInLocalStorage(sub, que, currentId);
            putIndisplay(sub, que, currentId);
        }
    })
    console.log( $('#searchBar'));

    $('#searchBar').keyup(search);
});
function search(){
    let key=$('#searchBar').val().toUpperCase();
    let list = localStorage.getItem("data");
    list=JSON.parse(list);

    if(list!=null){
        let validQue=[];
        list.forEach(function (obj, index) {
            let quesName = obj.question.toUpperCase();
            console.log(quesName);
            if (quesName) {
                if (quesName.indexOf(key) > -1) {
                    validQue.push(list[index]);
                }
            }
        });
        if (validQue.length === 0) {
            $('#area-1').empty();
            $("#area-1").html(`<h3>😶Question not found😶</h3>`);
        }
        else {
            $('#area-1').empty();
            let len=validQue.length;
            for(let i=0;i<len;i++){
                let obj=validQue[i];
                let sub=obj.subject;
                let que=obj.question;
                let currentId=obj.id;
                putIndisplay(sub, que, currentId);
            }
        }
        console.log(validQue);
    }

    console.log("hello world",key);
}
function initialise() {
    let list = localStorage.getItem('data');
    if (list != null) {
        list = JSON.parse(list);
        console.log("this is", list);
        let len = list.length;
        for (let i = 0; i < len; i++) {
            let obj = list[i];
            putIndisplay(obj.subject, obj.question, obj.id);
        }
    }
}

function checkip() {
    let sub = $('#subject').val().trim();
    let que = $('#question').val().trim();
    let searchKey=$('#searchBar').val();
    return ((sub.length == 0 || que.length == 0)||(searchKey.length!=0));
}

function putIndisplay(sub, que, currentId) {
    console.log("putInDisplay.....");
    let el = `<div id=${currentId} class="shadow-sm p-3 mb-3 bg-light rounded border-right border-left border-warning temp">
    <strong>Subject: ${sub}</strong>
    <br>
    <i>Question: ${que}</i>
</div>`

    $('#area-1').append(el);
    $(`#${currentId}`).click(currResponse(currentId, que, sub));
    $('#subject').val("");
    $('#question').val("");
}

function currResponse(currentId, que, sub) {

    return function () {

        $('#area-2').children().hide(100);
        $('#area-2').children().slice(1).remove();

        let el = `<h4><i>Question:-</i></h4>
        <div id=${currentId} class="shadow-sm p-3 mb-3 bg-light rounded border-right border-left border-success temp">
        <strong>Subject: ${sub}</strong>
        <br>
        <i>Question: ${que}</i>
    </div>
    <button id="resolve${currentId}" type="button"
    class="btn btn-success btn-sm btn-block mt-3">Resolve</button>
    `;
        $('#area-2').append(el);
        $(`#resolve${currentId}`).click(resolve(currentId));

        addPrevResponse(currentId);

        el = `
            <h5><i>Add Response</i></h5>
         <input type="text" class="form-control mb-3" id="n${currentId}"
             aria-describedby="emailHelp" placeholder="Enter Name">

         <input type="text" class="form-control mb-3" id="c${currentId}"
             aria-describedby="emailHelp" placeholder="Enter Comment">
         <button id='r${currentId}' type="button" class="btn btn-secondary btn-sm btn-block mt-3">Add Response</button>`;
        $('#area-2').append(el);

        $(`#r${currentId}`).click(addNewResponse(currentId));
    }
}

function resolve(currentId) {
    return function () {
        console.log("resolve...");
        //step 1:remove it from localstorage
        removeFromLocalstorage(currentId);
        //step 2:handle left part
        $(`#${currentId}`).remove();
        //step 3:handle right part
        $('#area-2').children().slice(1).remove();
        $('#area-2').children().show(500);
    }
}
function removeFromLocalstorage(currentId) {
    let list = localStorage.getItem('data');
    list = JSON.parse(list);
    let len = list.length;
    console.log("length", len);
    for (let i = 0; i < len; i++) {
        let obj = list[i];
        if (obj.id == currentId) {
            list.splice(i, 1);
            break;
        }
    }
    console.log(list.length);
    localStorage.setItem('data', JSON.stringify(list));
}
function addNewResponse(currentId) {
    return function () {
        //step 1: check response
        //step 2: put response in local storage
        //step 3: display response on webpage
        //step 4: set input field value ""
        let check = checkResponse(currentId);
        console.log(check);

        if (check == false) {
            alert("Invalid input")
        }
        else {
            //putting response in local storage
            putResponse(currentId, function () {
                displayResponse(currentId);
                $(`#n${currentId}`).val("");
                $(`#c${currentId}`).val("");
            });
        }
        return;
    }
}
function checkResponse(currentId) {
    let name = $(`#n${currentId}`).val();
    let comment = $(`#c${currentId}`).val();

    name = name.trim();
    comment = comment.trim();

    return (name.length != 0 && comment.length != 0);
}

function putResponse(currentId, cb) {
    let name = $(`#n${currentId}`).val();
    let comment = $(`#c${currentId}`).val();
    name = name.trim();
    comment = comment.trim();

    let list = localStorage.getItem('data');
    list = JSON.parse(list);
    let len = list.length;
    for (let i = 0; i < len; i++) {
        let obj = list[i];
        if (obj.id == currentId) {
            obj.response.push({ name: name, comment: comment });
            break;
        }
    }
    localStorage.setItem('data', JSON.stringify(list));
    cb();
}
function displayResponse(currentId) {
    let name = $(`#n${currentId}`).val();
    let comment = $(`#c${currentId}`).val();
    name = name.trim();
    comment = comment.trim();
    console.log(currentId);
    console.log("display Response");
    console.log(name, comment);
    console.log($(`#b${currentId}`));
    let el = `
    <div  class="shadow-sm p-3 mb-3 bg-light rounded border-right border-left border-secondary temp">
    <strong>Name: ${name}</strong>
    <br>
    <i>Comment: ${comment}</i>
    </div>
    `;
    $(`#b${currentId}`).append(el);

}

function addPrevResponse(currentId) {
    console.log("addPrevResponse....");

    let el = `<div style="max-height:30%; overflow-y:scroll;" id="b${currentId}">
    </div>`;
    let list = localStorage.getItem('data');
    list = JSON.parse(list);
    let len = list.length;
    console.log("length :", len);
    // if(len>0){
    $('#area-2').append('<h5 class="my-2">Responses</h5>')
    // }
    $('#area-2').append(el);
    console.log("for loop---");
    for (let i = 0; i < len; i++) {
        let obj = list[i];
        if (obj.id == currentId) {

            let resp = obj.response;
            let resplen = resp.length;
            console.log($(`#b${currentId}`));
            for (let i = 0; i < resplen; i++) {
                let name = resp[i].name;
                let comment = resp[i].comment;
                el = `
                    <div  class="shadow-sm p-3 mb-3 bg-light rounded border-right border-left border-secondary temp">
                    <strong>Name: ${name}</strong>
                    <br>
                    <i>Comment: ${comment}</i>
                    </div>
                    `;
                $(`#b${currentId}`).append(el);
            }
        }
    }
}
function putInLocalStorage(sub, que, currentId) {
    //creating object
    let obj = {
        id: currentId,
        subject: sub,
        question: que,
        upvote: 0,
        downvote: 0,
        response: []
    }
    let list = localStorage.getItem("data");

    if (list == null) {
        list = []
    }
    else {
        list = JSON.parse(list);
    }
    console.log(list);
    list.push(obj);
    let newList = JSON.stringify(list)
    localStorage.setItem("data", newList);
}