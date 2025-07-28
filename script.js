console.log('HI!!!! So you know how to check console logs! :)');

// Render Experience Section
function renderExperience(experiences) {
    const container = document.getElementById('experience-container');
    if (!container) return;
    container.innerHTML = '';
    experiences.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <h3>${exp.title}</h3>
            <a target="_blank" href="${exp.companyUrl}">${exp.company}</a>
            <span>${exp.period}</span>
            <ul>
                ${exp.details.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        container.appendChild(div);
    });
}

// Render Projects Section
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';
    projects.forEach(proj => {
        const article = document.createElement('article');
        article.className = 'project-item';
        article.innerHTML = `
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            ${proj.url ? `<a href="${proj.url}" target="_blank">View Project</a>` : ''}
        `;
        container.appendChild(article);
    });
}

//Get year from date
function getCopyRightYear() {
    const date = new Date();
    return date.getFullYear();
}

// Fetch and render both sections on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('experience.json')
        .then(res => res.json())
        .then(renderExperience);

    fetch('projects.json')
        .then(res => res.json())
        .then(renderProjects);
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.textContent = `© ${getCopyRightYear()} Jesus De La Paz. All rights reserved.`;
    }
});