'use strict';

describe('gymassistant.front.version module', function() {
  beforeEach(module('gymassistant.front.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
