function filterTable($index) {
    var inputs = document.getElementById('search_' + $index);
    filter = inputs.value.toUpperCase();
    table = document.getElementById("requests-table");
    tr = table.getElementsByTagName("tr");
    var totalResults = 0;
    for (e = 0; e < tr.length; e++) {
        // I am adding this so multiple filters will work
        //if (tr[e].style.display !== "none") {
            td = tr[e].getElementsByTagName("td")[$index];
            if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                totalResults++;
                tr[e].style.display = "";
            } else {
                tr[e].style.display = "none";
            }
        }
        //}
    }
    if (filter) {
        document.getElementsByClassName('result')[$index].innerHTML = 'Results: ' + totalResults;
    } else {
        document.getElementsByClassName('result')[$index].innerHTML = '';
    }
}

const allSearchFields = document.getElementsByClassName('searchRequests');
console.log(allSearchFields.length + ' search fields found');
if (allSearchFields.length > 0) {
    let otherCounter = -1;
    for (var i = 0; i < allSearchFields.length; i++) {
        otherCounter++;
        let currentCounter = otherCounter;
        allSearchFields[i].addEventListener("keyup", function() {filterTable(currentCounter)}, false);
    }
}

function animateToTop() {
    var scrollToTop = window.setInterval(function() {
        var pos = window.pageYOffset;
        if ( pos > 0 ) {
            window.scrollTo( 0, pos - 20 );
        } else {
            window.clearInterval( scrollToTop );
        }
    }, 4); // This controls how fast the animation will go. Lower numbers - faster
}

document.getElementById('scroll-to-top').addEventListener("click", function() {animateToTop()}, false);