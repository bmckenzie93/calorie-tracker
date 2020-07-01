//    STORAGE CONTROLLER




//    ITEM CONTROLLER
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const state = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Taco Dinner', calories: 700},
      {id: 2, name: 'All I can Eat', calories: 9999},
    ],
    currentItem: null,
    totalCalories: 0
  }


  // Public Methods
  return {
    getItems: function(){
      return state.items;
    },
    logState: function(){
      return state;
    }
  }
})();





//    UI CONTROLLER
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list'
  }


  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="fa edit-item fa-pencil"></i></a>
        </li>`
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    }

  }

})();





//    APP CONTROLLER
const App = (function(ItemCtrl, UICtrl){


  // Public Methods
  return {
    init: function(){
      console.log('Initializing App...')
      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // populate list with items
      UICtrl.populateItemList(items);
    }
  }
})(ItemCtrl, UICtrl);

// INITIALIZE APP
App.init();