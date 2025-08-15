console.log('HI!!!! So you know how to check console logs! :)');

function timeBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    if (endDate === 'Present') {
        endDate = new Date(); // Use current date if 'Present'
    }
    else{
        endDate = new Date(endDate);
        if (isNaN(endDate.getTime())) {
            console.error('Invalid end date:', endDate);
            return 'Invalid date';
        }
    }
    const end = new Date(endDate);
    const diff = end - start; // Difference in milliseconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return `${years} years, ${months} months`;
}

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
            <span>${exp.period} | ${timeBetweenDates(exp.startDate, exp.endDate)}</span>
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

// Render Education and Certifications Section
function renderEducationCerts(data) {
    const educationContainer = document.getElementById('education-container');
    const certificationsContainer = document.getElementById('certifications-container');
    
    if (!educationContainer || !certificationsContainer) return;
    educationContainer.innerHTML = '';
    certificationsContainer.innerHTML = '';
    
    data.forEach(item => {
        if (item.Education) {
            item.Education.forEach(edu => {
                const div = document.createElement('div');
                div.className = 'education-item';
                div.innerHTML = `
                    <h3>${edu.name}</h3>
                    <span>${edu.year}</span>
                    <p>${edu.details}</p>
                `;
                educationContainer.appendChild(div);
            }
        );
        }
        if (item.Certifications) {
            item.Certifications.forEach(cert => {
                const div = document.createElement('div');
                div.className = 'certification-item';
                div.innerHTML = `
                    <h3>${cert.name}</h3>
                    <span>${cert.year}</span>
                    <p>${cert.details}</p>
                `;
                certificationsContainer.appendChild(div);
            }
        );
        }
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
    
    fetch('edu-certs.json')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                renderEducationCerts(data);
            } else {
                console.error('Invalid data format for education and certifications');
            }
        })
        .catch(err => console.error('Error fetching education and certifications:', err));

    // Update footer with current year
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.textContent = `© ${getCopyRightYear()} Jesus De La Paz. All rights reserved.`;
    }
});