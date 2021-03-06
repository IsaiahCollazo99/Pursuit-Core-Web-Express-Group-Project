let userId = sessionStorage.getItem("userId");
let search = document.querySelector("#searchForm");
if(!userId) userId = 1;
let posts = {};
let userFollowing = {};
let games = {};

// Add Make post functionality
// Add show Comments/Likes functionality
// Add Comment/Like functionality
// Change Button styling

let newsFeed = document.querySelector("#newsFeed");
let upcomingGames = document.querySelector("#upcomingGames");
let postForm = document.querySelector("#postForm");

const fetchData = async (url, cb) => {
    try {
        let res = await axios.get(url);
        cb(res.data);
    } catch(err) {
        console.log(err);
    }
} // End of fetchData() function

const getUser = async (data) => {
    userFollowing[data.user.id] = data.user
    await fetchData(`http://localhost:3000/users/${userId}/posts`, getUserPosts);
} // End of getUser() function

const getFollowing = async (data) => {
    let following = data.followings;

    await following.forEach(async (user) => {
        userFollowing[user.id] = user;
        await fetchData(`http://localhost:3000/users/${user.id}/posts`, getUserPosts);
    })
    await populateNewsFeed();
} // End of getFollowing() function

const getUserPosts = async (data) => {
    let userPosts = data.posts;
    await userPosts.forEach((post) => {
        posts[post.id] = post;
    })
} // End of getUserPosts() function

const populateNewsFeed = async () => {
    newsFeed.innerHTML = "<h1>News Feed</h1>";
    for(let key in posts) {
        let post = posts[key];
        let poster = userFollowing[post.poster_id];

        let postSection = document.createElement("section");
        postSection.className = "postSection";
        postSection.id = post.id;

        let postSectionTop = document.createElement("section");
        postSectionTop.className = "postTop";

        let postUser = document.createElement("a");
        postUser.innerText = poster.full_name;
        postUser.className = "poster";
        postUser.href = "./pages/userProfile/userProfile.html";
        postSectionTop.appendChild(postUser);

        if(Number(userId) === poster.id) {
            let postButtons = document.createElement("section");
            postButtons.className = "postButtons";

            let editButton = document.createElement("button");
            editButton.innerText = "edit";
            editButton.onclick = editPost;

            let deleteButton = document.createElement("button");
            deleteButton.innerText = "delete";
            deleteButton.onclick = deletePost;

            postButtons.appendChild(editButton);
            postButtons.appendChild(deleteButton)

            postSectionTop.appendChild(postButtons);
        }

        postSection.appendChild(postSectionTop);
        let postSectionBott = document.createElement("section");
        postSectionBott.className = "postBottom";

        let postBody = document.createElement("p");
        postBody.innerText = post.body;
        postBody.classname = "postBody";
        postSectionBott.appendChild(postBody);

        let commentsButton = document.createElement("button");
        commentsButton.innerText = "Comments";
        commentsButton.onclick = showComments;
        commentsButton.className = "commentsButton"
        postSectionBott.appendChild(commentsButton);

        let likesButton = document.createElement("button");
        likesButton.innerText = "Likes";
        likesButton.onclick = showLikes;
        likesButton.className = "likesButton";
        postSectionBott.appendChild(likesButton);

        postSection.appendChild(postSectionBott);
        newsFeed.appendChild(postSection);
    }
} // End of populateNewsFeed() function

const populateUpcomingGames = async (data) => {
    data.forEach(event => {
        let section = document.createElement("section");
        section.className = "upcomingSection";
        let h3 = document.createElement("h3");
        h3.innerHTML = `${event.teams[0].name} <span style="color:#FDB927">VS.</span> ${event.teams[1].name}`;
        section.appendChild(h3);
        upcomingGames.appendChild(section);
        games[event.event_id] = event.teams;
    })
} // End of populateUpcomingGames() function

const makePost = async (e) => {
    e.preventDefault();
    let body = e.target.children[0].value;
    try {
        let res = await axios.post("http://localhost:3000/posts", {poster_id: userId, body, creation_date: new Date().toString()});
        let post = res.data.data;
        posts[post.id] = post;
        populateNewsFeed();
        e.target.children[0].value = "";
    } catch(err) {
        console.log(err);
    }
} // End of makePost() function

const submitPostEdit = async (e) => {
    e.preventDefault();
    let form = e.target;
    let editedBody = form.children[0].value;
    let postId = form.parentNode.parentNode.id;
    try {
        let res = await axios.patch("http://localhost:3000/posts/" + postId, {body: editedBody});
        let newBody = document.createElement("p");
        newBody.className = "postBody";
        newBody.innerText = editedBody;
        form.parentNode.replaceChild(newBody, form);
    } catch(err) {
        console.log(err);
    }
} // End of submitPostEdit() function

const editPost = (e) => {
    let postBody = e.target.parentNode.parentNode.parentNode.children[1].children[0];
    let editPostForm = document.createElement("form");

    let editPostInput = document.createElement("input");
    editPostInput.type = "text";
    editPostInput.class = "editPostInput";
    editPostInput.value = postBody.innerText;
    editPostForm.appendChild(editPostInput);

    let editPostSubmit = document.createElement("input");
    editPostSubmit.type = "submit";
    editPostSubmit.class = "editPostSubmit";
    editPostForm.appendChild(editPostSubmit);

    postBody.parentNode.replaceChild(editPostForm, postBody);

    editPostForm.addEventListener("submit", submitPostEdit);
} // End of editPost() function

const deletePost = async (e) => {
    let post = e.target.parentNode.parentNode.parentNode;
    try {
        let res = await axios.delete("http://localhost:3000/posts/" + post.id);
        delete posts[post.id];
        populateNewsFeed();
    } catch(err) {
        console.log(err);
    }
} // End of deletePost() function

const showComments = (e) => {

} // End of showComments() function

const showLikes = (e) => {

} // End of showLikes() function

const addComment = (e) => {
    e.preventDefault()
    let addComment = e.target.children[0].value;
    let p = document.createElement("p");
    p.innerText = addComment
} // End of addComment() function

const setupPage = async () => {
    await fetchData("http://localhost:3000/users/" + userId, getUser);
    await fetchData("http://localhost:3000/users/" + userId + "/followings", getFollowing);
    await fetchData("http://localhost:3000/events", populateUpcomingGames);
    await populateNewsFeed();
} // End of setupPage() function

setupPage()

search.addEventListener("submit", (e => {
    e.preventDefault();
    sessionStorage.setItem("userQuery", e.target.children[0].value);
    window.location.href = "./pages/searchResults/searchResults.html";
})) // End of search event listener

postForm.addEventListener("submit", makePost);