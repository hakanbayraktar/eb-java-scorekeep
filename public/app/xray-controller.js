var module = angular.module('scorekeep');

module.controller('XRayController', XRayController);
function XRayController($scope, $http, $location, SessionCollection, UserCollection, GameCollection, GameHistoryModel, api, $sce) {
  var ddbOutput = "Click the button above to generate traces to AWS DynamoDB.";
  var rdsDefaultOutput = "Click the button above to populate the table and generate traces to AWS RDS.";
  var rdsRunningOutput = "Populating table...";
  var ddbRunning = false;
  var rdsRunning = false;
  var shouldRunDdbDemo = false;
  var shouldRunRdsDemo = false;
  $scope.gameHistory = [];

  var runDdbDemo = function() {
    ddbRunning = true;
    var user1, user2, session, game;
    ddbOutput = "Creating users...<br/>";

    // Sick chaining
    UserCollection.createUser("random", null)
        .then(function(result) {
            console.log(result);
            user1 = result;
            ddbOutput += "Created user " + user1.name + ".<br/>";
            return UserCollection.createUser("random", null);
        })
        .then(function(result) {
            console.log(result);
            user2 = result;
            ddbOutput += "Created user " + user2.name + ".<br/>";
            ddbOutput += "Initializing session...<br/>";
            return SessionCollection.createSession(null, null);
        })
        .then(function(result) {
            console.log(result);
            session = result;
            ddbOutput += "Creating tic-tac-toe game...<br/>";
            return GameCollection.createGame(session.id, "tic-tac-toe", "TICTACTOE");
        })
        .then(function(result) {
            console.log(result);
            game = result;
            ddbOutput += "Game is about to begin...<br/>";
            return GameCollection.setUsers(session.id, game.id, [user1.id, user2.id]);
        })
        .then(function(result) {
            console.log(result);
            // Avoid NPE in service
            return GameCollection.setField(session.id, game.id, "rules", "TICTACTOE");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += "Playing game<br/>";
            ddbOutput += user1.name + " made move X1<br/>";
            return GameCollection.move(session.id, game.id, user1.id, "X1");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user2.name + " made move O2<br/>";
            return GameCollection.move(session.id, game.id, user2.id, "O2");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user1.name + " made move X3<br/>";
            return GameCollection.move(session.id, game.id, user1.id, "X3");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user2.name + " made move O4<br/>";
            return GameCollection.move(session.id, game.id, user2.id, "O4");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user1.name + " made move X5<br/>";
            return GameCollection.move(session.id, game.id, user1.id, "X5");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user2.name + " made move O6<br/>";
            return GameCollection.move(session.id, game.id, user2.id, "O6");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user1.name + " made move X7<br/>";
            return GameCollection.move(session.id, game.id, user1.id, "X7");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user2.name + " made move O8<br/>";
            return GameCollection.move(session.id, game.id, user2.id, "O8");
        })
        .then(function(result) {
            console.log(result);
            ddbOutput += user1.name + " made move X9<br/>";
            return GameCollection.move(session.id, game.id, user1.id, "X9");
        })
        .then(function(result) {
            ddbOutput += "Game Over!<br/>";
            // Keep repeating
            if (shouldRunDdbDemo) {
                runDdbDemo();
            } else {
                ddbRunning = false;
            }
        });
  };

  var runRdsDemo = function() {
    rdsRunning = true;
    GameHistoryModel.create()
        .then(function(result) {
            console.log(result);
            return GameHistoryModel.get();
        })
        .then(function(result) {
            console.log(result);
            $scope.gameHistory = result;
            if (shouldRunRdsDemo) {
                runRdsDemo();
            } else {
                rdsRunning = false;
            }
        });
  }

  $scope.getDdbOutput = function() {
    return $sce.trustAsHtml(ddbOutput);
  };

  $scope.getRdsOutput = function() {
    var output = rdsRunning ? rdsRunningOutput : rdsDefaultOutput;
    return $sce.trustAsHtml(output);
  };

  $scope.getDdbDemoPrompt = function() {
    if (shouldRunDdbDemo) {
        return "Stop AWS DynamoDB Demo";
    } else if (ddbRunning) {
        return "Finishing AWS DynamoDB Demo";
    } else {
        return "Start AWS DynamoDB Demo";
    }
  };

  $scope.getRdsDemoPrompt = function() {
    if (shouldRunRdsDemo) {
        return "Stop AWS RDS Demo";
    } else if (rdsRunning) {
        return "Finishing AWS RDS Demo";
    } else {
        return "Start AWS RDS Demo";
    }
  };

  $scope.toggleDdbDemo = function() {
    shouldRunDdbDemo = !shouldRunDdbDemo;
    if (shouldRunDdbDemo && !ddbRunning) {
        runDdbDemo();
    }
  };

  $scope.toggleRdsDemo = function() {
    shouldRunRdsDemo = !shouldRunRdsDemo;
    if (shouldRunRdsDemo && !rdsRunning) {
        runRdsDemo();
    }
  };
}