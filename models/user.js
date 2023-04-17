/*[ Import ]*/
const schemas = require("../schemas/paths");
const mongoose = require("mongoose")

//Example class to show how classes work in NodeJS, this one checks for user login

/*[ Handle accounts database ]*/
class User {
    constructor(details) {
        this.id = details.id;
        this.userName = details.userName;
        this.email = details.email;
        this.password = details.password;
    }

    async register() {
        try
        {
            let account = await schemas.User.findOne({ userName: this.userName });
            if (account)
                return { successful: false, message: "user exist" };

            account = await schemas.User.findOne({ email: this.email });
            if (account)
                return { successful: false, message: "mail exist" };
            
            //Verify dvarim etc...

            await schemas.User.create({
                _id: mongoose.Types.ObjectId(),
                userName: this.userName,
                email: this.email,
                password: this.password,
                role: "Junior", //Very, very temporary.
                banned: false,
            });
            return { successful: true, message: "success" };
        }
        catch(verror)  // "var + error = verror"
        {
            console.log(verror);
            return { successful: false, message: "error" };
        }
    }

    /*[ Handling data ]*/
    //Verify account (userName&password) exists in database:
    async verify() {
        let account = await schemas.User.findOne({ userName: this.userName, password: this.password });
        if (account) {
            if (account.banned) {
                return { successful: false, message: "banned" };
            }
            return {
                successful: true,
                user: {
                    id: account.id,
                    userName: this.userName,
                    role: account.role,
                },
            }; //succeseful login
        }
        return { successful: false, message: "not found" }; //couldn't login
    }
    //Example static class, can be accessed without creating an object of the class
    static async staticFunc() {

    }
}

class Admin extends User {
    constructor(details) {
        super(details);
    }
}

class Junior extends User {
    constructor(details) {
        super(details);
    }
}

class Expert extends User {
    constructor(details) {
        super(details);
    }
}

/*[ External access ]*/
module.exports = { User, Admin, Junior, Expert };