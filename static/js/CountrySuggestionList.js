class CountrySuggestionList {
    constructor(allCountriesList, container, countryInput) {
        this.allCountriesList = allCountriesList
        this.list = []
        this.countryInput = countryInput
        this.container = container
        this.currentFocusIndex = 0

        this.countryInput.addEventListener("keydown", (e) => this.UpdateFocused(e))
    }

    IsEmpty() {
        return this.list.length === 0
    }

    Show(suggestionList) {
        this.currentFocusIndex = 0
        this.container.innerHTML = '';
        this.container.style.display = "flex";
        this.UpdateCountrySuggestionList(suggestionList)
    }

    Hide() {
        this.currentFocusIndex = 0
        this.container.style.display = "none";
        this.container.innerHTML = '';
    }

    UpdateCountrySuggestionList(suggestionList) {
        this.list = this.countryInput.value.length === 0 ? this.allCountriesList : suggestionList
        for(let i = 0; i < this.list.length; i++) {
            let countryNode= document.createElement("div");
            countryNode.classList.add("suggestion")

            let countryFlag= document.createElement("img");
            countryFlag.classList.add("flagList")
            countryFlag.src = `./static/images/flags/${this.list[i].code}.svg`
            let countryText= document.createElement("div");
            countryText.innerHTML = this.list[i].name
            countryNode.appendChild(countryFlag)
            countryNode.appendChild(countryText)

            countryNode.addEventListener("click", () => {
                this.SelectCountry(i)
            })
            countryNode.addEventListener("mouseover", () => {
                this.UnfocusCurrent()
                this.currentFocusIndex = i
                this.ToggleFocus(countryNode, true)
            })
            countryNode.addEventListener("mouseout", () => {
                this.ToggleFocus(countryNode, false)
            })
            this.container.appendChild(countryNode)
        }
        if(this.list.length === 0) {
            this.Hide()
            return
        }
        this.ToggleFocus(this.container.children[0], true)
        this.container.children[0].scrollIntoViewIfNeeded ? 
        this.container.children[0].scrollIntoViewIfNeeded(false) : 
        this.container.children[0].scrollIntoView({block: "nearest", inline: "nearest"})
    }

    SelectCountry(index) {
        this.Hide()
        this.countryInput.value = this.list[index].name
        this.countryInput.focus()
        currentCountry = this.list[index].code
        this.container.innerHTML = "";
        this.currentFocusIndex = 0;
        this.list = []
    }

    ToggleFocus(countryNode, setOn) {
        setOn ? countryNode.classList.add("suggestionFocus") : countryNode.classList.remove("suggestionFocus")
    }

    UnfocusCurrent() {
        if(this.currentFocusIndex >= 0 && this.currentFocusIndex < this.list.length) {
            let currentFocus = this.container.children[this.currentFocusIndex]
            this.ToggleFocus(currentFocus, false)
        }
    }

    SetNewFocus(newIndex) {
        this.UnfocusCurrent();
        let newCountryNode = this.container.children[newIndex]
        this.ToggleFocus(newCountryNode, true)
        this.countryInput.value = newCountryNode.innerText

        this.container.children[newIndex].scrollIntoViewIfNeeded ? 
        this.container.children[newIndex].scrollIntoViewIfNeeded(false) : 
        this.container.children[newIndex].scrollIntoView({block: "nearest", inline: "nearest"})

        this.currentFocusIndex = newIndex
    }

    UpdateFocused(event) {
        if(this.list.length === 0) {
            return
        }
        if(event.keyCode === 40){ // DOWN
            event.preventDefault()
            let newIndex = this.currentFocusIndex + 1 >= this.list.length ? 0 : this.currentFocusIndex + 1
            this.SetNewFocus(newIndex)
        }
        else if(event.keyCode === 38){ // UP
            event.preventDefault()
            let newIndex = this.currentFocusIndex - 1 < 0 ? this.list.length - 1 : this.currentFocusIndex - 1
            this.SetNewFocus(newIndex)
        } else if(event.key === "Enter" && this.list.length > 0) {
            this.SelectCountry(this.currentFocusIndex)
        }
    }
}