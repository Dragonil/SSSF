const xhr = new XMLHttpRequest()


function updateCat(){
    var form = document.getElementById('details').elements
    var formData = new FormData(document.getElementById('details'))
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert('updated')
        }
    }
    xhr.open('PATCH', window.location.origin + '/cat')
    xhr.send(JSON.stringify({_id: form.namedItem("id").value,
                            Name: form.namedItem("Name").value}))
}


function deleteCat(){
    var id = document.getElementById('details').elements.namedItem("id").value
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert('Cat Deleted')
        }
    }
    xhr.open('DELETE', window.location.origin + '/cat?id='+id)
    xhr.send()
}


function getCat(){
    var urlParams = new URLSearchParams(window.location.search);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var image = document.getElementById('image')
            var form = document.getElementById('details').elements
            const cat = JSON.parse(xhr.responseText)[0]
            console.log(cat)
            image.src = cat.ImgLink
            form.namedItem("Name").value  = cat.Name 
            form.namedItem("Gender").value  = cat.Gender 
            form.namedItem("Age").value  = cat.Age
            form.namedItem("Color").value  = cat.Color
            form.namedItem("Weight").value  = cat.Weight
            form.namedItem("ImgLink").value  = cat.ImgLink   
            form.namedItem("id").value  = cat._id               
                                
                                
            
           console.log(xhr.responseText)
        }
    }
    xhr.open('GET', window.location.origin + '/cat?id='+ urlParams.get('id'))
    xhr.send()
}


function getCats(search){
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var display = document.getElementById('elements')
            display.innerHTML = ''
            const cats = JSON.parse(xhr.responseText)
            console.log(cats)
            for(var i in cats){
                console.log
                display.innerHTML += 
                    `<a href="/details.html?id=${cats[i]._id}">
                        <div class="imgBox">
                            <img class="image" src="${cats[i].ImgLink}" height="200" alt="Image not found" />
                            <p ><b>${cats[i].Name}</b></p>
                            <p >${cats[i].Gender}</p>
                        </div>
                    </a>`
            }
           console.log(xhr.responseText)
        }
    }
    if (search){
        var url = '/cat?Name=' + search
    }else{
        var url = '/cat'
    }
    xhr.open('GET', window.location.origin + url )
    xhr.send()
}
