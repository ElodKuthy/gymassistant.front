'use strict';

angular.module('gymassistant.front.version', [
  'gymassistant.front.version.interpolate-filter',
  'gymassistant.front.version.version-directive'
])

.value('version', '0.1');
