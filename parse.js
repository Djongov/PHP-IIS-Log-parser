/*
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
*/
function isHidden(el) {
    var style = window.getComputedStyle(el);
    return ((style.display === 'none') || (style.visibility === 'hidden'))
}


function filterTables() {
  const query = q => document.querySelectorAll(q);
  const filters = [...query('th input')].map(e => new RegExp(e.value, 'i'));

  query('tbody tr').forEach(row => row.style.display = 
    filters.every((f, i) => f.test(row.cells[i].textContent)) ? '' : 'none');
    // Count results
    let all = document.getElementsByTagName("tr");
    let count = 0;
    for (var i = 0, max = all.length; i < max; i++) {
        if (isHidden(all[i])) {
            // hidden
        } else { 
            count++;
        }
    }
    document.getElementById("results").innerHTML = count - 1; // -1 because of the thead <tr>. We exclude it from the results
}

const searchInputs = document.getElementsByClassName('searchRequests');

if (searchInputs) {
    for (let i = 0; i < searchInputs.length; i++) {
        searchInputs[i].addEventListener("keyup", filterTables, false);
    }
}

if (document.getElementById("results")) {
    document.getElementById("results").innerHTML = document.getElementsByTagName("tr").length - 1;
}