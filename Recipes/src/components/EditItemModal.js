import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import {
    Button, Component, Modal, PickerInput, TextInput,
    Layout, Validators,
} from 'cerebral-cereal-common';

import { updateItem } from '../actions/ShoppingListActions';
import { locations } from '../data';

class EditItemModal extends Component {
  static defaultProps = {
    item: null,
    itemIndex: -1,
    onChange: null,
    onRequestClose: null,
    visible: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      showTypeahead: false,
      shortlist: [],
      item: this.itemState(props.item),
      isValid: true,
      pickerVal: 1,
    }
  }

  itemState = (item) => {
    return item ? {
      name: item.name,
      quantity: item.quantity,
      location_id: item.location_id,
    } : null;
  }

  onChange = (newItem, isValid=true) => {
    let item = this.state.item;
    const fields = ['name', 'quantity', 'location_id'];
    fields.forEach(field => {
      if (newItem.hasOwnProperty(field)) {
        item[field] = newItem[field];
      }
    });
    this.setState({ item, isValid });
  }

  componentDidUpdate = prevProps => {
    if (this.props.item !== prevProps.item) {
      this.setState({
        item: this.itemState(this.props.item),
      });
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;

    return (
      <Modal
        visible={props.visible}
        onRequestClose={props.onRequestClose}
      >
        <View style={[Layout.p2, {width: 300}]}>
          <View style={[Layout.col]}>
            <View style={[Layout.row]}>
              <TextInput
                label="Name"
                value={state.item ? state.item.name : null}
                style={Layout.mb2}
                onChange={name => {
                  this.onChange({name});
                }}
              />
            </View>
            <View style={Layout.row}>
              <TextInput
                label="Quantity"
                value={state.item ? state.item.quantity.toString() : null}
                style={Layout.mb2}
                keyboardType={'numeric'}
                validators={[Validators.isInteger]}
                onChange={(quantity, isValid) => {
                  this.onChange({quantity}, isValid);
                }}
              />
            </View>
            <PickerInput
              textLabel="Location"
              pickerLabel="Locations"
              value={state.item ? state.item.location_id : null}
              pickerChoiceKeys={locations.map(l => l.id).concat([-1])}
              pickerChoiceValues={locations.map(l => l.formatName('')).concat('Unknown')}
              onChange = {location_id => this.onChange({location_id})}
            />
            
            <View style={[Layout.mt2, Layout.row]}>
              <Button
                label="Save" icon="check"
                colour={Colours.success}
                disabled={!state.isValid}
                style={[Layout.f1, Layout.mr2]}
                onPress={() => {
                  props.onChange(state.item);
                  props.updateItem(props.itemIndex, state.item);
                  props.onRequestClose();
                }}
              />
              <Button
                label="Cancel" icon="times"
                colour={Colours.error}
                onPress={this.props.onRequestClose}
                style={Layout.f1}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shoppingList: state.shoppingList,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ updateItem }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditItemModal);
