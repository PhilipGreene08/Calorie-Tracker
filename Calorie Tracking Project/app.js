//storage controller
const StorageCtrl = (function () {
    return {
        storeItem: function (item) {
            let items
            //check if items in LS
            if (localStorage.getItem('items') === null) {
                items = []
                items.push(item)
                //set LS
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                //get item and turn from string into array
                items = JSON.parse(localStorage.getItem('items'))
                //push new item into items
                items.push(item)
                //reset lS - turn from array of data into a string to be stored
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items')
        }
    }
})()




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
        // items: [
        //     // { id: 0, name: 'steak dinner', calories: 1200 },
        //     // { id: 1, name: 'cookie', calories: 400 },
        //     // { id: 2, name: 'eggs', calories: 300 },
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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
                if (item.id === id) {
                    found = item
                }
            });
            return found
        },
        updateItem: function (name, calories) {
            //calories to number
            calories = parseInt(calories)

            let found = null

            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })
            return found
        },
        deleteItem(id) {
            //get the ids
            ids = data.items.map((item) => {
                return item.id
            })

            //get index
            const index = ids.indexOf(id)

            //remove item
            data.items.splice(index, 1)
        },
        clearAllItems: function () {
            data.items = []
        },
        setCurrentItem: function (item) {
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
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
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
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            //turn node list into array
            listItems = Array.from(listItems)

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id')

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>`
                }
            })
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
        deleteListItem: function (id) {
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
        },
        clearEditState: function () {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            //turn to array
            listItems = Array.from(listItems)

            listItems.forEach((item) => {
                item.remove()
            })
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
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors()
        //add item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        //disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

        //delete item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
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

            //store in LS
            StorageCtrl.storeItem(newItem)
            //clear input
            UICtrl.clearInput()

        }

        e.preventDefault()
    }

    //update item submit
    const itemEditClick = function (e) {
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

    //delete button

    const itemDeleteSubmit = function (e) {
        //get id from current item
        const currentItem = ItemCtrl.getCurrentItem()

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id)

        //delete from UI
        UICtrl.deleteListItem(currentItem.id)

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //show calories in UI
        UICtrl.showTotalCalories(totalCalories)

        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    //update item
    const itemUpdateSubmit = function (e) {

        const input = UICtrl.getItemInput()

        //update item

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        //update ui
        UICtrl.updateListItem(updatedItem)
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //show calories in UI
        UICtrl.showTotalCalories(totalCalories)

        //update LS 
        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    //clear all items
    const clearAllItemsClick = function () {
        //delete all items from data structure
        ItemCtrl.clearAllItems()
        //update calories
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //show calories in UI
        UICtrl.showTotalCalories(totalCalories)

        UICtrl.clearEditState()
        //reove from UI
        UICtrl.removeItems()
        StorageCtrl.clearItemsFromStorage()
        UICtrl.hideList()
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
})(ItemCtrl, StorageCtrl, UICtrl)

App.init()