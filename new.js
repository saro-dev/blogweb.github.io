// Check if local storage is available
function isLocalStorageAvailable() {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Save posts to local storage
function savePostsToLocalStorage(posts) {
  if (isLocalStorageAvailable()) {
    localStorage.setItem('posts', JSON.stringify(posts));
  }
}

// Get posts from local storage
function getPostsFromLocalStorage() {
  if (isLocalStorageAvailable()) {
    const storedPosts = localStorage.getItem('posts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  }
  return [];
}

// Create a new post
function createPost(title, description, image, video) {
  const post = {
    title: title,
    description: description,
    image: image,
    video: video
  };
  return post;
}

// Add a new post
function addPost(title, description, image, video) {
  const posts = getPostsFromLocalStorage();
  const post = createPost(title, description, image, video);
  posts.push(post);
  savePostsToLocalStorage(posts);
}

// Delete a post
function deletePost(index) {
  const posts = getPostsFromLocalStorage();
  posts.splice(index, 1);
  savePostsToLocalStorage(posts);
  displayPosts();
}

// Display the posts on the index.html page
function displayPosts() {
  const posts = getPostsFromLocalStorage();
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postElement = createPostElement(post, i);
    postsContainer.appendChild(postElement);
  }
}

// Create a post element
function createPostElement(post, index) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');

  const titleElement = document.createElement('h2');
  titleElement.textContent = post.title;
  postElement.appendChild(titleElement);

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = post.description.substring(0, 80) + '...';
  postElement.appendChild(descriptionElement);

  if (post.image) {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-div');
    imageDiv.style.backgroundImage = `url(${post.image})`;
    postElement.appendChild(imageDiv);
  }

  const readMoreElement = document.createElement('a');
  readMoreElement.classList.add('read-more');
  readMoreElement.href = 'post.html?id=' + index;
  readMoreElement.textContent = 'Read More';
  postElement.appendChild(readMoreElement);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function () {
    deletePost(index);
  });
  postElement.appendChild(deleteButton);

  return postElement;
}
// Display the full post on the post.html page
function displayFullPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (postId !== null) {
    const posts = getPostsFromLocalStorage();

    if (postId >= 0 && postId < posts.length) {
      const post = posts[postId];
      const postContainer = document.getElementById('post-container');
      postContainer.innerHTML = '';

      const titleElement = document.createElement('h2');
      titleElement.textContent = post.title;
      postContainer.appendChild(titleElement);

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = post.description;
      postContainer.appendChild(descriptionElement);

      if (post.image) {
        const imageElement = document.createElement('img');
        imageElement.src = post.image;
        postContainer.appendChild(imageElement);
      }

      if (post.video) {
        const videoElement = document.createElement('video');
        videoElement.src = post.video;
        videoElement.controls = true;
        postContainer.appendChild(videoElement);
      }

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        deletePost(postId);
      });
      postContainer.appendChild(deleteButton);
    }
  }
}


// Event listener for submitting a new post
const form = document.getElementById('post-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const image = document.getElementById('image').value;
  const video = document.getElementById('video').value;

  addPost(title, description, image, video);
  form.reset();
  displayPosts();
});

// Check the current page and execute corresponding code
if (window.location.pathname === '/blogweb.github.io/' || window.location.pathname === '/blogweb.github.io/index.html') {
  displayPosts();
} else if (window.location.pathname.includes('/blogweb.github.io/post.html')) {
  displayFullPost();
}
