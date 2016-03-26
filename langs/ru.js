(function() {
    'use strict';

    var TRANSLATIONS = {
        'A list of attributes which must be translated,\n                separated by comma. The html means an element content': 'Список атрибутов которые должны быть переведены, разделенный запятой. html означает содержимое элемента',
        'API Documentation': 'API Документация',
        'Default': 'По умолчанию',
        'Description': 'описание',
        'Directive': 'Диреквтива',
        'Download' : 'Скачать',
        'English': 'Английский',
        'Examples': 'Примеры',
        'Filter': 'Фильтр',
        'Install with Bower' : 'Установка через Bower',
        'Install with NPM' : 'Установка через NPM',
        'Installation' : 'Установка',
        'Just load this file as regular angular file': 'Подключается как обычный angular файл',
        'Language': 'Язык',
        'License': 'Лицензия',
        'Licensed under MIT.': 'Под лицензией MIT',
        'Load plural rules': 'Загрузка переводов числительных',
        'Load translation file': 'Загрузка файла переводов',
        'Load translations': 'Загрузка переводов',
        'Load translations as a module config': 'Загрузка перевода как конфига модуля',
        'Loads translations from Object.': 'Загрузить перевод из объекта.',
        'Logo by': 'Логотип разработан',
        'Name': 'Название',
        'Number for plural rules or values to replace placeholders': 'Число для правил числительных или значание для замены шаблонов',
        'Parameters': 'Параметры',
        'Plural rule is just a function which gets a number and returns the corresponding index.\n        You can get plural rules for required languages on': 'Правила выбора числительных это функция которая принимает число и возвращает соответсвенный индекс. Вы можете взять эти правила на',
        'Provider': 'Провайдер',
        'Returns an application language.': 'Возвращает язык приложения.',
        'Russian': 'Русский',
        'Service': 'Севрис',
        'Sets an application language. If the language is not set the library\n            tries to detect it automatically using a navigator object or a value from\n            localStorage.lang. To disable autodetection you can set a false value.': 'Устанавливает язык приложения. Если язык не задан библиотека пытается определить его через navigator или значение из localStorage.lang. Используйте false чтобы отключить автоопределение.',
        'Simple and lightweight (~3kb) angular translate library with format similar\n            to yii or drupal': 'Простая и легкая (~3кб) angular библиотека для переводов как в yii или drupal',
        'Simple example': 'Простой пример',
        'The t filter function is the same as t() service function.': 'Фильтр t аналогичен функции сервиса t().',
        'The t directive can be used as an element or as an attribute. values and category\n        parameters are the same as for t() service function.': 'Директива t может использоваться и как элемент и как атрибут. Параметры values и category те же что и для функции t() сервиса.',
        'Translate an attribute': 'Перевод аттрибута',
        'Translates the text.': 'Переводит текст.',
        'Translates the text and replaces each placeholder by a corresponding value.': 'Переводит текст и заменяет каждый шаблон соответствующим значением.',
        'Translates the text using plural rules. Or just replace {n} placeholder\n            in text by the number.': 'Переводит текст используя правила для числительных. Либо просто заменяет шаблон {n} числом.',
        'Translations category': 'Катагория переводов',
        'Using plural rules': 'Перевод числительных',
        'Using provider config': 'Конфигурирование профайдера',
        'Using service': 'Через сервис'
    };

    angular
        .module('mg.translate')
        .config(config);

    /** @ngInject */
    function config(tProvider) {
        tProvider.load('ru', '$plural', function(p) {
            var n = Math.abs(p) || 0, i = Math.floor(n, 10) || 0, v = ((p + '').split('.')[1] || '').length, i10 = i % 10, i100 = i % 100;
            return v === 0 && i10 === 1 && i100 !== 11 ? 0 : v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) ? 1 : v === 0 && i10 === 0 || v === 0 && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 11 && i100 <= 14) ? 2 : 3;
        });

        tProvider.load('ru', TRANSLATIONS);
    }

})();