describe('t service', function() {

    var tServiceProvider;
    var t;

    var $httpBackend;

    var testsData = window.testsData;

    beforeEach(function() {
        angular.module('test', [])
            .config(function(tProvider) {
                tServiceProvider = tProvider;
                tProvider.load('/test.json');
                tProvider.language('ru');
            });
        module('mgtranslate', 'test');
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/test.json')
            .respond({
                language: 'ru',
                data: {
                    'HTTP Response': 'Http Ответ'
                }
            });

        $httpBackend.when('GET', '/test_service.json')
            .respond({
                language: 'ru',
                data: {
                    'Service HTTP Response': 'Http Ответ Свервиса'
                }
            });

        t = $injector.get('t');
    }));


    it('should load translations using provider', function() {
        $httpBackend.flush();
        tServiceProvider.load('ru', {
            'Test' : 'Тест'
        });

        expect(t('Test')).toBe('Тест');
        expect(t('HTTP Response')).toBe('Http Ответ');
    });

    it('should load translations using service', function() {
        t.load('ru', {
            'Service Test' : 'Тест Сервиса'
        });
        expect(t('Service Test')).toBe('Тест Сервиса');

        var translation = null;
        t.load('/test_service.json').then(function() {
            translation = t('Service HTTP Response');
        });
        $httpBackend.flush();
        expect(translation).toBe('Http Ответ Свервиса');
    });

    it('should change a language', function() {
        t.load('ru', {
            'Service Test' : 'Тест Сервиса'
        });
        t.load('zh', {
            'Service Test' : '服务测试'
        });
        expect(t('Service Test')).toBe('Тест Сервиса');

        t.language('en');
        expect(t('Service Test')).toBe('Service Test');

        t.language('zh');
        expect(t('Service Test')).toBe('服务测试');
    });

    it('should translate plural forms', function() {
        t.load('ru', {
            '{n} day|{n} days' : '{n} день|{n} дня|{n} дней|{n} дня'
        });
        t.load('ru', '$plural', testsData.ruPlural);

        t.language('en');
        expect(t('{n} day|{n} days', 1)).toBe('1 day');
        expect(t('{n} day|{n} days', 2)).toBe('2 days');

        t.language('ru');
        expect(t('{n} day|{n} days', 1)).toBe('1 день');
        expect(t('{n} day|{n} days', 2)).toBe('2 дня');
        expect(t('{n} day|{n} days', 5)).toBe('5 дней');
    });

    it('should use placeholders', function() {
        expect(t('{first} {second} {first}', { first: 1, second: 2 })).toBe('1 2 1');
    });

    it('should use different categories', function() {
        t.load('ru', {
            'Test' : 'Тест'
        });
        t.load('ru', 'second', {
            'Test' : 'Задание'
        });

        expect(t('Test')).toBe('Тест');
        expect(t('Test', null, 'second')).toBe('Задание');
    });

});