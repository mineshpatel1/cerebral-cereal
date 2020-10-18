import React from 'react';
import { FlatList, View } from 'react-native';

import { Component, SelectableItem, TextInput, Layout } from 'cerebral-cereal-common';

export default class SearchList extends Component {
  static defaultProps = {
    items: null,
    onSelect: null,
    nameKey: 'name',
    maxToRenderPerBatch: 50,
    scrollEventThrottle: 100,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
    }
  }

  renderItem = ({ item }) => {
    return (
      <SelectableItem
        text={item.name}
        onSelect={() => {
          if (this.props.onSelect) this.props.onSelect(item);
        }}
      />
    )
  }

  render() {
    const { props, state } = this;
    const { Colours } = this.getTheme();

    let _items = [];
    if (state.search) {
      props.items.forEach(item => {
        if(item[props.nameKey].toLowerCase().includes(state.search.toLowerCase())) {
          _items.push(item);
        }
      });
    } else {
      _items = props.items;
    }

    return (
      <View>
        <View style={[
          Layout.row, Layout.pd1, Layout.pdx2, Layout.aCenter,
          {
            backgroundColor: Colours.primary,
          }
        ]}>
          <TextInput
            icon="search"
            placeholder="Search"
            value={state.search}
            colour={Colours.primaryContrast}
            placeholderColour={Colours.primaryLight}
            onChange={val => this.setState({search: val})}
            onFocus={() => this.setState({search: null})}
          />
        </View>
        <FlatList
          data={_items}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          maxToRenderPerBatch={props.maxToRenderPerBatch}
          scrollEventThrottle={props.scrollEventThrottle}
          getItemLayout={(_data, index) => {
            return {length: _data.length, offset: 60 * index, index};
          }}
          style={{marginBottom: 58}}  // Required to avoid chopping off the last item
        />
      </View>
    )
  }
}

