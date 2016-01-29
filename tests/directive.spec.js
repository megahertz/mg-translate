describe('t directive ', function () {

    var $compile;
    var $rootScope;
    var t;

    beforeEach(module('mg.translate'));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        t = $injector.get('t');

        t.load('ru', {
            'Welcome':          'Добро пожаловать',
            'Email':            'Do not translate',
            'Enter email':      'Укажите email',
            'Hello, {user}':    'Привет, {user}',
            '{n} day|{n} days': '{n} день|{n} дня|{n} дней|{n} дня'
        });
        t.language('ru');
    }));


    it('should display simple text', function() {
        var element = $compile('<h1 t>Welcome</h1>')($rootScope);
        expect(element.text()).toBe('Добро пожаловать');
    });

    it('should translate placeholders', function() {
        var code = '<input ' +
            'placeholder="Email" ' +
            'title="Enter email" ' +
            't="title">';
        var element = $compile(code)($rootScope);
        expect(element.attr('placeholder')).toBe('Email');
        expect(element.attr('title')).toBe('Укажите email');

        expect(element.attr('placeholder')).toBe('Email');
        expect(element.attr('title')).toBe('Укажите email');
    });

    it('should translate using params', function() {
        $rootScope.values = { user: 'John' };

        var code = '<h1 t values="values">Hello, {user}</h1>';
        var element = $compile(code)($rootScope);
        expect(element.text()).toBe('Привет, John');

        code = '<h1 t values="{ user: \'Bill\' }">Hello, {user}</h1>';
        element = $compile(code)($rootScope);
        expect(element.text()).toBe('Привет, Bill');
    });

    it('should translate plural forms', function() {
        $rootScope.values = 2;

        var code = '<h1 t values="1">{n} day|{n} days</h1>';
        var element = $compile(code)($rootScope);
        expect(element.text()).toBe('1 день');

        code = '<h1 t values="values">{n} day|{n} days</h1>';
        element = $compile(code)($rootScope);
        expect(element.text()).toBe('2 дня');
    });
});