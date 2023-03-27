module.exports = class SlashCommand {
    constructor(name, description, tag, clientOwnerOnly, guildAdminOnly, betaOnly){
        this._name = name
        this._description = description
        this._tag = tag

        this._clientOwnerOnly = clientOwnerOnly
        this._guildAdminOnly = guildAdminOnly
        
        this._betaOnly = betaOnly
    }

    get name(){
        return this._name
    }

    get description(){
        return this._description
    }

    get tag(){
        return this._tag
    }


    get clientOwnerOnly(){
        return this._clientOwnerOnly
    }

    get guildOwnerOnly(){
        return this._guildAdminOnly
    }

    get betaOnly(){
        return this._betaOnly
    }

    
}