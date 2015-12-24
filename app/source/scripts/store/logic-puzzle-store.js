var Reflux = require('reflux');
var LogicPuzzleActions = require('../actions/logic-puzzle-actions');
var request = require('superagent');

var _currentIndex = 1;


var LogicPuzzleStore = Reflux.createStore({
  listenables: [LogicPuzzleActions],

  onLoadItem: function () {
    this.updateItem();
  },

  onSubmitAnswer: function (userPuzzle) {
    this.onSaveUserAnswer(userPuzzle);
    this.onNextPuzzle();
  },

  onLastPuzzle: function () {
    if (_currentIndex > 1) {
      _currentIndex -= 1;
    }
    this.updateItem();
  },

  onNextPuzzle: function () {
    if (_currentIndex < 10) {
      _currentIndex += 1;
    }
    this.updateItem();
  },

  onSaveUserAnswer: function (userPuzzle) {
    userPuzzle.index = _currentIndex;
    userPuzzle.id = this.item.id;
    request.post('/user-puzzle')
        .set('Content-Type', 'application/json')
        .send(userPuzzle)
        .end((err, res)=> {
          console.log(res.text);
        });
  },

  onGetUserAnswer: function () {
    request.get('/user-puzzle')
        .set('Content-Type', 'application/json')
        .query({
          index: _currentIndex
        })
        .end((err, res)=> {
          return res.body.userAnswer
        });
  },


  updateItem: function () {
    request.get('/logic-puzzle')
        .set('Content-Type', 'application/json')
        .query({
          orderIndex: _currentIndex
        })
        .end((err, res) => {
          if (res.body.isOutRange === true) {
            alert('outRange');
            return;
          }
          this.item = res.body;
          if (_currentIndex === 1) {
            this.item['isFirstOne'] = true;
            this.item['isLastOne'] = false;
          } else if (_currentIndex === 10) {
            this.item['isFirstOne'] = false;
            this.item['isLastOne'] = true;
          } else {
            this.item['isFirstOne'] = false;
            this.item['isLastOne'] = false;
          }
          this.item.index = _currentIndex;
          this.trigger(this.item);
        });
  }

});

module.exports = LogicPuzzleStore;
