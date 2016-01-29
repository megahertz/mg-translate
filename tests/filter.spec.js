describe('t filter', function() {

    var $compile;
    var $rootScope;

    var t;
    var tFilter;

    var testsData = window.testsData;

    beforeEach(module('mg.translate'));

    beforeEach(inject(function($injector) {
        t       = $injector.get('t');
        tFilter = $injector.get('tFilter');

        $compile   = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
    }));


    it('should translate simple constructions', function() {
        t.load('ru', {
            'Test' : 'Тест'
        });
        t.language('ru');

        expect(tFilter('Test')).toBe('Тест');
    });

    it('should translate plural forms', function() {
        t.load('ru', {
            '{n} day|{n} days' : '{n} день|{n} дня|{n} дней|{n} дня'
        });
        t.load('ru', '$plural', testsData.ruPlural);

        t.language('en');
        expect(tFilter('{n} day|{n} days', 1)).toBe('1 day');
        expect(tFilter('{n} day|{n} days', 2)).toBe('2 days');

        t.language('ru');
        expect(tFilter('{n} day|{n} days', 1)).toBe('1 день');
        expect(tFilter('{n} day|{n} days', 2)).toBe('2 дня');
        expect(tFilter('{n} day|{n} days', 5)).toBe('5 дней');
    });

    it('should be compiled', function() {
        t.load('ru', {
            'Welcome': 'Добро пожаловать',
            '{n} day|{n} days': '{n} день|{n} дня|{n} дней|{n} дня'
        });
        t.language('ru');
        t.load('ru', '$plural', testsData.ruPlural);

        var element = $compile('<h1>{{ \'Welcome\' | t }}</h1>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('Добро пожаловать');

        element = $compile('<h1>{{ \'{n} day|{n} days\' | t:10 }}</h1>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('10 дней');

        element = $compile('<h1>{{ \'{f} {s}\' | t:{f: 1, s: 2} }}</h1>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('1 2');
    });

});