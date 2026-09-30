const form = document.querySelector('#signup');
const password = document.querySelector('#password');
const visibility = document.querySelector('#visibility');
const strength = document.querySelector('.strength');
const result = document.querySelector('#result');
const success = document.querySelector('#success');
const ruleItems = {
  length: document.querySelector('[data-rule="length"]'),
  upper: document.querySelector('[data-rule="upper"]'),
  number: document.querySelector('[data-rule="number"]'),
  symbol: document.querySelector('[data-rule="symbol"]'),
};

function getRules(value) {
  return {
    length: value.length >= 8,
    upper: /[A-ZА-ЯЁ]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-zА-Яа-яЁё0-9]/.test(value),
  };
}

function getLevel(score, value) {
  if (!value) return 'empty';
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

function updateStrength() {
  const value = password.value;
  const rules = getRules(value);
  const score = Object.values(rules).filter(Boolean).length;
  const level = getLevel(score, value);

  strength.dataset.level = level;

  Object.entries(rules).forEach(([name, isValid]) => {
    ruleItems[name].classList.toggle('is-ok', isValid);
  });

  result.textContent = level === 'strong'
    ? 'Теперь форму можно отправлять без сюрпризов.'
    : 'Подсказка появляется до клика по кнопке.';
  result.dataset.state = level === 'strong' ? 'success' : '';
}

visibility.addEventListener('click', () => {
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  visibility.setAttribute('aria-pressed', String(visible));
  visibility.setAttribute('aria-label', visible ? 'Скрыть пароль' : 'Показать пароль');
  visibility.title = visibility.getAttribute('aria-label');
});

password.addEventListener('input', updateStrength);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const score = Object.values(getRules(password.value)).filter(Boolean).length;

  if (score < 4) {
    result.textContent = 'Пароль еще слабый. Лучше подсказать это до отправки.';
    result.dataset.state = 'error';
    password.focus();
    return;
  }

  form.hidden = true;
  result.hidden = true;
  success.hidden = false;
});

updateStrength();
