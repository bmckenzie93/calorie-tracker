// Storage Controller
const StorageCtrl = (function() {

})();


// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    setInitialState: function(){
      // clear input fields
      UICtrl.clearInput();

      // hide edit state buttons
      document.querySelector('.add-btn').style.display = 'inline';
      document.querySelector('.update-btn').style.display = 'none';
      document.querySelector('.delete-btn').style.display = 'none';
      document.querySelector('.back-btn').style.display = 'none';
    },
    showEditState: function(){
      document.querySelector('.add-btn').style.display = 'none';
      document.querySelector('.update-btn').style.display = 'inline';
      document.querySelector('.delete-btn').style.display = 'inline';
      document.querySelector('.back-btn').style.display = 'inline';
    },
    populateItems: function(items){
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`
      })

      // insert list items into list
      document.querySelector(UISelectors.itemList).innerHTML = html;   
    },
    addListItem(item){
      // show list in UI
      UICtrl.showList();
      // create li
      const li = document.createElement('li');
      // add class
      li.className = 'collection-item';
      // add id
      li.id = `item-${item.id}`;
      // add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`

      // inject new list item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState()
    },
    showTotalCalories: function(totalCal){
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },
    getSelectors: function(){
      return UISelectors;  
    },
  }  
})(); 


// Item Controller
const ItemCtrl = (function() {
  // item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // data structure
  const data = {
    items: [
      // {id: 0, name: 'sushi', calories: 100},
      // {id: 1, name: 'steak', calories: 200},
      // {id: 2, name: 'beer', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    logData: function(){
      return data;
    },
    addItem: function(name, calories){
      // generate id
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // calories string into number
      calories = parseInt(calories);
      // create new item
      newItem = new Item(ID, name, calories);
      // add new item to data structure
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function(){
      let total = 0;

      // loop through items and add calories
      data.items.forEach(item => {
        total += item.calories;
      });

      // set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItems: function(){
      return data.items;
    },
    getItemById: function(id){
      let found = null;

      data.items.forEach(item =>{
        if(item.id === id) {
          found = item;
        }
      })

      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    }
  };
})();



// App
const App = (function(ItemCtrl, UICtrl) {
  // Load event listners
  const loadEventListners = function(){
    // fetch selecors from ui ctrl
    const UISelectors = UICtrl.getSelectors(); 

    // add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);
    
    // edit item event
    document.querySelector(UISelectors.itemList).addEventListener('click', editItemClick);
  }

  // add item submit
  const addItemSubmit = function(e){  
    // get input values from form
    const input = UICtrl.getItemInput();

    // make sure inputs are not empty
    if(input.name !== '' && input.calories !== ''){
      // add item to data structure
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add item to UI
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show total calories
      UICtrl.showTotalCalories(totalCalories);

      // clear input field
      UICtrl.clearInput();
    }

    e.preventDefault();  
  }

  const editItemClick = function(e){
    if(e.target.classList.contains('edit-item')) {
      // get item list id
      const listId = e.target.parentNode.parentNode.id;
      
      // break into an array
      const listIdArr = listId.split('-');

      // get actual id
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add current item to form for update
      UICtrl.addItemToForm();
    }
  }

  return {
    init: function() {
      UICtrl.setInitialState();

      // fetch items from data structure (item ctrl) 
      const items = ItemCtrl.getItems();

      // check if item list is empty
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items 
        UICtrl.populateItems(items);
      }

      // load event listners
      loadEventListners();
    }
  } 
})(ItemCtrl, UICtrl);   


// Initialize App
App.init();  