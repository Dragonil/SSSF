const xhr = new XMLHttpRequest()

const formToJSON = elements => [].reduce.call(elements, (data, element) => {

    data[element.name] = element.value;
    return data;
  
  }, {});

function updateCat(){
    var form = document.getElementById('details').elements
    var formData = formToJSON(document.getElementById('details'))
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert('updated')
        }
    }
    console.log(JSON.stringify(formData))
    xhr.open('PATCH', window.location.origin + '/cat')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(formData))
}


function deleteCat(){
    var id = document.getElementById('details').elements.namedItem("id").value
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert('Cat Deleted')
            window.location.href = window.location.origin
            
        }
    }
    xhr.open('DELETE', window.location.origin + '/cat?id='+id)
    xhr.send()
}

