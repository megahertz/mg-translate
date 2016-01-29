# mg-translate
Simple and lightweight angular translate library with format similar to yii or drupal

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

#### Using directive
```html
<!-- Simple example -->
<h1 t>Hello world</h1>

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
Plural rule is just a function which gets a number and returns the corresponding index 
You can get plural rules for required languages
on [js-simple-plurals](https://github.com/megahertz/js-simple-plurals/tree/master/web)
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
    
// ru.json:
{
    language: 'ru',
    data: {
        'Welcome': 'Добро пожаловать',
        'User': 'Пользователь',
        …
    },
    $plural: function (p) { var n = Math.abs(p)||0, i = Math.floor(n,10)||0, v = ((p+'').split('.')[1]||'').length, i10 = i % 10, i100 = i % 100; return v === 0 && i10 === 1 && i100 !== 11 ? 0 : v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) ? 1 : v === 0 && i10 === 0 || v === 0 && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 11 && i100 <= 14) ? 2 : 3; }
}
```