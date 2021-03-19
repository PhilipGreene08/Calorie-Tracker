//storage controller





//item controller
const ItemCtrl = (function () {
    //item contructor
    const Item = function (id, name, calories) {
        this.id = id,
            this.name = name,
            this.calories = calories
    }

    //data structure / state
    const data = {
        items: [
            // { id: 0, name: 'steak dinner', calories: 1200 },
            // { id: 1, name: 'cookie', calories: 400 },
            // { id: 2, name: 'eggs', calories: 300 },
        ],
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let id
            //create ID
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1
            } else {
                id = 0
            }

            //calories to number form string
            calories = parseInt(calories) //change to number 

            //create new Item
            newItem = new Item(id, name, calories)

            //push new item to data.items
            data.items.push(newItem)

            return newItem
        },
        getItemById: function (id) {
            let found = null
            //looop
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item
                }
            });
            return found
        },
        setCurrentItem: function(item) {
            data.currentItem = item
        },
        getCurrentItem: function () {
            return data.currentItem
        },
        getTotalCalories: function () {
            let total = 0
            //loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories
            })
            //set total cal in data structure
            data.totalCalories = total

            return data.totalCalories
        },
        logData: function () {
            return data
        }
    }
})()





//ui controller
const UICtrl = (function () {
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

    // public
    return {
        populateItemList: function (items) {
            let html = ''

            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
                </li>`
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            //show the list 
            document.querySelector(UISelectors.itemList).style.display = 'block'
            //create li element
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>`
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        clearEditState: function () {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },
        showEditState: function () {

            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = ''
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        getSelectors: function () {
            return UISelectors
        }
    }
})()





//app controller
const App = (function (ItemCtrl, UICtrl) {
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors()
        //add item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
    }

    //add item submit
    const itemAddSubmit = function (e) {
        //get form input from UI controller
        const input = UICtrl.getItemInput()
        //check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            //add to UI list
            UICtrl.addListItem(newItem)
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            //show calories in UI
            UICtrl.showTotalCalories(totalCalories)
            //clear input
            UICtrl.clearInput()

        }

        e.preventDefault()
    }

    //update item submit
    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //get list item id
            const listId = e.target.parentNode.parentNode.id

            //break into array
            const listIdArr = listId.split('-')

            //get the actual id
            const id = parseInt(listIdArr[1])

            //get item
            const itemToEdit = ItemCtrl.getItemById(id)

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit)

            //add item to meal bar
            UICtrl.addItemToForm()
            //console.log(itemToEdit)
        }
        e.preventDefault()
    }

    //public methods
    return {
        init: function () {
            //clear edit state - set init state
            UICtrl.clearEditState()
            //fetch items from data controller
            const items = ItemCtrl.getItems()

            //check if items exist
            if (items.length === 0) {
                UICtrl.hideList()
            } else { //populate list with items
                UICtrl.populateItemList(items)
                console.log(items)
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            //show calories in UI
            UICtrl.showTotalCalories(totalCalories)

            //loadevent listeners
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

App.init()