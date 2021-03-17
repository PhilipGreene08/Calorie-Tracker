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
            { id: 0, name: 'steak dinner', calories: 1200 },
            { id: 1, name: 'cookie', calories: 400 },
            { id: 2, name: 'eggs', calories: 300 },
        ],
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        getItems: function () {
            return data.items
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
        itemName: '#item-name',
        itemCalories: '#item-calories'
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
                name:document.querySelector(UISelectors.itemName),
                calories:document.querySelector(UISelectors.itemCalories)
            }
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
    const itemAddSubmit = function(e){
        //get form input from UI controller
        const input = UIController.getItemInput()

        e.preventDefault()
    }

    //public methods
    return {
        init: function () {
            //fetch items from data controller
            const items = ItemCtrl.getItems()

            //populate list with items
            UICtrl.populateItemList(items)
            console.log(items)

            //loadevent listeners
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

App.init()