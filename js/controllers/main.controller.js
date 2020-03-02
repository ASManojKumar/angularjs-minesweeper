(function () {
  'use strict';
  angular.module('mineSweeperApp')
    .controller('mineSweeperController', ['$scope', '$interval', function ($scope, $interval) {

      var game_in_progress = false;
      var start_time;

      $scope.mine_sweeper_game = {
        'levels': [{
            'name': 'Easy',
            'size': 5,
            'total_mines': 6
          },
          {
            'name': 'Medium',
            'size': 9,
            'total_mines': 10
          },
          {
            'name': 'Hard',
            'size': 14,
            'total_mines': 22
          },
        ],
        'wins': 0,
        'losses': 0,
        'start_game': false
      };

      var init = function () {
        $scope.mine_sweeper_game.difficulty = $scope.mine_sweeper_game.levels[0];
      };

      var createMinefield = function () {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        var mine_field = {};
        mine_field.rows = [];
        for (var i = 0; i < diff_size; i++) {
          var row = {};
          row.spots = [];
          for (var j = 0; j < diff_size; j++) {
            var spot = {};
            spot.is_covered = true;
            spot.content = 'empty';
            spot.flag = false;
            spot.reveal = false;
            spot.mine_blast = false;
            spot.wrong_flag = false;
            row.spots.push(spot);
          }
          mine_field.rows.push(row);
        }
        placeMines(mine_field);
        calculateAllNumbers(mine_field);
        return mine_field;
      };

      var placeMines = function (mine_field) {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        var mines = $scope.mine_sweeper_game.difficulty.total_mines;
        var spot;
        for (var i = 0; i < mines; i++) {
          while (true) {
            var row = Math.round(Math.random() * (diff_size - 1));
            var column = Math.round(Math.random() * (diff_size - 1));
            spot = getSpot(mine_field, row, column);
            if (spot.content == "empty") {
              break;
            }
          }
          spot.content = 'mine';
        }
      };

      var getSpot = function (mine_field, row, column) {
        return mine_field.rows[row].spots[column];
      };

      var getTime = function () {
        return new Date();
      };

      var calculateAllNumbers = function (mine_field) {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        for (var y = 0; y < diff_size; y++) {
          for (var x = 0; x < diff_size; x++) {
            calculateNumber(mine_field, x, y);
          }
        }
      };

      var calculateNumber = function (mine_field, row, column) {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        var this_spot = getSpot(mine_field, row, column);

        if (this_spot.content == 'mine') {
          return;
        }

        var mine_count = 0,
          spot;

        if (row > 0) {
          if (column > 0) {
            // top left spot
            spot = getSpot(mine_field, row - 1, column - 1);
            if (spot.content == 'mine') {
              mine_count++;
            }
          }
          // top center spot
          spot = getSpot(mine_field, row - 1, column);
          if (spot.content == 'mine') {
            mine_count++;
          }
          if (column < (diff_size - 1)) {
            // top right spot
            spot = getSpot(mine_field, row - 1, column + 1);
            if (spot.content == 'mine') {
              mine_count++;
            }
          }
        }
        if (column > 0) {
          // left spot
          spot = getSpot(mine_field, row, column - 1);
          if (spot.content == 'mine') {
            mine_count++;
          }
        }
        if (column < (diff_size - 1)) {
          // right spot
          spot = getSpot(mine_field, row, column + 1);
          if (spot.content == 'mine') {
            mine_count++;
          }
        }
        if (row < (diff_size - 1)) {
          if (column > 0) {
            // bottom left spot
            spot = getSpot(mine_field, row + 1, column - 1);
            if (spot.content == 'mine') {
              mine_count++;
            }
          }
          // bottom center spot  
          spot = getSpot(mine_field, row + 1, column);
          if (spot.content == 'mine') {
            mine_count++;
          }
          if (column < (diff_size - 1)) {
            // bottom right spot
            spot = getSpot(mine_field, row + 1, column + 1);
            if (spot.content == 'mine') {
              mine_count++;
            }
          }
        }

        if (mine_count > 0) {
          this_spot.content = mine_count;
        }
      };

      var clearSpots = function (mine_field) {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        for (var row = 0; row < diff_size; row++) {
          for (var column = 0; column < diff_size; column++) {
            var spot = getSpot(mine_field, row, column);
            if (!spot.is_covered && spot.content == 'empty') {
              if (row > 0) {
                if (column > 0) {
                  getSpot(mine_field, row - 1, column - 1).is_covered = false;
                }
                getSpot(mine_field, row - 1, column).is_covered = false;
                if (column < (diff_size - 1)) {
                  getSpot(mine_field, row - 1, column + 1).is_covered = false;
                }
              }
              if (column > 0) {
                getSpot(mine_field, row, column - 1).is_covered = false;
              }
              if (column < (diff_size - 1)) {
                getSpot(mine_field, row, column + 1).is_covered = false;
              }
              if (row < (diff_size - 1)) {
                if (column > 0) {
                  getSpot(mine_field, row + 1, column - 1).is_covered = false;
                }
                getSpot(mine_field, row + 1, column).is_covered = false;
                if (column < (diff_size - 1)) {
                  getSpot(mine_field, row + 1, column + 1).is_covered = false;
                }
              }
            }
          }
        }
      };

      var hasWon = function (mine_field) {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        for (var y = 0; y < diff_size; y++) {
          for (var x = 0; x < diff_size; x++) {
            var spot = getSpot(mine_field, y, x);
            if (spot.is_covered && spot.content != 'mine') {
              return false;
            }
          }
        }
        return true;
      };

      var winMsg = function () {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        $scope.mine_sweeper_game.win_message = true;
        $scope.mine_sweeper_game.wins++;
        game_in_progress = false;
        for (var y = 0; y < diff_size; y++) {
          for (var x = 0; x < diff_size; x++) {
            getSpot($scope.minefield, y, x).is_covered = false;
            getSpot($scope.minefield, y, x).flag = false;
            getSpot($scope.minefield, y, x).reveal = true;
          }
        }
      };

      var hasLost = function () {
        var diff_size = $scope.mine_sweeper_game.difficulty.size;
        game_in_progress = false;
        $scope.mine_sweeper_game.lose_message = true;
        $scope.mine_sweeper_game.losses++;
        for (var y = 0; y < diff_size; y++) {
          for (var x = 0; x < diff_size; x++) {
            getSpot($scope.minefield, y, x).is_covered = false;
            getSpot($scope.minefield, y, x).reveal = true;
            getSpot($scope.minefield, y, x).wrong_flag = true;
            getSpot($scope.minefield, y, x).mine_blast = true;
          }
        }
      };

      $scope.startGame = function () {
        $scope.minefield = createMinefield();
        game_in_progress = true;
        start_time = getTime();
        $scope.mine_sweeper_game.start_game = true;
      };

      $scope.flagSpot = function (spot) {
        if (spot.is_covered) {
          spot.flag = true;
        }
      };

      $scope.uncoverSpot = function (spot) {
        if (spot.is_covered) {
          spot.is_covered = false;
          if (spot.content == 'mine') {
            hasLost($scope.spot);
          } else if (hasWon($scope.minefield)) {
            winMsg($scope.spot);
          } else if (spot.flag) {
            spot.flag = false;
            spot.is_covered = false;
            if (spot.content == 'empty') {
              clearSpots($scope.minefield);
            }
          } else if (spot.content == 'empty' && !spot.flag) {
            clearSpots($scope.minefield);
          }
        }
      };

      $scope.quit = function () {
        $scope.mine_sweeper_game.win_message = false;
        $scope.mine_sweeper_game.lose_message = false;
        $scope.mine_sweeper_game.start_game = false;
      };

      $scope.resetMinefield = function () {
        $scope.minefield = createMinefield();
        $scope.mine_sweeper_game.win_message = false;
        $scope.mine_sweeper_game.lose_message = false;
        start_time = getTime();
        game_in_progress = true;
        $scope.mine_sweeper_game.start_game = true;
      };

      $scope.startTimer = function () {
        if (game_in_progress) {
          var game_time = getTime() - 300 * 6000;
          $scope.mine_sweeper_game.timer = game_time - start_time;
        }
      };

      $interval(function () {
        $scope.startTimer();
      }, 500);

      // initial calls
      init();
    }]);
})();