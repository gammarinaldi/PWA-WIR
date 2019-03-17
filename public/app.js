const apiKey = '07728c4b4c4f40ee8f6b48bfcdc437ee';
const defaultSource = 'wired';
const sourceSelector = document.querySelector('#sources');
const sourceSelector0 = document.querySelector('#link0');
const sourceSelector1 = document.querySelector('#link1');
const sourceSelector2 = document.querySelector('#link2');
const sourceSelector3 = document.querySelector('#link3');
const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker: Registration Success.');
      updateNews(defaultSource);
      updateNews('ign');
      updateNews('mashable');
      updateNews('techcrunch');

      window.onload = () => {
        if(window.location.hash !== '#loaded') {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
      }
      window.onload();
    })
    .catch(err => 'Service Worker: Registration Failed'));
}

window.addEventListener('load', e => {
  //sourceSelector.addEventListener('change', evt => updateNews(defaultSource));
  sourceSelector0.addEventListener('click', evt => updateNews(defaultSource));
  sourceSelector1.addEventListener('click', evt => updateNews('ign'));
  sourceSelector2.addEventListener('click', evt => updateNews('mashable'));
  sourceSelector3.addEventListener('click', evt => updateNews('techcrunch'));

  // updateNewsSources().then(() => {
  //   sourceSelector.value = defaultSource;
  //   updateNews();
  // });
});

window.addEventListener('online', () => {
  console.log('Connection status: Online.');
  // updateNews(defaultSource);
  // updateNews('ign');
  // updateNews('mashable');
  // updateNews('techcrunch');
});

window.addEventListener('offline', () => {
  console.log('Connection status: Offline.');
});

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML =
    json.sources
      .map(source => `<option value="${source.id}">${source.name}</option>`)
      .join('\n');
}

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
  return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}