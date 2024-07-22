function changeIcon(x) {
    document.getElementById("menu").style.width = "250px";
    x.classList.toggle("change");
}

function openClose(x) {
    if(x.classList.contains('change')){
        document.getElementById('menu').style.width = '150px';
    }
    else{
        document.getElementById('menu').style.width = '0';
    }
}

