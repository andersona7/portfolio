document.addEventListener("DOMContentLoaded", () => {

    // 1. REMOVE LOADER
    setTimeout(() => {
        const loader = document.querySelector('.loader-wrapper');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 1000);
        }
    }, 1500);

    // 2. LENIS SMOOTH SCROLL SETUP (Premium fluid scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. AI HALO MAGNETISM (High-performance cursor trail)
    if (typeof gsap !== 'undefined') {
        // Create the sleek "AI Core" trailing dot dynamically
        const aiTrail = document.createElement('div');
        aiTrail.className = 'ai-trail-core';
        document.body.appendChild(aiTrail);

        // Inject specific styles for the dot dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            .ai-trail-core {
                width: 6px; height: 6px; background: #fff;
                border-radius: 50%; position: fixed;
                pointer-events: none; z-index: 10000;
                opacity: 0.6; mix-blend-mode: difference;
                transition: opacity 0.3s, transform 0.3s;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(style);

        // Track mouse position globally
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Use GSAP ticker for ultra-smooth trailing effect (lerping)
        gsap.ticker.add(() => {
            gsap.to(aiTrail, {
                duration: 0.15, // Snappy lag
                x: mouseX,
                y: mouseY,
                ease: "power2.out"
            });
        });

        // Handle Magnetism Interactions
        const magnetics = document.querySelectorAll('.btn, .social-card, .nav-links a, .timeline-item');
        magnetics.forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Hide the trailing dot so it looks like it "merged" with the button
                gsap.to(aiTrail, { opacity: 0, scale: 3, duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                // Restore the trailing dot
                gsap.to(aiTrail, { opacity: 0.6, scale: 1, duration: 0.2 });
            });
        });
    }

    // 4. GSAP SCROLL ANIMATIONS
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero text fade in
        gsap.from(".fade-up", {
            y: 40, opacity: 0, duration: 1, stagger: 0.2, delay: 1.5, ease: "power3.out"
        });

        // Glass cards fade in on scroll
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: "top 85%" },
                y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
            });
        });
    }

    // 5. PARTICLES.JS BACKGROUND CONFIGURATION
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#5e6ad2" },
                shape: { type: "circle" },
                opacity: { value: 0.2, random: false },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 150, color: "#5e6ad2", opacity: 0.1, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } } }
            },
            retina_detect: true
        });
    }

    // 6. INTERACTIVE TERMINAL LOGIC
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('terminal-body');

    if (termInput && termBody) {
        const commands = {
            'help': 'Available commands: <br> - <span class="cmd-highlight">whoami</span><br> - <span class="cmd-highlight">skills</span><br> - <span class="cmd-highlight">projects</span><br> - <span class="cmd-highlight">future</span><br> - <span class="cmd-highlight">contact</span><br> - <span class="cmd-highlight">clear</span>',
            'whoami': 'Anderson A. - CS Engineering student & Full Stack AI Developer.',
            'skills': 'React, Node.js, Express, MongoDB, PostgreSQL, Python, Gen AI, Prompt Engineering.',
            'projects': '1. LeadFlow CRM <br>2. Super Task Maestro',
            'future': 'Building Agentic Workflows and integrating Intelligence into scalable SaaS products.',
            'contact': 'Email: anderson883858@gmail.com | GitHub: @andersona7',
        };

        // Ensure the terminal stays focused when clicked anywhere inside
        document.querySelector('.terminal-window').addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const val = this.value.trim().toLowerCase();
                this.value = '';

                // Append user input
                const inputLine = document.createElement('p');
                inputLine.innerHTML = `<span class="prompt">$</span> ${val}`;
                termBody.appendChild(inputLine);

                // Handle command execution
                if (val === 'clear') {
                    termBody.innerHTML = '';
                } else if (commands[val]) {
                    const responseLine = document.createElement('p');
                    responseLine.innerHTML = commands[val];
                    responseLine.style.color = '#e5c07b';
                    termBody.appendChild(responseLine);
                } else if (val !== '') {
                    const errLine = document.createElement('p');
                    errLine.innerHTML = `Command not found: ${val}. Type 'help' for options.`;
                    errLine.style.color = '#ff5f56';
                    termBody.appendChild(errLine);
                }

                // Auto-scroll to bottom of terminal
                termBody.scrollTop = termBody.scrollHeight;
            }
        });
    }


    // ==========================================================================
//   GITHUB API INTEGRATION
// ==========================================================================

async function loadGitHubData(username) {
    try {
        // 1. Fetch profile stats
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!profileResponse.ok) {
            throw new Error(`GitHub user not found: ${profileResponse.status}`);
        }

        const profile = await profileResponse.json();
        
        // Update Stats UI
        const statsEl = document.getElementById("gh-stats");
        if (statsEl) {
            statsEl.innerHTML = `
                <span><strong>${profile.public_repos}</strong> Repos</span>
                <span><strong>${profile.followers}</strong> Followers</span>
            `;
        }

        // 2. Fetch recent activity
        const activityResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
        
        if (activityResponse.ok) {
            const events = await activityResponse.json();
            displayActivity(events);
        }

    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        const container = document.getElementById("github-activity-container");
        if(container) {
            container.innerHTML = `<li style="color: #ff5f56;">Connection to GitHub API failed.</li>`;
        }
    }
}

function displayActivity(events) {
    const container = document.getElementById("github-activity-container");
    if (!container) return;

    container.innerHTML = "";
    
    // Filter out bots and get top 6 events
    const recentEvents = events.filter(e => e.type !== "IssueCommentEvent").slice(0, 6);

    if (!recentEvents.length) {
        container.innerHTML = "<li>No recent public activity found.</li>";
        return;
    }

    recentEvents.forEach(event => {
        const listItem = document.createElement("li");
        listItem.className = "activity-item";
        
        // Remove 'username/' from the repo name for cleaner display
        const cleanRepoName = event.repo.name.split('/').pop();
        
        let iconHtml = '<i class="fa-solid fa-code-commit activity-icon"></i>';
        let contentHtml = '';

        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits?.length || 1;
                const commitMsg = event.payload.commits?.[0]?.message.split('\n')[0] || 'Updated code';
                iconHtml = '<i class="fa-solid fa-code-branch activity-icon"></i>';
                contentHtml = `
                    <div>
                        Pushed ${commitCount} commit(s) to <span class="repo-name">${cleanRepoName}</span><br>
                        <span class="commit-msg">"${commitMsg}"</span>
                    </div>
                `;
                break;

            case "IssuesEvent":
                iconHtml = '<i class="fa-solid fa-circle-exclamation activity-icon" style="color: #ffbd2e;"></i>';
                contentHtml = `
                    <div>
                        ${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in <span class="repo-name">${cleanRepoName}</span>
                    </div>
                `;
                break;

            case "PullRequestEvent":
                iconHtml = '<i class="fa-solid fa-code-pull-request activity-icon" style="color: #c678dd;"></i>';
                contentHtml = `
                    <div>
                        ${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} a pull request in <span class="repo-name">${cleanRepoName}</span>
                    </div>
                `;
                break;

            case "WatchEvent":
                iconHtml = '<i class="fa-solid fa-star activity-icon" style="color: #e5c07b;"></i>';
                contentHtml = `
                    <div>
                        Starred <span class="repo-name">${cleanRepoName}</span>
                    </div>
                `;
                break;
                
            case "CreateEvent":
                iconHtml = '<i class="fa-solid fa-folder-plus activity-icon" style="color: #56b6c2;"></i>';
                contentHtml = `
                    <div>
                        Created a new ${event.payload.ref_type} in <span class="repo-name">${cleanRepoName}</span>
                    </div>
                `;
                break;

            default:
                const cleanType = event.type.replace("Event", "");
                contentHtml = `
                    <div>
                        Performed a ${cleanType} on <span class="repo-name">${cleanRepoName}</span>
                    </div>
                `;
        }

        listItem.innerHTML = `${iconHtml} ${contentHtml}`;
        container.appendChild(listItem);
    });
}

// Initialize the fetch
loadGitHubData("andersona7");

    // 7. GITHUB MOCK FETCH (Simulating API call for speed/stability)


    // 8. RESUME DOWNLOAD TRACKING (Optional Analytics)
    const resumeBtn = document.querySelector('.btn-secondary');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            console.log("Resume downloaded or viewed by recruiter.");
            // Example GA tag: gtag('event', 'download', { 'event_category': 'Resume' });
        });
    }

});