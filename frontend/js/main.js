/**
 * main.js — Controller 層（index.html）
 * 協調 api.js（Model）與 ui.js（View），管理頁面滾動邏輯
 */

let currentSection = 0
let isAnimating = false

const container    = document.getElementById('scroll-container')
const sections     = document.querySelectorAll('section')
const totalSections = sections.length
const navDots      = document.querySelectorAll('.nav-dot')
const pageIndicator = document.getElementById('page-indicator')

// ── 載入作品資料 ──
async function loadProjects() {
    try {
        const projects = await api.getProjects()
        projects.slice(0, 2).forEach((project, i) => ui.renderProject(project, i))
    } catch (err) {
        ui.showError('無法載入作品資料')
    }
}

// ── 頁面切換 ──
function goToSection(index) {
    if (index < 0 || index >= totalSections || isAnimating) return
    isAnimating = true
    currentSection = index
    container.style.transform = `translateY(-${currentSection * 100}vh)`
    updateUI()
    setTimeout(() => { isAnimating = false }, 1200)
}

function updateUI() {
    pageIndicator.innerText = `0${currentSection + 1} / 0${totalSections}`
    navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSection))
    sections.forEach((sec, idx) => sec.classList.toggle('active', idx === currentSection))
}

// ── 事件監聽 ──
window.addEventListener('wheel', (e) => {
    if (isAnimating) return
    if (e.deltaY > 50)  goToSection(currentSection + 1)
    else if (e.deltaY < -50) goToSection(currentSection - 1)
})

let touchStartY = 0
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY }, { passive: false })
window.addEventListener('touchmove',  (e) => { e.preventDefault() }, { passive: false })
window.addEventListener('touchend',   (e) => {
    if (isAnimating) return
    const distance = touchStartY - e.changedTouches[0].clientY
    if (distance > 50)  goToSection(currentSection + 1)
    else if (distance < -50) goToSection(currentSection - 1)
})

navDots.forEach(dot => {
    dot.addEventListener('click', (e) => goToSection(parseInt(e.target.getAttribute('data-index'))))
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSection(currentSection + 1)
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') goToSection(currentSection - 1)
})

// ── 初始化 ──
updateUI()
loadProjects()
