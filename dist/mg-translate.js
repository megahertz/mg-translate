'use strict';

(function() {

    filter.$inject = ["t"];
    directive.$inject = ["t", "$rootScope"];
    angular.module('mg.translate', [])
        .provider('t', provider)
        .filter('t', filter)
        .directive('t', directive);

    function provider() {
        service.$inject = ["$http", "$rootScope", "$window"];
        var translations = {
            en: { $plural: function(n) { return Math.floor(Math.abs(n)) === 1 ? 0 : 1; } }
        };
        var currentLang;
        var useDefaultLang = false;
        var preloadResources = [];

        return {
            load: preload,
            $get: service,
            language: language
        };

        /**
         * @ngdoc service
         * @name t
         * @module mg.translate
         * @ngInject
         */
        function service($http, $rootScope, $window) {
            if (preloadResources.length) {
                angular.forEach(preloadResources, loadResource);
            }
            if (undefined === currentLang) {
                currentLang = defaultLang();
            }

            translate.load = load;
            translate.language = changeLanguage;
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

            function changeLanguage(lang) {
                language(lang);
                $rootScope.$emit('$languageChange', lang);
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
                if (useDefaultLang && window.localStorage) {
                    localStorage.lang = lang;
                }
                currentLang = lang;
            }
        }

        function defaultLang() {
            useDefaultLang = true;
            if (window.localStorage && localStorage.lang) {
                return localStorage.lang;
            }
            var lang = navigator.language || navigator.userLanguage || 'en';
            var pos = lang.indexOf('_');
            if (-1 !== pos) {
                return lang.slice(0, pos);
            }
            return lang;
        }

        /**
         * Based on yii1 (CChoiceFormat and Yii::t())
         * @param {string}        message
         * @param {Object|number} [params]
         * @param {string}        [category=app]
         * @returns {*}
         */
        function translate(message, params, category) {
            /* jshint -W074 */
            category = category || 'app';

            translations[currentLang] = translations[currentLang] || {};

            if (
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

        function applyPluralForm(message, number, rules) {
            if ('string' === typeof rules) {
                /* jshint -W061*/
                rules = eval('rules=' + rules);
            }
            var chunks = message.split('|');
            var result = chunks[rules(number)];
            if (undefined === result) {
                result = chunks[0];
            }
            return result;
        }
    }

    /**
     * @ngdoc filter
     * @name t
     * @module mg.translate
     * @ngInject
     */
    function filter(t) {
        return function(message, params, category) {
            return t(message, params, category);
        };
    }

    /**
     * @ngdoc directive
     * @name t
     * @module mg.translate
     * @ngInject
     */
    function directive(t, $rootScope) {
        return {
            link:     link,
            restrict: 'EA',
            scope:    true
        };

        function link(scope, element, attrs) {
            var category = attrs.category || 'app';
            var translateAttributes = attrs.t || 'html';
            var original = {};

            angular.forEach(translateAttributes.split(','), function(a) {
                if ('html' === a) {
                    original[a] = element.html();
                } else {
                    original[a] = element.attr(a);
                }
                if (original[a] && original[a].trim) {
                    original[a] = original[a].trim();
                }
            });

            $rootScope.$on('$languageChange', applyTranslate);

            if (attrs.values) {
                scope.$watch(attrs.values, applyTranslate);
            }

            applyTranslate();

            function applyTranslate() {
                var values = scope.$eval(attrs.values, scope);
                angular.forEach(translateAttributes.split(','), function(a) {
                    if ('html' === a) {
                        element.html(t(original.html, values, category));
                    } else {
                        element.attr(a, t(original[a], values, category));
                    }
                });
            }
        }
    }

})();