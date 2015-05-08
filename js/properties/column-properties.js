'use strict';

class ColumnProperties{
  constructor (columnMetadata = {}, horizontalOffset, tableWidth){
    this.columnMetadata = columnMetadata;

    this.initialDisplayIndex = 0;
    this.lastDisplayIndex = 0;
    this.leftHiddenColumnWidth = 0;
    this.rightHiddenColumnWidth = 0;

    var metadataKeys = Object.keys(columnMetadata);

    this.maxColumnLength = metadataKeys.length;

    if (metadataKeys.length > 0){
      // Determine the first column visible
      for(var i = 0; i < this.maxColumnLength; i++){
        var leftOffset = this.leftHiddenColumnWidth + columnMetadata[metadataKeys[i]].columnWidth;

        if (leftOffset >= horizontalOffset){
          this.initialDisplayIndex = i;
          break;
        } else {
          this.leftHiddenColumnWidth = leftOffset;
        }
      }

      // Subtract by one to allow give ourselves a buffer.
      this.initialDisplayIndex = this.initialDisplayIndex - 1;

      // If the index is less than zero, set to zero.
      if (this.initialDisplayIndex < 0){
        this.initialDisplayIndex = 0;
        this.leftHiddenColumnWidth = 0;
      } else {
        this.leftHiddenColumnWidth -= columnMetadata[metadataKeys[this.initialDisplayIndex]].columnWidth;
      }

      // Determine the last column visible
      var tableOffset = 0;
      for(var j = this.initialDisplayIndex; j < this.maxColumnLength; j++){
        var offset = tableOffset + columnMetadata[metadataKeys[j]].columnWidth;

        if (offset >= tableWidth || j === this.maxColumnLength - 1){
          this.lastDisplayIndex = j;
          break;
        } else {
          tableOffset = offset;
        }
      }

      // Add two to give ourselves a buffer.
      this.lastDisplayIndex = this.lastDisplayIndex + 2;

      // If there aren't enough available columns, set to the max length of properties.
      if (this.lastDisplayIndex > this.maxColumnLength - 1){
        this.lastDisplayIndex = this.maxColumnLength - 1;
      }

      // Compute the width of columns after what's shown.
      for(var k = this.lastDisplayIndex; k < this.maxColumnLength - 1; k++){
        this.rightHiddenColumnWidth += columnMetadata[metadataKeys[k]].columnWidth;
      }
    }
  }

  getColumnMetadata(){
    return this.columnMetadata;
  }

  getMetadataForColumn(column){
    return this.columnMetadata[column];
  }

  getWidthForColumn(column){
    return this.columnMetadata[column].columnWidth;
  }

  getNameForColumn(column){
    return this.columnMetadata[column].displayName;
  }

  getLockedForColumn(column){
    return this.columnMetadata[column].locked;
  }

  getTotalLockedColumnWidth(){
    var metadataArray = [];
    var metadataKeys = Object.keys(this.columnMetadata);
    for(var i = 0; i < metadataKeys.length; i++){
      metadataArray.push(this.columnMetadata[metadataKeys[i]]);
    }

    return metadataArray.filter(m => m.locked).map(m => m.columnWidth).reduce((x, y) => x + y);
  }

  getInitialDisplayIndex(){
    return this.initialDisplayIndex;
  }

  getLastDisplayIndex(){
    return this.lastDisplayIndex;
  }

  getMaxColumnLength(){
    return this.maxColumnLength;
  }

  getLeftHiddenColumnWidth(){
    return this.leftHiddenColumnWidth;
  }

  getRightHiddenColumnWidth(){
    return this.rightHiddenColumnWidth;
  }
}

module.exports = ColumnProperties;