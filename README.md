# mg-translate
Simple and lightweight (~3kb) angular translate library with format similar to yii or drupal

## Installation

#### Install with Bower
```sh
$ bower install mg-translate
```

#### Install with NPM

```sh
$ npm install mg-translate
```

## Examples

See [the page on github.io](megahertz.github.io/mg-translate/) as a library example

#### Using directive
```html
<!-- Simple example -->
<h1 t>Hello world</h1>
<t>sample</t>

<!-- Translate an attribute -->
<input type="email" placeholder="Email" t="placeholder">

<!-- Using plural rules -->
<span t values="10">{n} Day|{n} Days</span>

<!-- Using additional variables -->
<h1 t values="{ user: 'John' }">Hello, {user}</h1>
```

#### Using filter
```html
<h1>{{ 'Welcome' | t }}</h1>
```

#### Using service
```javascript
function SampleController(t) {
	this.text = t('Welcome');
}
```

## Load translations

#### Using provider config
```javascript
angular
    .module('app')
    .config(function config(tProvider) {
        tProvider.load('/languages/ru.json'); // Load translations from file
        tProvider.load('ru', { // Load directly
            'Test' : 'Тест'
        });
        tProvider.load('ru', '$plural', function(n) { // Load plural rules function
            ...
        });
    });
```

#### Using service
```javascript
function SampleController(t) {
	t.load('ru', { // Load directly
            'Test' : 'Тест'
        });
	t.load('/languages/ru.json').then(function() { // Load translations from file
		console.log('language is loaded');
	});
}
```

#### Load plural rules
Plural rule is just a function which gets a number and returns the corresponding index. 
You can get plural rules for required languages.
on [js-simple-plurals](https://github.com/megahertz/js-simple-plurals/tree/master/web).
```javascript
function SampleController(t) {
	t.load('ru', '$plural', function(n) { // Load plural rules function
	   // function from https://github.com/megahertz/js-simple-plurals/blob/master/web/ru.js
    });
}
```

#### Load translation file
```javascript
// app.config.js:
angular
    .module('app')
    .config(function config(tProvider) {
        tProvider.load('/languages/ru.json');
    });
```    
 
ru.json:

```json
{
    "language": "ru",
    "data": {
        "Welcome": "Добро пожаловать",
        "User": "Пользователь",
        …
    },
    "$plural": "function (p) { var n = Math.abs(p)||0, i = Math.floor(n,10)||0, 
    v = ((p+'').split('.')[1]||'').length, i10 = i % 10, i100 = i % 100; 
    return v === 0 && i10 === 1 && i100 !== 11 ? 0 : v === 0 && (i10 >= 2 && i10 <= 4) 
    && !(i100 >= 12 && i100 <= 14) ? 1 : v === 0 && i10 === 0 || v === 0 
    && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 11 && i100 <= 14) ? 2 : 3; }"
}
```

#### Load translations as a module config
```javascript
(function() {
    'use strict';

    var TRANSLATIONS = {
        'Download' : 'Скачать',
        …
    };

    angular
        .module('mg.translate')
        .config(config);

    /** @ngInject */
    function config(tProvider) {
        tProvider.load('ru', '$plural', function(p) {
            // plural rule
        });

        tProvider.load('ru', TRANSLATIONS);
    }

})();
```
Just load this file as regular angular file
```html
<script src="langs/ru.js"></script>
```

## API Documentation

#### Provider tProvider

 - **load(url:string)** — Loads translation from a json file.
 - **load(language:string, [category:string='app'], translations:Object)** — 
 Loads translations from Object.
 - **load(language:string, '$plural', pluralRules:Function)** — Loads plural rules.
 
 - **language(language:string)** — Sets an application language. If the language is 
 not set the library tries to detect it automatically using a navigator object or 
 a value from localStorage.lang. To disable autodetection you can set a false value.
 - **language()** — Returns an application language.
  
#### Service t
 - **t(text:string, [null, category:string='app'])** - Translates the text.
 - **t(text:string, number:number, [category:string='app'])** - Translates the text 
 using plural rules. Or just
 replace {n} placeholder in text by the number.
 - **t(text:string, values:Object, [category:string='app'])** - Translates the text and 
 replaces each placeholder by a corresponding value.
 
 - **t.load(url:string):Promise** — Loads translation from a json file
 - **t.load(language:string, [category:string='app'], translations:Object)** — 
 Loads translations from Object.
 - **t.load(language:string, '$plural', pluralRules:Function)** — Loads plural rules.
 
 - **t.language(language:string)** — Sets an application language. If the language
 is not set the library tries to detect it automatically using a navigator object
 or a value from localStorage.lang. To disable autodetection you can set a false value.
 - **t.language()** — Returns an application language.
 
#### Filter t

The t filter function is the same as t() service function.

#### Directive t

The t directive can be used as an element or as an attribute. values and category
parameters are the same as for t() service function.

```html
<ANY
  [t="{string}"]
  [values="{number|Object}"]
  [category="{string}"]>
</ANY>

<t
  [values="{number|Object}"]
  [category="{string}"]>
</t>
```

Parameters

Name                | Default | Description
--------------------|---------|---
t (optional)        | 'html'  | A list of attributes which must be translated, 
  separated by comma. The html means an element content
values (optional)   | null    | Number for plural rules or values to replace placeholders
category (optional) | 'app'   | Translations category
  
## License

Licensed under MIT.

 