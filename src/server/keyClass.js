const keyTypes = {
    City: "City",
    Zipcode: "Zipcode"
}

class key {

    set Key(keyInput) {
        let keyTypes = null;

        switch(keyInput) {
            case "City":
                this.keyTypes = keyTypes.City;
            case "Zipcode":
                let keyTypes = keyTypes.Zipcode;
        }
    }

    set Value(value) {
        this.Value = value;
    }

    get Key() {
        return this.keyTypes;
    }

    get Value() {
        return this.Value;
    }
}

module.exports = key;

