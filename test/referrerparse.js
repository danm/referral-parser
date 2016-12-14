'use strict';

const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const Referrer = require('../index');

const opts = { bbc: true };

describe("Error Checking", function() {
    it('should throw error if no referrer passed', function() {
        //arrange
        //assert
        expect(function() {
            //act
            let res = new Referrer();
        }).to.throw(/No referral URL found/);;
    });

    it('should fix urls without protocol', function() {
        //arrange
        let ref = 'hello.is';
        let obj = new Referrer(ref);
        //assert
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.have.all.keys('host');
        expect(obj.refferal.host).to.eql('hello.is');
    });
});

describe("Unreconised Site", function() {
    it('should return only host if site is not reconised', function() {
        //arrange
        let ref = 'http://hello.is/dsfsd';
        let obj = new Referrer(ref);
        //assert
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.have.all.keys('host');
        expect(obj.refferal.host).to.eql('hello.is');

    });
});

describe("Search", function() {
    it('should return all properties for google.com with hash', function() {
        //arrange
        let ref = 'http://www.google.com/#q=bbc+news';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'search',
            name: 'Google',
            search: 'bbc news',
            host: 'www.google.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });

    it('should return all properties for google.com with param', function() {
        //arrange
        let ref = 'http://www.google.com?q=bbc+news';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'search',
            name: 'Google',
            search: 'bbc news',
            host: 'www.google.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });

    it('should return all properties for bing.com with param', function() {
        //arrange
        let ref = 'http://www.bing.com/search?q=bbc+news&go=Submit&qs=n&form=QBLH&pq=bbc+new&sc=1-0&sp=-1&sk=&cvid=2817C11E5B6D4A829A196DAC45EB457D';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'search',
            name: 'Bing',
            search: 'bbc news',
            host: 'www.bing.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });
});

describe("Social", function() {
    it('should return all properties for Facebook', function() {
        //arrange
        let ref = 'http://www.facebook.com';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'social',
            name: 'Facebook',
            host: 'www.facebook.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });

    it('should return all properties for Google Plus', function() {
        //arrange
        let ref = 'http://plus.google.com';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'social',
            name: 'Google%2B',
            host: 'plus.google.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });
});

describe("News", function() {
    it('should return type news for Flipboard', function() {
        //arrange
        let ref = 'https://flipboard.com';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'news',
            name: 'Flipboard',
            host: 'flipboard.com'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });

});

describe("Top level domains", function() {
    it('Check google runs from non ISO TLD', function() {
        //arrange
        let ref = 'http://www.google.co.uk/#q=bbc+news';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'search',
            name: 'Google',
            search: 'bbc news',
            host: 'www.google.co.uk'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });

    it('Check google runs from ISO TLD', function() {
        //arrange
        let ref = 'http://www.google.ca/#q=bbc+news';
        let obj = new Referrer(ref);
        //assert
        var ex = {
            type: 'search',
            name: 'Google',
            search: 'bbc news',
            host: 'www.google.ca'
        }
        expect(obj).to.have.all.keys('refferal');
        expect(obj.refferal).to.eql(ex);
    });
});


describe("BBC", function() {
    it("Should return that the BBC homepage was the referrer", function() {
        //arrange
        let ref = "www.bbc.com";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.name).to.eql('homepage');
    });

    it("Should return the BBC CPSid of referrer", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/news/business-37618618";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('37618618');
        expect(obj.refferal.name).to.eql('news');
    });

    it("Should return the BBC news homepage", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/news/";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('home');
        expect(obj.refferal.name).to.eql('news');
    });

    it("Should return the BBC news business homepage", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/news/business";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('business');
        expect(obj.refferal.name).to.eql('news');
    });

    it("Should return the BBC sport homepage", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/sport";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('home');
        expect(obj.refferal.name).to.eql('sport');
    });

    it("Should return the BBC sport football homepage", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/sport/football";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('football');
        expect(obj.refferal.name).to.eql('sport');
    });

    it("Should return the BBC sport with cps id", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/sport/live/37157487";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('37157487');
        expect(obj.refferal.name).to.eql('sport');
    });

    it("Should return the BBC News Unknown Page", function() {
        //arrange
        let ref = "http://www.bbc.co.uk/news/resources/idt-6d083913-0bfb-4988-8cd8-d126fa6dcff1";
        //act
        let obj = new Referrer(ref, opts);
        //assert
        expect(obj.refferal.page).to.eql('resources/idt-6d083913-0bfb-4988-8cd8-d126fa6dcff1');
        expect(obj.refferal.name).to.eql('news');
    });

})