const baseUrl = 'https://saro-dev.github.io/blogweb.github.io';
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === `${baseUrl}/index.html`)) {
      const form = document.getElementById('post-form');
      const postsContainer = document.getElementById('posts');
  
      form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').files[0];
        const video = document.getElementById('video').value;
  
        const reader = new FileReader();
        reader.onload = function() {
          const imageDataUrl = reader.result;
  
          const post = {
            title: title,
            description: description,
            image: imageDataUrl,
            video: video
          };
  
          let posts = [];
  
          if (localStorage.getItem('posts')) {
            posts = JSON.parse(localStorage.getItem('posts'));
          }
  
          posts.push(post);
          localStorage.setItem('posts', JSON.stringify(posts));
  
          renderPosts();
          form.reset();
        };
  
        if (image) {
          reader.readAsDataURL(image);
        }
      });
  
      function renderPosts() {
        postsContainer.innerHTML = '';
  
        let posts = [];
  
        if (localStorage.getItem('posts')) {
          posts = JSON.parse(localStorage.getItem('posts'));
        }
  
        posts.forEach(function(post, index) {
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
            imageDiv.classList.add('cover');
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
          deleteButton.addEventListener('click', function() {
            deletePost(index);
          });
          postElement.appendChild(deleteButton);
  
          postsContainer.appendChild(postElement);
        });
      }
  
      function deletePost(index) {
        let posts = [];
  
        if (localStorage.getItem('posts')) {
          posts = JSON.parse(localStorage.getItem('posts'));
        }
  
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
  
        renderPosts();
      }
  
      renderPosts();
    } else if (window.location.pathname.includes(`${baseUrl}/post.html`)) {
      const postDetailsContainer = document.getElementById('post-details');
      const deleteButton = document.getElementById('delete-button');
      
  
      const postId = new URLSearchParams(window.location.search).get('id');
  
      let posts = [];
  
      if (localStorage.getItem('posts')) {
        posts = JSON.parse(localStorage.getItem('posts'));
      }
  
      const post = posts[postId];
  
      if (post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
  
        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);
  
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = post.description;
        postElement.appendChild(descriptionElement);
  
        if (post.image) {
          const imageElement = document.createElement('img');
          imageElement.src = post.image;
          postElement.appendChild(imageElement);
        }
  
        postDetailsContainer.appendChild(postElement);
  
        deleteButton.addEventListener('click', function() {
          deletePost(postId);
        });
        
      }
    }
  });
  

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      document.getElementById('scrollToTopButton').classList.add('show');
    } else {
      document.getElementById('scrollToTopButton').classList.remove('show');
    }
  });
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
