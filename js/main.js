// ===== 全局变量 =====
let currentContent = 'home';
let markdownCache = {};

// ===== 页面切换功能 =====
function showContent(contentId) {
    // 更新当前内容ID
    currentContent = contentId;
    
    // 隐藏所有内容
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示选中的内容
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.classList.add('active');
        
        // 检查是否需要加载Markdown内容
        const markdownContainer = selectedContent.querySelector('[data-markdown]');
        if (markdownContainer) {
            const markdownPath = markdownContainer.getAttribute('data-markdown');
            loadMarkdown(markdownPath, markdownContainer);
        }
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0);
    
    // 关闭移动端菜单
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

// ===== Markdown加载功能 =====
async function loadMarkdown(path, container) {
    // 检查缓存
    if (markdownCache[path]) {
        renderMarkdown(markdownCache[path], container);
        return;
    }
    
    // 显示加载动画
    container.innerHTML = `
        <div class="loader"></div>
        <div class="loading-message">正在加载内容...</div>
    `;
    
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        markdownCache[path] = markdown;
        renderMarkdown(markdown, container);
    } catch (error) {
        console.error('Error loading markdown:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>加载内容失败: ${error.message}</p>
                <p>请确保文件路径正确: ${path}</p>
            </div>
        `;
    }
}

// ===== Markdown渲染功能 =====
function renderMarkdown(markdown, container) {
    if (typeof marked !== 'undefined') {
        // 配置marked选项
        marked.setOptions({
            highlight: function(code, lang) {
                // 如果有代码高亮库，可以在这里使用
                return code;
            },
            breaks: true,
            gfm: true
        });
        
        container.innerHTML = marked.parse(markdown);
    } else {
        container.innerHTML = '<div class="error-message">Markdown解析器未加载</div>';
    }
}

// ===== 导航栏滚动效果 =====
function handleScroll() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// ===== 移动端菜单切换 =====
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// ===== 初始化函数 =====
function init() {
    // 添加事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 设置移动端菜单按钮
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 处理导航链接点击
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    // 处理URL hash
    if (window.location.hash) {
        const contentId = window.location.hash.substring(1);
        showContent(contentId);
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', () => {
        const contentId = window.location.hash.substring(1);
        showContent(contentId);
    });
}

// ===== 辅助函数 =====

// 格式化日期
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('zh-CN', options);
}

// 动态加载课程内容
function loadCourseContent(courseCode) {
    const contentPath = `content/courses/${courseCode}.md`;
    const container = document.querySelector(`#${courseCode} .markdown-content`);
    if (container) {
        loadMarkdown(contentPath, container);
    }
}

// 动态加载经验分享内容
function loadExperienceContent(topic) {
    const contentPath = `content/experience/${topic}.md`;
    const container = document.querySelector(`#${topic} .markdown-content`);
    if (container) {
        loadMarkdown(contentPath, container);
    }
}

// ===== 搜索功能（可选） =====
function searchContent(query) {
    // 这里可以实现搜索功能
    console.log('Searching for:', query);
}

// ===== 主题切换功能（可选） =====
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
}

// 加载保存的主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ===== 打字机效果 =====
const typingTexts = [
    "探索计算机图形学的奥秘",
    "深入计算机视觉的世界",
    "掌握图像处理的精髓",
    "创造虚拟现实的未来",
    "与世界顶尖教授共同学习"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 50;
        setTimeout(typeWriter, 2000);
        return;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 100;
    }
    
    setTimeout(typeWriter, typingSpeed);
}

// ===== 数字动画 =====
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                number.textContent = Math.ceil(current);
                setTimeout(updateNumber, 30);
            } else {
                number.textContent = target;
            }
        };
        
        // 使用 Intersection Observer 来触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(number);
    });
}

// ===== 创建粒子效果 =====
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--accent-color)'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 100vh) scale(0);
            }
            10% {
                transform: translate(10vw, 90vh) scale(1);
            }
            20% {
                transform: translate(-10vw, 80vh) scale(1);
            }
            30% {
                transform: translate(10vw, 70vh) scale(1);
            }
            40% {
                transform: translate(-10vw, 60vh) scale(1);
            }
            50% {
                transform: translate(10vw, 50vh) scale(1);
            }
            60% {
                transform: translate(-10vw, 40vh) scale(1);
            }
            70% {
                transform: translate(10vw, 30vh) scale(1);
            }
            80% {
                transform: translate(-10vw, 20vh) scale(1);
            }
            90% {
                transform: translate(10vw, 10vh) scale(1);
            }
            100% {
                transform: translate(0, -10vh) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== 更新初始化函数 =====
function init() {
    // 添加事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 设置移动端菜单按钮
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 处理导航链接点击
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    // 处理URL hash
    if (window.location.hash) {
        const contentId = window.location.hash.substring(1);
        showContent(contentId);
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', () => {
        const contentId = window.location.hash.substring(1);
        showContent(contentId);
    });
    
    // 启动打字机效果
    setTimeout(typeWriter, 1000);
    
    // 启动数字动画
    animateNumbers();
    
    // 创建粒子效果
    createParticles();
    
    // 设置联系弹窗
    setupModalClickOutside();
}

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', init);

// ===== 联系弹窗功能 =====
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 点击弹窗外部关闭
function setupModalClickOutside() {
    const modal = document.getElementById('contactModal');
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeContactModal();
        }
    });
}

// ===== 导出函数供HTML使用 =====
window.showContent = showContent;
window.toggleMobileMenu = toggleMobileMenu;
window.loadCourseContent = loadCourseContent;
window.loadExperienceContent = loadExperienceContent;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;