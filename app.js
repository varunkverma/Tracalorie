// Storage Controller
const StorageCtrl = ( () => {
    
    // public methods
    return {
        storeItem : (item) => {
            let items = [];
            
            // Check if there are items in localStorage or not
            if(JSON.parse(localStorage.getItem('items'))){
                // in case, there are some items present then assign those itesm to the items array
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item);
            localStorage.setItem('items',JSON.stringify(items));
        },
        getItemsFromStorage : () => {
            let items =[];

            // Check if there are items in localStorage or not
            if(JSON.parse(localStorage.getItem('items'))){
                // in case, there are some items present then assign those itesm to the items array
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemInLocalStorage : (newItem) => {
            let items;
            // Get items from localStorage
            items = JSON.parse(localStorage.getItem('items'));

            // check for an item with the same item as the id of newItem and then update the info Item
            items.forEach( (item) => {
                if(item.id === newItem.id){
                    item.name = newItem.name;
                    item.calories = newItem.calories;
                }
            });

            //or
            // items.forEach( (item,index) => {
            //     if(item.id === newItem.id){
            //         items.splice(index,1,newItem);
            //     }
            // } );

            // store the updated items list in the localStorage
            localStorage.setItem('items',JSON.stringify(items));
        },

        deleteItemFromLocalStorage : (id) => {
            let items;
            // Get items from localStorage
            items = JSON.parse(localStorage.getItem('items'));

            // check for an item with the same item as the id of newItem and then update the info Item

            items.forEach( (item,index) => {
                if(item.id === id){
                    items.splice(index,1);
                }
            } );

            // store the updated items list in the localStorage
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearAllItemsFromLocalStorage : () => {

            // Set items array as an item array 
            //localStorage.setItem('items',JSON.stringify([]));
            
            //or just clear the local storage
            localStorage.clear();
        }
    };
})();


// Item Controller

const ItemCtrl = (() => {
    
    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories : 0
    }

    // Public part
    return {
        getItems : () =>data.items,

        getTotalCalories : () => {
            let total = 0;
            data.items.forEach( (item) => total+=item.calories);

            // Set total calories in data structure
            data.totalCalories = total;

            // return total calories
            return data.totalCalories; 
        },
        getItemById : (id) => {
            const item=data.items.filter((item) => id===item.id)
            
            //If item is found, return it. Else. return null
            return item.length !== 0 ? item[0] : null;
        },

        getCurrentItem : () => data.currentItem ,

        setCurrentItem : (item) => data.currentItem = item ,
        
        logData : () => data,
        
        addItem : (name,calories) =>{
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id +1;
            }
            else{
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new Item
            const newItem = new Item(ID,name,calories);

            // Add new item to the data structure's item array 
            data.items.push(newItem);

            // return new item
            return newItem;
            
        },

        updateItem: (name,calories) =>{
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach( (item) =>{
                if(item.id === data.currentItem.id)
                {
                    item.name=name;
                    item.calories=calories;
                    found=item;
                }
            });
            return found;
        },

        deleteItem : (id) => {
            // Get ids
            const ids = data.items.map( (item) => item.id);

            // Get index of id
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index,1);
        },

        deleteAllItems : () => {
            
            // Delete all items
            data.items = [];
        }
    };
})();

// UI Controller

const UICtrl = (() => {
    // UI Element Selector
    const UISelectors = {
        itemList : 'item-list',
        itemNameInput : 'item-name',
        itemCaloriesInput : 'item-calories',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        totalCalories : '.total-calories',
        clearBtn : '.clear-btn'
        
    }


    // public methods
    return {
        populateItemList: (items) => {

            let html='';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`
            });

            // Insert list items
            document.getElementById(UISelectors.itemList).innerHTML=html;
        },
        getUISelectors: () => UISelectors,
        getItemInput: () => (
            {
                name : document.getElementById(UISelectors.itemNameInput).value,
                calories : document.getElementById(UISelectors.itemCaloriesInput).value
            }),
        addListItem : (item) => {
            // Show the item list
            document.getElementById(UISelectors.itemList).style.display='block';

            // Create li element
            const li=document.createElement('li');

            // Add classes in li
            li.className='collection-item';

            // Add id in li
            li.id=`item-${item.id}`;

            // Add HTML in li
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            
             // Insert li element in ul
            document.getElementById(UISelectors.itemList).insertAdjacentElement('beforeend',li);

        },

        addItemToForm : () => {

            // add item's name in the item name input field
            document.getElementById(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;

            // add item's calories in the item calories input field
            document.getElementById(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;

            // Show Edit State

            UICtrl.showEditState();
        },

        showTotalCalories : (totalCalories) => document.querySelector(UISelectors.totalCalories).textContent = totalCalories 
        ,

        hideList : () => document.getElementById(UISelectors.itemList).style.display ='none',

        clearInputs : () => {
            document.getElementById(UISelectors.itemNameInput).value='';
            document.getElementById(UISelectors.itemCaloriesInput).value='';
        },

        clearEditState : () => {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display ='none'
            document.querySelector(UISelectors.deleteBtn).style.display ='none'
            document.querySelector(UISelectors.backBtn).style.display ='none'
            document.querySelector(UISelectors.addBtn).style.display ='inline'
        },

        showEditState : () => {
            document.querySelector(UISelectors.updateBtn).style.display ='inline'
            document.querySelector(UISelectors.deleteBtn).style.display ='inline'
            document.querySelector(UISelectors.backBtn).style.display ='inline'
            document.querySelector(UISelectors.addBtn).style.display ='none'
        },
        updateItem : (item) => {
            item=document.getElementById(`item-${item.id}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
        },
        deleteListItem : (id) => {
            // Remove item from UI
            item=document.getElementById(`item-${id}`);
            item.remove();
        },
        clearItemList : () => {
            // Remove UI of the ul's child
            const ul = document.getElementById(UISelectors.itemList);
            
            // Remove all children nodes of ul element
            while(ul.firstChild){
                ul.removeChild(ul.firstChild);
            }
        }
        
    };

})();

// App Controller

const App = ((ItemCtrl,StorageCtrl,UICtrl) => {
    
    // Load event listeners
    const loadEventListeners = () =>{
        // Get UI selectors
        const UISelectors = UICtrl.getUISelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress',(e) => {
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click
        document.getElementById(UISelectors.itemList).addEventListener('click',itemEditClick);

        // Update item on Submit(click update button)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item 
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Delete items 
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);  

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    }

    // add item submit
    const itemAddSubmit = (e) => {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            
            // Add item
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            // add item to ul
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // add to local Storage
            StorageCtrl.storeItem(newItem);
            // Clear fields
            UICtrl.clearInputs();

        }

        e.preventDefault();
    }

    // Item edit on click
    const itemEditClick = (e) => {
        if(e.target.classList.contains('edit-item'))
        {
            // Get list item's id (e.g., item-0)
            const listId=e.target.parentElement.parentElement.id;

            // Break into array
            const listIdArr = listId.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item to edit
            const itemToEdit = ItemCtrl.getItemById(id);
            console.log(itemToEdit);

            // Set Current Item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add Current item to form
            UICtrl.addItemToForm();
        }
    }

    // Update item
    const itemUpdateSubmit = (e) =>
    {
        // Get input item
        const item = UICtrl.getItemInput();
         
        // Update item
        const updatedItem = ItemCtrl.updateItem(item.name,item.calories);
        console.log(updatedItem);
        UICtrl.updateItem(updatedItem);

        // Get new total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Set toatal calories on UI
        UICtrl.showTotalCalories(totalCalories);

        // Update item in localStorage

        StorageCtrl.updateItemInLocalStorage(updatedItem);

        // Clear inputs
        UICtrl.clearInputs()

        // Clear edit state
        UICtrl.clearEditState(); 

        e.preventDefault();
    } 

    // Delete item 
    const itemDeleteSubmit = (e) =>
    {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get new total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Set toatal calories on UI
        UICtrl.showTotalCalories(totalCalories);

        // delete item from localStorage
        StorageCtrl.deleteItemFromLocalStorage(currentItem.id);

        // Clear inputs
        UICtrl.clearInputs()

        // Clear edit state
        UICtrl.clearEditState(); 

        e.preventDefault();
    }

    const clearAllItemsClick = (e) => {

        // Delete all items from data structures
        ItemCtrl.deleteAllItems();

        // clear items from UI
        UICtrl.clearItemList();

        // Get new total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Set toatal calories on UI
        UICtrl.showTotalCalories(totalCalories);

        // delete/clear all items from local storage
        StorageCtrl.clearAllItemsFromLocalStorage();

        // Hide items list as its empty
        UICtrl.hideList();
        
        e.preventDefault();
    }

    // Public methods
    return {
        // initialize method
        init : () =>{
            // Clear edit state / set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure of ItemCtrl
            const items = ItemCtrl.getItems();

            // Hide ui element if no items present, else populate with items
            if(items.length === 0){
                UICtrl.hideList();
            }
            else{
                // Populate List with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
            
        }


    }

})(ItemCtrl,StorageCtrl,UICtrl);


// Initializing the app
App.init();

