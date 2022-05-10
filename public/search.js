const searchBar = document.getElementById('searchBar');
const list = document.getElementById('nameList');

// function search() {
//     console.log("inside search function")
//     let filter = searchBar.value.toUpperCase();
//     let li = list.getElementsByTagName('li');
//     Loop through all list items, and hide those who don't match the searchBar query
//     for (let i = 0; i < li.length; i++) {
//         let a = li[i].getElementsByTagName("a")[0];
//         let txtValue = a.textContent || a.innerText; 
      
//         if (txtValue.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// }

function search() {
    let filter = searchBar.value.toUpperCase();
    let li = list.getElementsByTagName('a');
    // Loop through all list items, and hide those who don't match the searchBar query
    for (let i = 0; i < li.length; i++) {
        let a = li[i];
        let txtValue = a.textContent || a.innerText; 
        
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

searchBar.onkeyup = search;