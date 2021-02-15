
function addNewMeme(meme) {
    const item = "<li id='edit-btn' class='card'><img class='card-image' src=" + meme.url + "/>" 
    + "<h2>" + meme.name + "</h2><p>" + meme.caption + "</p>" + 
    "<a href='https://mymeme.herokuapp.com/edit/" + meme.id + "' type='button' class='btn btn-primary'" + 
    " >Edit</a></li>";
    $("ul").append(item);
};


const getData = () => {
    $('.list').empty();
    axios.get('https://mymeme.herokuapp.com/memes')
    .then(response => {
        const memes = response.data;
        for(let i = memes.length-1; i >= 0; i--){
            addNewMeme(memes[i]);
        }
    })
    .catch(err => {
        console.log(err);
    });
};

//window.onload = getData;

const postData = () => {
    let username = document.getElementById('name').value;
    let caption = document.getElementById('caption').value;
    let url = document.getElementById('url').value;
    if(username.length < 2 || caption.length < 2 || url.length < 2){
        $('#message').text("Not a valid entry for meme");
        return;
    }
    axios.post('https://mymeme.herokuapp.com/memes', {
        'name': username,
        'caption': caption,
        'url': url
    })
    .then(response => {
        $('#message').text("One meme created");
        
    })
    .catch(err => {
        console.log(err);
    });
    document.getElementById('name').value = " ";
    document.getElementById('caption').value = " ";
    document.getElementById('url').value = " ";
    getData();
};

//GET ALL THE MEMES
$(function() {
    getData();
});

//TO CREATE A MEME
const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', postData);
