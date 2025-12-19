// Тестовый скрипт для проверки клика
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-new-game');
    if (btn) {
        console.log('Кнопка найдена, добавляем тестовый обработчик');
        btn.addEventListener('click', function() {
            console.log('ТЕСТ: Клик работает!');
            alert('Клик работает!');
        });
    } else {
        console.error('Кнопка не найдена!');
    }
});
