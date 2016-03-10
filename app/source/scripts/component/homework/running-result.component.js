'use strict';

var React = require('react');
var Reflux = require('reflux');
var RunningResultStore = require('../../store/homework/running-result-store');
var HomeworkActions = require('../../actions/homework/homework-actions');

var RunningResult = React.createClass({
  mixins: [Reflux.connect(RunningResultStore)],
  getInitialState: function () {
    return {
      isSubmited: false,
      resultText: ''
    }
  },

  componentDidMount: function () {
    HomeworkActions.getRunningResult(this.props.orderId);
  },

  render() {
    return (
        <div>
          {
              this.state.isSubmited ?
                  <div className={'prompt' + (this.state.resultText ? 'hide': '')}>
                    <strong>正在进行测试,请稍候 ... ...</strong>
                  </div>
                :
                  <div className="default">
                    <strong>快点开始答题吧!</strong>
                  </div>
          }
          <div className="runningResult">
            <label>运行结果为:</label>
            <div className="content">
              {this.state.resultText}
            </div>
          </div>

        </div>
    );
  }
});

module.exports = RunningResult;