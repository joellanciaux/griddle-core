'use strict';

var React = require('react');
var DataStore = require('../stores/local-data-store');
var LocalActions = require('../actions/local-action-creators');
var Draggable = require('react-draggable');

module.exports = React.createClass({
  getDefaultProps: function(){
    return {
      'column': null,
      'columnName': '',
      'cellStyle': null
    };
  },
  getInitialState: function(){
    return {
      currentPosition: 0
    };
  },
  componentWillMount: function(){
    // Load the initial state.
    this.dataChange();
  },
  render: function(){
      // This is really cheesy, but this makes up for the translation applied by react-draggable
      var offsetTranslation = 'translate(' + (-1 * this.state.currentPosition) + 'px, 0px)';
      var offsetStyle = {
        translate: offsetTranslation,
        WebkitTransform: offsetTranslation
      };

      return (<th key={'drag-column-' + this.props.columnName} width={this.state.columnMetadata.columnWidth + 'px'} style={this.props.cellStyle}>
                  <span style={{float: 'left'}}>{this.props.columnName}</span>
                  <div style={offsetStyle}>
                    <Draggable axis='x' onStart={this.dragStart} onDrag={this.dragMove}>
                      <div style={{float: 'right', cursor: 'pointer'}}>
                        <span style={{borderLeft: '4px solid'}}></span>
                      </div>
                    </Draggable>
                  </div>
              </th>);
  },
  dragStart: function(event, ui){
    this.setState({currentPosition: ui.position.left});
  },
  dragMove: function(event, ui){
    var change = ui.position.left - this.state.currentPosition;
    LocalActions.resizeColumn(this.props.gridId, this.props.column, change);
    this.setState({currentPosition: ui.position.left});
  },
  dataChange: function(){
    var columnMetadata = DataStore.getColumnProperties(this.props.gridId).getColumnMetadata();
    // Set the initial width
    this.setState({columnMetadata: columnMetadata[this.props.column]});
  },
  componentDidMount: function(){
    // Register data listener
    DataStore.addChangeListener(this.dataChange);
  },
  componentWillUnmount: function(){
    DataStore.removeChangeListener(this.dataChange);
  }
});