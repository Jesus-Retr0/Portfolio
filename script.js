console.log("Hey! Welcome to my portfolio!")

fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.getElementById('projects-container');
    projects.forEach(project => {
      const article = document.createElement('article');
      article.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.url}" target="_blank">View on GitHub</a>
      `;
      container.appendChild(article);
    });
  })
  .catch(error => {
    console.error('Error loading projects:', error);
  });