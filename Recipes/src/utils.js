/*
  Takes a list of shopping items and maps them to an ordered
  array of lists of items grouped by each location in the store
  order.
*/
export const mapItemsToLocations = (items, locations) => {
  let locationMap = {};
  items.forEach((item, i) => {
    item.index = i;
    if (item.ingredient || item.locationId > -1) {
      const ingredient = item.ingredient;
      if (item.locationId > -1) {
        if(!locationMap[item.locationId]) locationMap[item.locationId] = [];
        locationMap[item.locationId].push(item);
      } else if (ingredient.location_id) {
        if(!locationMap[ingredient.location_id]) locationMap[ingredient.location_id] = [];
        locationMap[ingredient.location_id].push(item);
      }
    } else {
      if(!locationMap[-1]) locationMap[-1] = [];
      locationMap[-1].push(item);
    }
  });

  // Ensures location ordering is maintained
  let locationArr = [];
  locations.forEach(loc => {
    if (locationMap.hasOwnProperty(loc.id.toString())) {
      locationArr.push({
        locationId: loc.id,
        items: locationMap[loc.id.toString()],
      });
    }
  });

  // Unknown locations at the end
  if (locationMap[-1] && locationMap[-1].length > 0) {
    locationArr.push({
      locationId: -1,
      items: locationMap[-1],
    });
  }

  return locationArr;
};

/*
  Takes a string and returns a quantity and item
  name, using teh quantity if two terms are specified
  and the first is a number.
  E.g.
    4 Onion => {quantity: 4, name: 'Onion'}
    Onion => {quantity: 1, name: 'Onion'}
*/
export const parseQuantity = name => {
  let quantity = 1;
  const quantityRegex = /(\d.*?)\s(.*)$/;
  const quantityMatch = quantityRegex.exec(name);
  if (quantityMatch) {
    quantity = parseInt(quantityMatch[1]);
    name = quantityMatch[2];
  }
  return {name, quantity};
}