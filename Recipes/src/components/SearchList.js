import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FlatList, View } from 'react-native';

import {
  Component, RefreshControl, SelectableItem, TextInput, Toast, Layout,
} from 'cerebral-cereal-common';

import Api from '../api';
import { setRecipes } from '../actions/RecipeActions';
import { setIngredients } from '../actions/IngredientActions';

class SearchList extends Component {
  static defaultProps = {
    items: null,
    onSelect: null,
    nameKey: 'name',
    maxToRenderPerBatch: 50,
    scrollEventThrottle: 100,
    refreshControl: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      refreshing: false,
    }
  }

  toggleLoading = () => this.setState({ refreshing: !this.state.refreshing });

  onRefresh = () => {
    this.toggleLoading();
    Api.getRecipes()
      .then(results => {
        this.props.setRecipes(results.recipes);
        this.props.setIngredients(results.ingredients);
      })
      .catch(err => {
        console.error(err);
        this.toast.show(err.toString(), 'error');
      })
      .finally(this.toggleLoading);
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
          Layout.row, Layout.p1, Layout.px2, Layout.aCenter,
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
          refreshControl={
            <RefreshControl onRefresh={this.onRefresh} refreshing={state.refreshing} />
          }
          style={{marginBottom: 58}}  // Required to avoid chopping off the last item
          getItemLayout={(_data, index) => {
            return {length: _data.length, offset: 60 * index, index};
          }}
        />
        <Toast ref={x => this.toast = x} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
    ingredients: state.ingredients,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ setRecipes, setIngredients }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchList);
