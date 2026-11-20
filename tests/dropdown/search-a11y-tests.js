module('Dropdown - Search - Accessibility');

var Utils = require('select2/utils');

var Dropdown = require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  require('select2/dropdown/search')
);

var $ = require('jquery');

var Options = require('select2/options');
var options = new Options({});

test('role attribute is set to searchbox', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('role'),
    'searchbox',
    'The search box is marked as a search box'
  );
});

test('aria-autocomplete attribute is present', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('aria-autocomplete'),
    'list',
    'The search box is marked as autocomplete'
  );
});

test('aria-activedescendant should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'The search box should not point to anything when it is first rendered'
  );
});

test('aria-activedescendant should be set after highlight', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  container.trigger('results:focus', {
    data: {
      _resultId: 'test'
    }
  });

  var $search = $dropdown.find('input');

  assert.equal(
    $search.attr('aria-activedescendant'),
    'test',
    'The search is pointing to the focused result'
  );
});

test('activedescendant should remove if there is no ID', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-activedescendant', 'test');

  container.trigger('results:focus', {
    data: {}
  });

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'There is no result for the search to be pointing to'
  );
});

test('aria-activedescendant should be removed when closed', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-activedescendant', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'There is no active descendant when the dropdown is closed'
  );
});

test('aria-controls should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  assert.ok(
    !$search.attr('aria-controls'),
    'The search box should not point to the results when it is first rendered'
  );
});

test('aria-controls should be set when opened', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  container.trigger('open');

  assert.ok(
    $search.attr('aria-controls'),
    'The search should point to the results when it is opened'
  );
});

test('aria-controls should be removed when closed', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-controls', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-controls'),
    'There are no results for the search box to point to when it is closed'
  );
});

test('aria-label attribute is present', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('aria-label'),
    'Search',
    'The search box has a label'
  );

  assert.equal(
    $dropdown.find('label').length,
    0,
    'No visible label is shown without data-search-label'
  );
});

test('aria-label uses the search translation', function (assert) {
  var $select = $('#qunit-fixture .single');

  var customOptions = new Options({
    language: {
      search: function () {
        return 'Translated search';
      }
    }
  });

  var dropdown = new DropdownSearch($select, customOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('aria-label'),
    'Translated search',
    'The aria-label comes from the translations'
  );
});

test('data-search-label is shown as a visible label', function (assert) {
  var $select = $(
    '<select data-search-label="Search locations"><option>One</option></select>'
  );
  $('#qunit-fixture').append($select);

  var customOptions = new Options({}, $select);

  var dropdown = new DropdownSearch($select, customOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  container.id = 'select2-test';
  dropdown.bind(container, $('<span></span>'));

  var $label = $dropdown.find('label');
  var $search = $dropdown.find('input');

  assert.equal($label.length, 1, 'The search box has a visible label');

  assert.equal(
    $label.text(),
    'Search locations',
    'The label uses the data-search-label attribute'
  );

  assert.equal(
    $search.attr('id'),
    'select2-test-search',
    'The id of the search box is derived from the container id'
  );

  assert.equal(
    $label.attr('for'),
    $search.attr('id'),
    'The label is associated with the search box'
  );

  assert.ok(
    !$search.attr('aria-label'),
    'The visible label is used instead of an aria-label'
  );
});

test('data-search-label is not interpreted as HTML', function (assert) {
  var $select = $(
    '<select data-search-label="Search &lt;b&gt;filters&lt;/b&gt;">' +
    '<option>One</option></select>'
  );
  $('#qunit-fixture').append($select);

  var customOptions = new Options({}, $select);

  var dropdown = new DropdownSearch($select, customOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $label = $dropdown.find('label');

  assert.equal(
    $label.text(),
    'Search <b>filters</b>',
    'The label text is shown as plain text'
  );

  assert.equal(
    $label.find('b').length,
    0,
    'The label text is not interpreted as HTML'
  );
});

test('blank data-search-label falls back to aria-label', function (assert) {
  var $select = $(
    '<select data-search-label="  "><option>One</option></select>'
  );
  $('#qunit-fixture').append($select);

  var customOptions = new Options({}, $select);

  var dropdown = new DropdownSearch($select, customOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('label').length,
    0,
    'No empty label is rendered'
  );

  assert.equal(
    $dropdown.find('input').attr('aria-label'),
    'Search',
    'The search box keeps the translated aria-label'
  );
});
