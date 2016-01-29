(function() {
    'use strict';

    var TRANSLATIONS = {
        'Download' : 'Скачать',
        'English': 'Английский',
        'Examples': 'Примеры',
        'Install with Bower' : 'Установка через Bower',
        'Install with NPM' : 'Установка через NPM',
        'Installation' : 'Установка',
        'Just load this file as regular angular file': 'Подключается как обычный angular файл',
        'Language': 'Язык',
        'Load plural rules': 'Загрузка переодов числительных',
        'Load translation file': 'Загрузка файла переводов',
        'Load translations': 'Загрузка переводов',
        'Load translations as a module config': 'Загрузка перевода как конфига модуля',
        'Russian': 'Русский',
        'Simple and lightweight (~3kb) angular translate library with format similar to yii or drupal': 'Простая и легкая (~3кб) angular библиотека для переводов как в yii или drupal',
        'Simple example': 'Простой пример',
        'Translate an attribute': 'Перевод аттрибута',
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