var assert = require('chai').assert;
var cheerio = require('cheerio');

var render = require('..');

describe('email', function() {
  it('should render email', function() {
    var html = render({
      intro: 'Hi!\n\nPlease fill in the survey below:',
      outro: 'Bye!',
      user: { userId: '1' },
      url: 'http://localhost/survey',
      token: 'aaa',
      color: 'orange',
      serviceName: 'ACME',
      unsubscribeUrl: 'http://localhost/survey/unsubscribe?token=aaa&userId=1',
      translation: {
        HOW_LIKELY: 'Je {{service_name}} dobry?'
      }
    });
    assert.isString(html);
    assert.include(html, 'Please fill');
    assert.include(html, 'Bye');
    assert.include(html, 'Je <b>ACME</b> dobry?');
    assert.include(html, 'Extremely likely');
    assert.include(
      html,
      'href="http://localhost/survey?token=aaa&amp;userId=1&amp;rating=10"'
    );
    assert.include(
      html,
      'href="http://localhost/survey/unsubscribe?token&#x3D;aaa&amp;userId&#x3D;1"'
    );

    var $ = cheerio.load(html);
    assert.equal($('a:not([href])').length, 0);
  });

  it('should not include unsubscribe', function() {
    var html = render({
      intro: 'Hi!\n\nPlease fill in the survey below:',
      outro: 'Bye!',
      user: { userId: '1' },
      url: 'http://localhost/survey',
      token: 'aaa',
      color: 'orange',
      serviceName: 'ACME',
      translation: {
        HOW_LIKELY: 'Je {{service_name}} dobry?'
      }
    });
    assert.isString(html);
    assert.notInclude(html, 'Unsubscribe');

    var $ = cheerio.load(html);
    assert.equal($('a:not([href])').length, 0);
  });

  it('should handle undefined values', function() {
    var html = render({
      intro: 'Hi!\n\nPlease fill in the survey below:',
      outro: 'Bye!',
      user: { userId: '1' },
      token: 'aaa',
      color: 'orange',
      serviceName: 'ACME'
    });
    var $ = cheerio.load(html);
    assert.equal($('a:not([href])').length, 11);
  });

  it('should handle other templates', function() {
    var html = render({
      intro: 'Hi!\n\nPlease fill in the survey below:',
      outro: 'Bye!',
      user: { userId: '1' },
      token: 'aaa',
      color: 'orange',
      serviceName: 'ACME',
      template: 'zonky'
    });
    var $ = cheerio.load(html);
    assert.equal(
      $(
        'img[src="https://zonky.cz/images/zebra/zebra-point-self-fill-flipped.png"]'
      ).length,
      1
    );
  });
});
