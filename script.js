import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://evbyxjaqkkorichorqna.supabase.co'
const supabaseKey = 'sb_publishable_zz6Sxa8N-Sn-n7Vpyc53_Q_EscuoDMb'
const supabase = createClient(supabaseUrl, supabaseKey)

const STORAGE_KEY = 'cute-diary-entries-v4';
const IDEAS_KEY = 'cute-diary-ideas-v2';
const TASKS_KEY = 'cute-diary-tasks-v2';
const LOGIN_NAME = '戴静雯';
const OWNER_EMAIL = 'ryan428516@gmail.com';
const SECRET_NAME = 'douko';
const SECRET_PASSWORD = '20050428';

const prompts = [
  '如果今天是一种天气，它会是什么样子？',
  '快写下最近一个让你心动的瞬间吧~',
  '今天有没有一句话，很适合被你偷偷收起来？',
  '如果把今天画成一张小插画，画面里会有什么呀？',
  '写给三天后的自己一句轻轻的鼓励吧。',
  '今天有没有特别开心的瞬间呀',
  '如果今天有难过的事儿也没关系，快到嘴里来~',
  '嘿，小妞，你今天很酷哦~，冷cool~',
  '有没有惊喜想留给未来的自己呀~',
  '当你看到下雨时，别难过哦，那是神明在世间燃起的烟花'
];

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const secretScreen = document.getElementById('secretScreen');
const secretBackBtn = document.getElementById('secretBackBtn');
const loginForm = document.getElementById('loginForm');
const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const displayName = document.getElementById('displayName');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const todayLabel = document.getElementById('todayLabel');
const logoutBtn = document.getElementById('logoutBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordDialog = document.getElementById('changePasswordDialog');
const passwordCloseBtn = document.getElementById('passwordCloseBtn');
const passwordCancelBtn = document.getElementById('passwordCancelBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const changePasswordMessage = document.getElementById('changePasswordMessage');

const diaryForm = document.getElementById('diaryForm');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const contentInput = document.getElementById('content');
const tagsInput = document.getElementById('tags');
const entriesList = document.getElementById('entriesList');
const emptyState = document.getElementById('emptyState');
const moodButtons = [...document.querySelectorAll('.mood-btn')];
const entryTemplate = document.getElementById('entryTemplate');
const ideaTemplate = document.getElementById('ideaTemplate');
const taskTemplate = document.getElementById('taskTemplate');
const ideaInput = document.getElementById('ideaInput');
const addIdeaBtn = document.getElementById('addIdeaBtn');
const ideaBoard = document.getElementById('ideaBoard');
const entryCount = document.getElementById('entryCount');
const ideaCount = document.getElementById('ideaCount');
const taskCount = document.getElementById('taskCount');
const taskDoneCount = document.getElementById('taskDoneCount');
const taskProgressLabel = document.getElementById('taskProgressLabel');
const taskPercent = document.getElementById('taskPercent');
const taskProgressBar = document.getElementById('taskProgressBar');
const taskEmptyState = document.getElementById('taskEmptyState');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const clearFormBtn = document.getElementById('clearForm');
const openNoteBtn = document.getElementById('openNoteBtn');
const messageDialog = document.getElementById('messageDialog');
const closeDialog = document.getElementById('closeDialog');
const birthdayDialog = document.getElementById('birthdayDialog');
const birthdayCloseBtn = document.getElementById('birthdayCloseBtn');
const birthdayConfirmBtn = document.getElementById('birthdayConfirmBtn');
const confirmDialog = document.getElementById('confirmDialog');
const confirmTitle = document.getElementById('confirmTitle');
const confirmText = document.getElementById('confirmText');
const confirmOkBtn = document.getElementById('confirmOkBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const scrollToEditor = document.getElementById('scrollToEditor');
const changePromptBtn = document.getElementById('changePromptBtn');
const promptText = document.getElementById('promptText');
const quickTaskChips = [...document.querySelectorAll('.quick-task-chip')];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');

let selectedMood = '超开心';
let pendingImages = [];
let entries = loadFromStorage(STORAGE_KEY);
let ideas = loadFromStorage(IDEAS_KEY);
let tasks = loadFromStorage(TASKS_KEY);

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}


function renderImagePreview() {
  if (!imagePreview) return;
  imagePreview.innerHTML = '';
  pendingImages.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `预览图片 ${index + 1}`;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.title = '移除图片';
    removeBtn.addEventListener('click', () => {
      pendingImages = pendingImages.filter((_, i) => i !== index);
      renderImagePreview();
    });
    item.appendChild(img);
    item.appendChild(removeBtn);
    imagePreview.appendChild(item);
  });
}

function resetImageInput() {
  pendingImages = [];
  if (imageInput) imageInput.value = '';
  renderImagePreview();
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1400;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

if (imageInput) {
  imageInput.addEventListener('change', async (event) => {
    const files = [...(event.target.files || [])].slice(0, 3);
    if (!files.length) return;

    const nextImages = [];
    for (const file of files) {
      try {
        const dataUrl = await compressImage(file);
        nextImages.push(dataUrl);
      } catch {
        alert('有一张图片处理失败了，可以换一张再试试。');
      }
    }

    pendingImages = [...pendingImages, ...nextImages].slice(0, 3);
    renderImagePreview();
    imageInput.value = '';
  });
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function prettyToday() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(new Date());
}

function isBirthdayToday(date = new Date()) {
  return date.getMonth() === 3 && date.getDate() === 20;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function askConfirm({
  title = '确定要删除吗？',
  text = '这条内容删除后就找不回来啦，要不要再想一下？',
  okText = '确定删除',
  cancelText = '再想想'
} = {}) {
  return new Promise((resolve) => {
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmOkBtn.textContent = okText;
    confirmCancelBtn.textContent = cancelText;

    const cleanup = () => {
      confirmOkBtn.onclick = null;
      confirmCancelBtn.onclick = null;
      confirmDialog.onclose = null;
    };

    confirmOkBtn.onclick = () => {
      cleanup();
      confirmDialog.close('ok');
      resolve(true);
    };

    confirmCancelBtn.onclick = () => {
      cleanup();
      confirmDialog.close('cancel');
      resolve(false);
    };

    confirmDialog.onclose = () => {
      if (confirmDialog.returnValue !== 'ok' && confirmDialog.returnValue !== 'cancel') {
        cleanup();
        resolve(false);
      }
    };

    confirmDialog.showModal();
  });
}

let birthdayShownThisSession = false;

function maybeShowBirthdayDialog() {
  if (!birthdayDialog) return;
  if (birthdayShownThisSession) return;
  if (!isBirthdayToday()) return;
  if (!document.body.classList.contains('logged-in')) return;

  birthdayShownThisSession = true;
  birthdayDialog.showModal();
}

function setTodayDefaults() {
  const today = todayString();
  dateInput.value = today;
  taskDate.value = today;
  todayLabel.textContent = prettyToday();
}

function showApp(name = LOGIN_NAME) {
  document.body.classList.remove('logged-out');
  document.body.classList.add('logged-in');
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  appShell.classList.remove('app-enter');
  void appShell.offsetWidth;
  appShell.classList.add('app-enter');
  displayName.textContent = name;
  window.scrollTo(0, 0);
}

function showSecretLetter() {
  document.body.classList.remove('logged-out', 'logged-in');
  document.body.classList.add('secret-mode');

  loginScreen.classList.add('hidden');
  appShell.classList.add('hidden');
  secretScreen.classList.remove('hidden');

  window.scrollTo(0, 0);
}

function showLogin() {
  document.body.classList.remove('logged-in', 'secret-mode');
  document.body.classList.add('logged-out');

  appShell.classList.add('hidden');
  secretScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');

  loginForm.reset();
  loginError.textContent = '';
  resetImageInput();
  window.scrollTo(0, 0);
  setTimeout(() => loginName.focus(), 30);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = loginName.value.trim();
  const password = loginPassword.value.trim();
  if (name === SECRET_NAME && password === SECRET_PASSWORD) {
    loginError.textContent = '';
    showSecretLetter();
    return;
  }

  if (name !== LOGIN_NAME) {
    loginError.textContent = '名称或密码不对哦，再试一次吧。';
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: OWNER_EMAIL,
    password
  });

  if (error) {
    loginError.textContent = '名称或密码不对哦，再试一次吧。';
    return;
  }

  loginError.textContent = '';
  showApp(name);
});

logoutBtn.addEventListener('click', showLogin);
secretBackBtn?.addEventListener('click', showLogin);

changePasswordBtn?.addEventListener('click', () => {
  changePasswordMessage.textContent = '';
  changePasswordForm.reset();
  changePasswordDialog.showModal();
});

passwordCloseBtn?.addEventListener('click', () => {
  changePasswordDialog.close();
});

passwordCancelBtn?.addEventListener('click', () => {
  changePasswordDialog.close();
});

changePasswordForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword.length < 6) {
    changePasswordMessage.textContent = '新密码至少要 6 位哦。';
    return;
  }

  if (newPassword !== confirmPassword) {
    changePasswordMessage.textContent = '两次输入的新密码不一致。';
    return;
  }

  changePasswordMessage.textContent = '正在保存...';

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    changePasswordMessage.textContent = `修改失败：${error.message}`;
    return;
  }

  changePasswordMessage.textContent = '密码修改成功啦！';

  setTimeout(() => {
    changePasswordDialog.close();
    changePasswordForm.reset();
    changePasswordMessage.textContent = '';
  }, 900);
});

moodButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    moodButtons.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    selectedMood = btn.dataset.mood;
  });
});

quickTaskChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    taskInput.value = chip.dataset.task || '';
    taskInput.focus();
  });
});

function renderCounts() {
  entryCount.textContent = entries.length;
  ideaCount.textContent = ideas.length;
  taskCount.textContent = tasks.length;
  taskDoneCount.textContent = tasks.filter((task) => task.done).length;
}

function createTagElements(tags) {
  return tags.map((tag) => {
    const span = document.createElement('span');
    span.textContent = `# ${tag}`;
    return span;
  });
}

function renderEntries(filter = '') {
  entriesList.innerHTML = '';
  const keyword = filter.trim().toLowerCase();

  const filtered = [...entries]
    .filter((entry) => {
      const text = [entry.title, entry.content, entry.mood, ...(entry.tags || [])].join(' ').toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  emptyState.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach((entry) => {
    const node = entryTemplate.content.cloneNode(true);
    node.querySelector('.entry-title').textContent = entry.title;
    node.querySelector('.entry-meta').textContent = `${formatDate(entry.date)} · ${entry.mood}`;
    node.querySelector('.entry-content').textContent = entry.content;

    const gallery = node.querySelector('.entry-gallery');
    const galleryToggle = node.querySelector('.gallery-toggle');
    const imageWrap = node.querySelector('.entry-images');
    const images = Array.isArray(entry.images) ? entry.images : [];
    if (images.length) {
      galleryToggle.textContent = `展开照片（${images.length}）`;
      images.forEach((src, index) => {
        const frame = document.createElement('div');
        frame.className = 'entry-image-card';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${entry.title} 图片 ${index + 1}`;
        frame.appendChild(img);
        imageWrap.appendChild(frame);
      });
      gallery.addEventListener('toggle', () => {
        galleryToggle.textContent = `${gallery.open ? '收起' : '展开'}照片（${images.length}）`;
      });
    } else {
      gallery.remove();
    }

    const tagsWrap = node.querySelector('.entry-tags');
    createTagElements(entry.tags || []).forEach((tag) => tagsWrap.appendChild(tag));

    node.querySelector('.delete-entry').addEventListener('click', async () => {
  const ok = await askConfirm({
    title: '要删除这篇回忆吗？',
    text: `《${entry.title}》删除后就找不回来喽，不过它现在还可以留下来陪你。`,
    okText: '确定删除',
    cancelText: '先留下'
  });

  if (!ok) return;

  entries = entries.filter((item) => item.id !== entry.id);
  saveAll();
  renderEntries(searchInput.value);
  renderCounts();
  });

    entriesList.appendChild(node);
  });
}

function renderIdeas() {
  ideaBoard.innerHTML = '';

  ideas.forEach((idea) => {
    const node = ideaTemplate.content.cloneNode(true);
    node.querySelector('.idea-text').textContent = idea.text;
    node.querySelector('.delete-idea').addEventListener('click', async () => {
  const ok = await askConfirm({
    title: '要撕掉这张便签吗？',
    text: '这张灵感便签删掉以后就看不到啦，确定要删除吗？',
    okText: '删除便签',
    cancelText: '再想想'
  });

  if (!ok) return;

  ideas = ideas.filter((item) => item.id !== idea.id);
  saveAll();
  renderIdeas();
  renderCounts();
});
    ideaBoard.appendChild(node);
  });
}

function renderTasks() {
  taskList.innerHTML = '';
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done - b.done;
    return new Date(a.date) - new Date(b.date);
  });

  taskEmptyState.style.display = sortedTasks.length ? 'none' : 'block';

  sortedTasks.forEach((task) => {
    const node = taskTemplate.content.cloneNode(true);
    const taskItem = node.querySelector('.task-item');
    const checkbox = node.querySelector('.task-checkbox');
    checkbox.checked = task.done;
    taskItem.classList.toggle('done', task.done);
    node.querySelector('.task-text').textContent = task.text;
    node.querySelector('.task-meta').textContent = `${formatDate(task.date)} · ${task.done ? '已完成' : '进行中'}`;
    node.querySelector('.task-priority').textContent = task.priority;

    checkbox.addEventListener('change', () => {
      tasks = tasks.map((item) => item.id === task.id ? { ...item, done: checkbox.checked } : item);
      saveAll();
      renderTasks();
      renderCounts();
    });

   node.querySelector('.delete-task').addEventListener('click', async () => {
  const ok = await askConfirm({
    title: '要删除这个小目标吗？',
    text: `“${task.text}” 会从今日目标里消失哦，确定要删掉它吗？`,
    okText: '确定删除',
    cancelText: '保留一下'
  });

  if (!ok) return;

  tasks = tasks.filter((item) => item.id !== task.id);
  saveAll();
  renderTasks();
  renderCounts();
});

    taskList.appendChild(node);
  });

  updateTaskProgress();
}

function updateTaskProgress() {
  const today = todayString();
  const todayTasks = tasks.filter((task) => task.date === today);
  const done = todayTasks.filter((task) => task.done).length;
  const total = todayTasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  taskProgressLabel.textContent = `${done} / ${total} 完成`;
  taskPercent.textContent = `${percent}%`;
  taskProgressBar.style.width = `${percent}%`;
}

function randomPrompt() {
  const current = promptText.textContent;
  const pool = prompts.filter((item) => item !== current);
  const next = pool[Math.floor(Math.random() * pool.length)] || prompts[0];
  promptText.textContent = next;
}

changePromptBtn.addEventListener('click', randomPrompt);

diaryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const date = dateInput.value;
  const content = contentInput.value.trim();
  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !date || !content) return;

  entries.unshift({
    id: crypto.randomUUID(),
    title,
    date,
    mood: selectedMood,
    content,
    tags,
    images: [...pendingImages]
  });

  try {
    saveAll();
  } catch (error) {
    entries.shift();
    alert('图片有一点大，浏览器本地空间不够了。可以少放几张，或者换小一点的图再试试。');
    return;
  }

  renderEntries(searchInput.value);
  renderCounts();
  diaryForm.reset();
  dateInput.value = todayString();
  tagsInput.value = '';
  contentInput.value = '';
  titleInput.value = '';
  resetImageInput();
  selectedMood = '超开心';
  moodButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mood === '超开心'));
});

addIdeaBtn.addEventListener('click', () => {
  const text = ideaInput.value.trim();
  if (!text) return;

  ideas.unshift({ id: crypto.randomUUID(), text });
  saveAll();
  renderIdeas();
  renderCounts();
  ideaInput.value = '';
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (!text || !date) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    date,
    priority,
    done: false
  });

  saveAll();
  renderTasks();
  renderCounts();
  taskForm.reset();
  taskDate.value = todayString();
  taskPriority.value = '轻松';
});

searchInput.addEventListener('input', (event) => {
  renderEntries(event.target.value);
});

clearFormBtn.addEventListener('click', () => {
  diaryForm.reset();
  dateInput.value = todayString();
  resetImageInput();
  selectedMood = '超开心';
  moodButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mood === '超开心'));
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob([
    JSON.stringify({
      entries,
      ideas,
      tasks,
      exportedAt: new Date().toISOString()
    }, null, 2)
  ], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '戴静雯の小角落备份.json';
  a.click();
  URL.revokeObjectURL(url);
});

importFile.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    entries = Array.isArray(data.entries) ? data.entries : [];
    ideas = Array.isArray(data.ideas) ? data.ideas : [];
    tasks = Array.isArray(data.tasks) ? data.tasks : [];
    saveAll();
    renderEntries(searchInput.value);
    renderIdeas();
    renderTasks();
    renderCounts();
    alert('导入成功啦 ✨');
  } catch {
    alert('这个文件好像不是正确的备份格式哦。');
  }

  event.target.value = '';
});

openNoteBtn.addEventListener('click', () => messageDialog.showModal());
closeDialog.addEventListener('click', () => messageDialog.close());
birthdayCloseBtn?.addEventListener('click', () => birthdayDialog.close());
birthdayConfirmBtn?.addEventListener('click', () => birthdayDialog.close());
scrollToEditor.addEventListener('click', () => {
  document.getElementById('editorSection').scrollIntoView({ behavior: 'smooth' });
});

setTodayDefaults();
randomPrompt();
renderEntries();
renderIdeas();
renderTasks();
renderCounts();
showLogin();
