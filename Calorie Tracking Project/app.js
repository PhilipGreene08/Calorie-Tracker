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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = ''
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
            //clear input
            UICtrl.clearInput()

        }

        e.preventDefault()
    }

    //public methods
    return {
        init: function () {
            //fetch items from data controller
            const items = ItemCtrl.getItems()

            //check if items exist
            if (items.length === 0) {
                UICtrl.hideList()
            } else { //populate list with items
                UICtrl.populateItemList(items)
                console.log(items)
            }

            //loadevent listeners
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

App.init()