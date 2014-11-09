(function () {

    'use strict';

    angular
        .module('gymassistant.front.schedule')
        .controller('Attendees', Attendees);

    Attendees.$inject = ['$modalInstance', 'attendees'];

    function Attendees($modalInstance, attendees) {

        var vm = this;
        vm.newAttendee = '';

        vm.attendees = attendees.slice(0);

        vm.ok = function () {
            $modalInstance.close(vm.attendees);
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        vm.remove = function (index) {
            vm.attendees.splice(index, 1);
        };

        vm.add = function() {
            if (vm.newAttendee != '' && vm.attendees.indexOf(vm.newAttendee) == -1) {
                vm.attendees.push(vm.newAttendee);
                vm.newAttendee = '';
            }
        }
    }
})();