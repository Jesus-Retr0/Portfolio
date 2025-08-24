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
                    <span>${edu.year} | ${timeBetweenDates(edu.startDate, edu.endDate)}</span>
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

function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    container.className = 'skills-badges';
    if (!container) return;
    container.innerHTML = '';

    skillsData.forEach(skillCategory => {
        for (const category in skillCategory) {
            const section = document.createElement('div');
            section.className = 'skill-category';
            const title = document.createElement('h3');
            title.textContent = category;
            section.appendChild(title);

            const skillList = document.createElement('div');

            skillCategory[category].forEach(skill => {
                const skillDiv = document.createElement('a');
                skillDiv.href = skill.url;
                skillDiv.target = '_blank';
                skillDiv.innerHTML = `
                        <img src="${skill.img}" alt="${skill.name}" />
                `;
                skillList.appendChild(skillDiv);
            });

            section.appendChild(skillList);
            container.appendChild(section);
        }
    });
}

//Get year from date
function getCopyRightYear() {
    const date = new Date();
    return date.getFullYear();
}

// Helper for wrapping text and handling page breaks
function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
    const lines = doc.splitTextToSize(text, maxWidth);
    const pageHeight = doc.internal.pageSize.getHeight();
    lines.forEach(line => {
        if (y > pageHeight - 15) {
            doc.addPage();
            y = 15;
        }
        doc.text(line, x, y);
        y += lineHeight;
    });
    return y;
}

document.getElementById('download-resume').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Fetch JSON data
    const [experienceData, projects, eduCerts] = await Promise.all([
        fetch('experience.json').then(res => res.json()),
        fetch('projects.json').then(res => res.json()),
        fetch('edu-certs.json').then(res => res.json())
    ]);
    const experience = experienceData.Work;
    const skills = experienceData.Skills;

    let y = 18;
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 7;

    // Centered, colored title
    doc.setFontSize(22);
    doc.setTextColor(13, 71, 161); // Darker Blue
    const title = "Jesus De La Paz - Resume";
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, y);
    y += 6;
    doc.setDrawColor(13, 71, 161); // Darker Blue
    doc.setLineWidth(1.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Section: Education
    y += 4;
    doc.setFontSize(15);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("EDUCATION", margin, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);

    if (eduCerts[0] && eduCerts[0].Education) {
        eduCerts[0].Education.forEach(edu => {
            // Left: edu.name, Right: edu.year
            doc.setFontSize(11);
            doc.setTextColor(0,0,0);
            const nameX = margin + 2;
            const yearText = `${edu.year}`;
            const yearWidth = doc.getTextWidth(yearText);
            const yearX = pageWidth - margin - yearWidth;
            doc.text(edu.name, nameX, y);
            doc.text(yearText, yearX, y);
            y += lineHeight;
            y = addWrappedText(doc, edu.details, margin + 8, y, contentWidth - 8, lineHeight);
            y += 2;
        });
    }

    // Section: Certifications
    y += 4;
    doc.setFontSize(15);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("CERTIFICATIONS", margin, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);

    if (eduCerts[0] && eduCerts[0].Certifications) {
        eduCerts[0].Certifications.forEach(cert => {
            // Left: cert.name, Right: cert.year (far right)
            const certNameX = margin + 2;
            const certYearText = cert.year ? `${cert.year}` : '';
            const certYearWidth = doc.getTextWidth(certYearText);
            const certYearX = pageWidth - margin - certYearWidth;
            doc.text(cert.name, certNameX, y);
            if (certYearText) {
                doc.text(certYearText, certYearX, y);
            }
            y += lineHeight;

            // Detect and render clickable link if present in details
            const linkMatch = cert.details.match(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
            if (linkMatch) {
                // Text before the link
                const beforeLink = cert.details.split(linkMatch[0])[0].replace(/<[^>]*>?/gm, '');
                if (beforeLink.trim()) {
                    y = addWrappedText(doc, beforeLink.trim(), margin + 8, y, contentWidth - 8, lineHeight);
                }
                // The link itself
                doc.setTextColor(33, 150, 243); // Blue for link
                doc.textWithLink(linkMatch[2], margin + 8, y, { url: linkMatch[1] });
                doc.setTextColor(0,0,0); // Reset color
                y += lineHeight;
            } else {
                // No link, just plain text
                y = addWrappedText(doc, cert.details.replace(/<[^>]*>?/gm, ''), margin + 8, y, contentWidth - 8, lineHeight);
            }
            y += 2;
        });
    }

    // Section: Experience
    y += 4;
    doc.setFontSize(15);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("EXPERIENCE", margin, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);

    experience.forEach(exp => {
        // Left: exp.title at exp.company, Right: exp.period (no parentheses)
        const expText = `${exp.title} at ${exp.company}`;
        const periodText = exp.period;
        const periodWidth = doc.getTextWidth(periodText);
        const periodX = pageWidth - margin - periodWidth;
        doc.text(expText, margin + 2, y);
        doc.text(periodText, periodX, y);
        y += lineHeight;
        exp.details.forEach(detail => {
            y = addWrappedText(doc, `- ${detail}`, margin + 8, y, contentWidth - 8, lineHeight);
        });
        y += 2;
    });

    // Section: Projects
    y += 4;
    doc.setFontSize(15);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("PROJECTS", margin, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);

    projects.forEach(proj => {
        y = addWrappedText(doc, `${proj.title}`, margin + 2, y, contentWidth - 4, lineHeight);
        y = addWrappedText(doc, proj.description, margin + 8, y, contentWidth - 8, lineHeight);
        y += 2;
    });

     // Section: Skills
    doc.setFontSize(15);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("SKILLS", margin, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);

    // List skills by name
    if (skills && Array.isArray(skills)) {
        skills.forEach(skillCategory => {
            for (const category in skillCategory) {
                const skillNames = skillCategory[category]
                    .map(skill => skill.name ? skill.name : '')
                    .filter(name => name)
                    .join(', ');
                if (skillNames) {
                    y = addWrappedText(doc, `${category}: ${skillNames}`, margin + 2, y, contentWidth - 4, lineHeight);
                    y += 1;
                }
            }
        });
    }

    doc.save("Resume - Jesus De La Paz.pdf");
});

// Fetch and render both sections on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('experience.json')
        .then(res => res.json())
        .then(data => renderExperience(data.Work));
    
    fetch('experience.json')
        .then(res => res.json())
        .then(data => renderSkills(data.Skills));

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