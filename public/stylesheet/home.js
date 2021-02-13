
$(function() {
    getData();
});

const submitBtn = document.getElementById('submit');

function addNewMeme(meme) {
    const item = "<li class='card'><a class='card-description' href='#'><img class='card-image' src=" + meme.url + "/>" 
    + "<h2>" + meme.name + "</h2><p>" + meme.caption + "</p></a></li>";
    $("ul").append(item);
};
const getData = () => {
    $('.list').empty();
    axios.get('http://localhost:3000/memes')
    .then(response => {
        const memes = response.data;
        for(let i = memes.length-1; i >= 0; i--){
            console.log(memes[i]);
            addNewMeme(memes[i]);

        }
        console.log(response);
    })
    .catch(err => {
        console.log(err);
    });
};

//window.onload = getData;

const postData = () => {
    const username = document.getElementById('name').value;
    const caption = document.getElementById('caption').value;
    const url = document.getElementById('url').value;
    if(username.length < 2 || caption.length < 2 || url.length < 2){
        $('#message').text("Not a valid entry for meme");
        return;
    }
    //console.log(name, caption, url);
    const formData = new FormData();
    formData.append('name', username);
    formData.append('caption', caption);
    formData.append('url', url);

    axios.post('http://localhost:3000/memes', {
        'name': username,
        'caption': caption,
        'url': url
    })
    .then(response => {
        console.log(response);
        $('#message').text("One meme created");
        getData();
    })
    .catch(err => {
        console.log(err);
    });
    
};

submitBtn.addEventListener('click', postData);
