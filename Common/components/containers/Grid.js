import React from 'react';
import { Animated, FlatList, ScrollView, View } from "react-native";

import { Component } from '../Component';
import { Text } from '../Text';
import { Layout } from '../../styles';


export class Grid extends Component {
  static defaultProps = {
    data: null,
    cellWidth: 48,
    cellHeight: 48,
    headerStyle: null,
    renderColumnHeader: null,
    renderRowHeader: null,
    renderCell: null,
    cellStyle: null,
    rowHeaders: null,
    colHeaders: null,
    rowStep: 10,
    style: null,
  }

  constructor(props) {
    super(props);

    this.headerScrollView = null
    this.scrollPosition = new Animated.Value(0)
    this.scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
      { useNativeDriver: false },
    )

    this.state = {
      rowCount: this.props.data.length < this.props.rowStep ? this.props.data.length : this.props.rowStep,
    }
  }

  getCellStyle = () => {
    const { Colours } = this.getTheme();
    return [
      Layout.center,
        {
        width: this.props.cellWidth,
        height: this.props.cellHeight,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colours.offGrey,
        backgroundColor: Colours.background,
      },
    ];
  }

  getHeaderStyle = () => {
    const { Colours } = this.getTheme();
    return this.props.headerStyle ? this.props.headerStyle : {
      backgroundColor: Colours.primary,
      borderColor: Colours.primaryLight,
    };
  }

  handleScroll = e => {
    if (this.headerScrollView) {
      let scrollX = e.nativeEvent.contentOffset.x;
      this.headerScrollView.scrollTo({ x: scrollX, animated: false });
    }
  }

  renderCell = (value, style=null, renderFn=null) => {
    const { Colours } = this.getTheme();
    const _textColour = Colours.foreground;
    let cellStyle = this.getCellStyle();
    const _style = Array.isArray(style) ? style : [style];
    cellStyle = cellStyle.concat(_style);

    if (renderFn) {
      return renderFn(value, cellStyle);
    } else {
      return (
        <View key={value} style={[cellStyle]}>
          <Text colour={_textColour}>{value}</Text>
        </View>
      );
    }
  }

  renderColumn = (section) => {
    let { item } = section;
    let cells = [];

    for (let i = 0; i < this.state.rowCount; i++) {
      let datum = this.props.data[i][item.column];
      cells.push(this.renderCell(datum, this.props.cellStyle, this.props.renderCell));
    }

    return <View style={Layout.col}>{cells}</View>
  }

  renderColumnHeader() {
    let cols = [];
    for (let i = 0; i < this.props.data[0].length; i++) {
      cols.push(this.renderCell(this.props.colHeaders[i], this.getHeaderStyle(), this.props.renderColumnHeader))
    }

    return (
      <View style={[Layout.row]}>
        {this.renderCell("")}
        <ScrollView
          ref={ref => (this.headerScrollView = ref)}
          horizontal={true}
          scrollEnabled={false}
          scrollEventThrottle={16}
        >
          {cols}
        </ScrollView>
      </View>
    )
  }
  
  renderRowHeader() {
    let cells = []
    for (let i = 0; i < this.state.rowCount; i++) {
      cells.push(this.renderCell(this.props.rowHeaders[i], this.getHeaderStyle(), this.props.renderRowHeader))
    }
    return <View style={{ position: "absolute" }}>{cells}</View>
  }
  
  renderBody() {
    let data = []
    for (let i = 0; i < this.props.data[0].length; i++) {
      data.push({ key: `content-${i}`, column: i})
    }
    
    return (
      <View>
        {this.renderRowHeader()}
        <FlatList
          style={{marginLeft: this.props.cellWidth}}
          horizontal={true}
          data={data}
          renderItem={this.renderColumn}
          stickyHeaderIndices={[0]}
          onScroll={this.scrollEvent}
          scrollEventThrottle={16}
          extraData={this.state}
        />
      </View>
    )
  }
  
  formatRowForSheet = (section) => {
    let { item } = section
    return item.render
  }

  handleScrollEndReached = () => {
    if (!this.state.loading && this.state.rowCount < this.props.data.length) {
      this.setState({ rowCount: this.getRowCount() });
    }
  }

  getRowCount = () => {
    let newRows = this.state.rowCount + this.props.rowStep;
    return this.props.data.length < newRows ? this.props.data.length : newRows;
  }

  componentDidMount() {
    this.listener = this.scrollPosition.addListener(position => {
      this.headerScrollView.scrollTo({ x: position.value, animated: false })
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) {
      this.setState({rowCount: this.getRowCount()});
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const display = this.props.data.length >= this.state.rowCount;

    // This is very strange, but it looks like it needs a marginBottom the
    // size of the cell to get the bottom row only. I think this is because
    // of sticky headers.
    if (display) {
      const body = this.renderBody();
      const data = [{ key: "body", render: body }];
      return (
        display &&
        <View style={[{marginBottom: this.props.cellHeight}, this.props.style]}>
          {this.renderColumnHeader()}
          <FlatList
            data={data}
            renderItem={this.formatRowForSheet}
            onEndReached={this.handleScrollEndReached}
          />
        </View>
      )
    } else {
      return <View />
    }
  }
}