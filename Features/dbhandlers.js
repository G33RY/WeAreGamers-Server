const mongodb = require('mongoose');
const ttl = require('mongoose-ttl');
const moment = require('moment');

const mongoose = mongodb.createConnection("mongodb+srv://G33RY:LOLminecraft.1@wearegamerswebsite-kidmz.mongodb.net/WeAreGamers_Website?retryWrites=true", { useNewUrlParser: true });
const mongoose2 = mongodb.createConnection("mongodb+srv://Denes:MONGODB1234@wearegamerswebsite-kidmz.mongodb.net/HelpDesk?retryWrites=true", { useNewUrlParser: true });
mongodb.set('useFindAndModify', false)

    // Counters
    const Counters_Schema = new mongodb.Schema({
        userid: String,
        commands: Number,
        messages: Number
    }); const Counters = mongoose.model('Counters', Counters_Schema)

        //Global Counters 
    const GlobalCounters_Schema = new mongodb.Schema({
        id: Number,
        commands: Number,
        messages: Number
    }); const GlobalCounters = mongoose.model('GCounters', GlobalCounters_Schema)
    
    // Message Counters
    const MessageCounters_Schema = new mongodb.Schema({
        userid: String,
        score: Number,
        added_on: {type: Date, default: moment().add(1, 'hours').format('YYYY MM DD')},
    }); MessageCounters_Schema.plugin(ttl, {ttl: 1000*60*60*24*7})
    const MessageCounters = mongoose.model('MessageCounters',MessageCounters_Schema); MessageCounters.startTTLReaper()
    
    // Command Counters
    const CommandCounters_Schema = new mongodb.Schema({
        userid: String,
        score: Number,
        added_on: {type: Date, default: moment().add(1, 'hours').format('YYYY MM DD')},
    }); CommandCounters_Schema.plugin(ttl, {ttl: 1000*60*60*24*7})
    const CommandCounters = mongoose.model('CommandCounters', CommandCounters_Schema); CommandCounters.startTTLReaper()
    
    // Inventory
    const Inventory_Schema = new mongodb.Schema({
        userid: String,
        DJ: Number,
        channel: Number,
        Arany: Number,
        Gyémánt: Number
    }); const Inventory = mongoose.model('inventorys', Inventory_Schema);

    // Inventory
    const Queues_Schema = new mongodb.Schema({
        userid: String,
        queue: Array
    }); const Queue = mongoose.model('queues', Queues_Schema);
    
    // User Infos
    const UserInfos_Schema = new mongodb.Schema({
        usertoken: String,
        userid: String,
        username: String,
        email: String,
        avatar: String,
        onserver: Boolean
    }); const UserInfos = mongoose.model('userinfos', UserInfos_Schema);
    
    // Online Hours Tracker
    const OnlineHoursTracker_Schema = new mongodb.Schema({
        userid: String,
        LastConnectTime: Date,
        LastLeaveTime: Date,
        LastOnlineTime: Number,
        AllOnlineTime: Number,
    }); const OnlineHoursTracker = mongoose.model('onlinetracker', OnlineHoursTracker_Schema);
    
    // Rewards After Levels
    const RewardsAfterLevels_Schema = new mongodb.Schema({
        level: Number,
        money_reward: Number,
        role_reward: String
    }); const RewardsAfterLevels = mongoose.model('levelrewards', RewardsAfterLevels_Schema);

    // Leveling
    const LevelingDB_Schema = new mongodb.Schema({
        userid: String,
        xp: Number,
        level: Number
    }); const LevelingDB = mongoose.model("levelings", LevelingDB_Schema)

    // Economy
    const EconomyDB_Schema = new mongodb.Schema({
        userid: String,
        balance: Number,
        daily: Number,
    });
    const EconomyDB = mongoose.model("economies", EconomyDB_Schema)

    //HelpDesk
    const helpDesk = mongoose2.model('helpdeskusers', {
        userid: String,
        credit: Number,
        email: String,
        perm_id: String
    }); 



module.exports = {
    FindCounters: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await Counters.find(ToFind)
            return func;
        }else{
            const func = await Counters.find()
            return func;
        }
    },
    FindGlobalCounters: async function(){ 
        if(typeof ToFind != "string"){
            const func = await GlobalCounters.find({id: 1})
            return func;
        }else{
            const func = await GlobalCounters.find()
            return func;
        }
    },
    FindMessageCounters: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await MessageCounters.find(ToFind)
            return func;
        }else{
            const func = await MessageCounters.find()
            return func;
        }
    },
    FindCommandCounters: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await CommandCounters.find(ToFind)
            return func;
        }else{
            const func = await CommandCounters.find()
            return func;
        }
    },
    FindInventory: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await Inventory.find(ToFind)
            return func;
        }else{
            const func = await Inventory.find()
            return func;
        }
    },
    FindQueue: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await Queue.find(ToFind)
            return func;
        }else{
            const func = await Queue.find()
            return func;
        }
    },
    FindUserInfos: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await UserInfos.find(ToFind)
            return func;
        }else{
            const func = await UserInfos.find()
            return func;
        }
    },
    FindOnlineHoursTracker: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await OnlineHoursTracker.find(ToFind)
            return func;
        }else{
            const func = await OnlineHoursTracker.find()
            return func;
        }
    },
    FindRewardsAfterLevels: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await RewardsAfterLevels.find(ToFind)
            return func;
        }else{
            const func = await RewardsAfterLevels.find()
            return func;
        }
    },
    FindLevelingDB: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await LevelingDB.find(ToFind)
            return func;
        }else{
            const func = await LevelingDB.find()
            return func;
        }
    },
    FindEconomyDB: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await EconomyDB.find(ToFind)
            return func;
        }else{
            const func = await EconomyDB.find()
            return func;
        }
    },
    FindHelpDesk: async function(ToFind){ 
        if(typeof ToFind != "string"){
            const func = await helpDesk.find(ToFind)
            return func;
        }else{
            const func = await helpDesk.find()
            return func;
        }
    },


    FindOneCounters: async function(ToFind){ 
        const func = await Counters.findOne(ToFind)
        return func;
    },
    FindOneGlobalCounters: async function(){ 
        const func = await GlobalCounters.findOne({id: 1})
        return func;
    },
    FindOneMessageCounters: async function(ToFind){ 
        const func = await MessageCounters.findOne(ToFind)
        return func;
    },
    FindOneCommandCounters: async function(ToFind){ 
        const func = await CommandCounters.findOne(ToFind)
        return func;
    },
    FindOneInventory: async function(ToFind){ 
        const func = await Inventory.findOne(ToFind)
        return func;
    },
    FindOneQueue: async function(ToFind){ 
        const func = await Queue.findOne(ToFind)
        return func;
    },
    FindOneUserInfos: async function(ToFind){ 
        const func = await UserInfos.findOne(ToFind)
        return func;
    },
    FindOneOnlineHoursTracker: async function(ToFind){ 
        const func = await OnlineHoursTracker.findOne(ToFind)
        return func;
    },
    FindOneRewardsAfterLevels: async function(ToFind){ 
        const func = await RewardsAfterLevels.findOne(ToFind)
        return func;
    },
    FindOneLevelingDB: async function(ToFind){ 
        const func = await LevelingDB.findOne(ToFind)

        return func;
    },
    FindOneEconomyDB: async function(ToFind){ 
        const func = await EconomyDB.findOne(ToFind)
        return func;
    },
    FindOneHelpDesk: async function(ToFind){ 
        const func = await helpDesk.findOne(ToFind)
        return func;
    },


    UpdateCounters: async function(ToFind, data){
        const func = await Counters.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateGlobalCounters: async function(data){ 
        const func = await GlobalCounters.findOneAndUpdate({id: 1}, data)
        return func;
    },
    UpdateMessageCounters: async function(ToFind, data){ 
        const func = await MessageCounters.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateCommandCounters: async function(ToFind, data){ 
        const func = await CommandCounters.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateInventory: async function(ToFind, data){ 
        const func = await Inventory.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateQueue: async function(ToFind, data){ 
        const func = await Queue.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateUserInfos: async function(ToFind, data){ 
        const func = await UserInfos.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateOnlineHoursTracker: async function(ToFind, data){ 
        const func = await OnlineHoursTracker.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateRewardsAfterLevels: async function(ToFind, data){ 
        const func = await RewardsAfterLevels.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateLevelingDB: async function(ToFind, data){ 
        const func = await LevelingDB.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateEconomyDB: async function(ToFind, data){ 
        const func = await EconomyDB.findOneAndUpdate(ToFind, data)
        return func;
    },
    UpdateHelpDesk: async function(ToFind, data){ 
        const func = await helpDesk.findOneAndUpdate(ToFind, data)
        return func;
    },


    CreateCounters: async function(data){
        const func = await Counters.create(data)
        return func;
    },
    CreateGlobalCounters: async function(data){ 
        const func = await GlobalCounters.create(data)
        return func;
    },
    CreateMessageCounters: async function(data){ 
        const func = await MessageCounters.create(data)
        return func;
    },
    CreateCommandCounters: async function(data){ 
        const func = await CommandCounters.create(data)
        return func;
    },
    CreateInventory: async function(data){ 
        const func = await Inventory.create(data)
        return func;
    },
    CreateQueue: async function(data){ 
        const func = await Queue.create(data)
        return func;
    },
    CreateUserInfos: async function(data){ 
        const func = await UserInfos.create(data)
        return func;
    },
    CreateOnlineHoursTracker: async function(data){ 
        const func = await OnlineHoursTracker.create(data)
        return func;
    },
    CreateRewardsAfterLevels: async function(data){ 
        const func = await RewardsAfterLevels.create(data)
        return func;
    },
    CreateLevelingDB: async function(data){ 
        const func = await LevelingDB.create(data)
        return func;
    },
    CreateEconomyDB: async function(data){ 
        const func = await EconomyDB.create(data)
        return func;
    },
    CreateHelpDesk: async function(data){ 
        const func = await helpDesk.create(data)
        return func;
    },
}






    


















