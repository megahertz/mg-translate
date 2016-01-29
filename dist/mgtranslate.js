'use strict';

(function(angular) {

    angular.module('mgtranslate', [])
        .provider('t', provider)
        .filter('t', filter)
        .directive('t', directive);

    function provider() {
        var translations = {
            en: { $plural: function(n) { return Math.floor(Math.abs(n)) === 1 ? 0 : 1; } }
        };
        var currentLang = 'en';
        var preloadResources = [];

        return {
            load: preload,
            $get: service,
            language: language
        };

        /**
         * @ngdoc service
         * @name t
         * @module mgtranslate
         * @ngInject
         */
        function service($http) {
            if (preloadResources.length) {
                angular.forEach(preloadResources, loadResource);
            }

            translate.load = load;
            translate.language = language;
            return translate;

            function load(arg1, arg2, arg3) {
                if (!arg2) {
                    return loadResource(arg1);
                } else {
                    return loadData(arg1, arg2, arg3);
                }
            }

            function loadResource(resource) {
                if (!resource.then) {
                    resource = $http.get(resource);
                }
                return resource.then(function(response) {
                    var json = response.data;
                    if (json.$plural) {
                        loadData(json.language, '$plural', json.$plural);
                    }
                    loadData(json.language, json.category || 'app', json.data);
                    return json;
                });
            }
        }

        function preload(arg1, arg2, arg3) {
            if (!arg2) {
                preloadResources.push(arg1);
            } else {
                return loadData(arg1, arg2, arg3);
            }
        }

        function loadData(language, category, data) {
            if (!data) {
                data = category;
                category = 'app';
            }

            var lang = translations[language] = translations[language] || {};
            var cat = lang[category] = lang[category] || {};

            if ('$plural' === category) {
                lang.$plural = data;
                return;
            }

            angular.extend(cat, data);
        }

        function language(lang) {
            if (!lang) {
                return currentLang;
            } else {
                currentLang = lang;
            }
        }

        /**
         * Based on yii1 (CChoiceFormat and Yii::t())
         * @param {string}        message
         * @param {Object|number} [params]
         * @param {string}        [category=app]
         * @returns {*}
         */
        function translate(message, params, category) {
            category = category || 'app';

            if (
                translations &&
                translations[currentLang] &&
                translations[currentLang][category] &&
                translations[currentLang][category][message])
            {
                message = translations[currentLang][category][message];
            }

            if (undefined === params) {
                return message;
            }

            if ('object' === typeof params) {
                message = applyParams(message, params);
            } else if ('number' === typeof params && -1 !== message.indexOf('|')) {
                message = applyPluralForm(
                    message,
                    params,
                    translations[currentLang].$plural || translations.en.$plural
                );
            }

            if (-1 !== message.indexOf('{n}')) {
                message = message.replace('{n}', params);
            }

            return message;
        }

        function applyParams(message, params) {
            for (var i in params) {
                if (!params.hasOwnProperty(i)) { continue; }
                message = message.replace(new RegExp('{' + i + '}', 'g'), params[i]);
            }
            return message;
        }

        function applyPluralForm(message, number, pluralRules) {
            var chunks = message.split('|');
            var result = chunks[pluralRules(number)];
            if (undefined === result) {
                result = chunks[0];
            }
            return result;
        }
    }

    function filter(t) {
        return function(message, params, category) {
            return t(message, params, category);
        };
    }

    function directive(t) {
        return {
            link:     link,
            restrict: 'EA',
            scope:    true
        };

        function link(scope, element, attrs) {
            var category = attrs.category || 'app';
            var params = scope.$eval(attrs.values);
            var translateAttributes = attrs.t || 'html';

            angular.forEach(translateAttributes.split(','), function(a) {
                if ('html' === a) {
                    element.html(t(element.html(), params, category));
                } else {
                    element.attr(a, t(element.attr(a), params, category));
                }
            });
        }
    }

})(window.angular);