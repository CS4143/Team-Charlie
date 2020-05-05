 CharacterSheet = {

    characterName : "",
    characterClass : "none",
    characterLvl : 1,
    characterRace : "none",
    characterSex : "none",
    characterBG : "",
    characterAlignment : "",
    characterPlayerName : "",
    characterExp : 0,

    proficiency : 2,

    strength : 10,
    dexterity : 10,
    constitution : 10,
    intelligence : 10,
    wisdom : 10,
    charisma : 10,

    strengthMod : floor((strength - 10) /2),
    dexterityMod : floor((dexterity - 10) /2),
    constitutionMod : floor((constitution - 10) /2),
    intelligenceMod : floor((intelligence - 10) /2),
    wisdomMod : floor((wisdom - 10) /2),
    charismaMod : floor((charisma - 10) /2),

    savingThrowStrength : 0,
    savingThrowDexterity : 0,
    savingThrowConstitution : 0,
    savingThrowIntelligence : 0,
    savingThrowWisdom : 0,
    savingThrowCharisma : 0,

    savingThrowStrengthProficiency : 0,
    savingThrowDexterityProficiency : 0,
    savingThrowConstitutionProficiency : 0,
    savingThrowIntelligenceProficiency : 0,
    savingThrowWisdomProficiency : 0,
    savingThrowCharismaProficiency : 0,

    initiative : dexterityMod,
    speed : 30,

    hitPoints : 0,
    currentHitPoints : 0,

    armour : 10,
    shield : 0,

    treasures : [],

    acrobatics_Proficiency : 0,
    animal_Handling_Proficiency : 0,
    arcana_Proficiency : 0,
    athletics_Proficiency : 0,
    deception_Proficiency : 0,
    history_Proficiency : 0,
    insight_Proficiency : 0,
    intimidation_Proficiency : 0,
    investigation_Proficiency : 0,
    medicine_Proficiency : 0,
    nature_Proficiency : 0,
    perception_Proficiency : 0,
    performance_Proficiency : 0,
    persuasion_Proficiency : 0,
    religion_Proficiency : 0,
    sleight_of_Hand_Proficiency : 0,
    stealth_Proficiency : 0,
    survival_Proficiency : 0,

    

    acrobatics_     : dexterityMod * (acrobatics_Proficiency * proficiency),
    animal_Handling_ : dexterityMod * (animal_Handling_Proficiency* proficiency),
    arcana_         : dexterityMod * (arcana_Proficiency * proficiency),
    athletics_      : dexterityMod * (athletics_Proficiency * proficiency),
    deception_      : dexterityMod * (deception_Proficiency * proficiency),
    history_        : dexterityMod * (history_Proficiency * proficiency),
    insight_        : dexterityMod * (insight_Proficiency * proficiency),
    intimidation_   : dexterityMod * (intimidation_Proficiency * proficiency),
    investigation_ : dexterityMod  * (investigation_Proficiency * proficiency),
    medicine_       : dexterityMod * (medicine_Proficiency * proficiency),
    nature_         : dexterityMod * (nature_Proficiency * proficiency),
    perception_     : dexterityMod * (perception_Proficiency * proficiency),
    performance_    : dexterityMod * (performance_Proficiency * proficiency),
    persuasion_     : dexterityMod * (persuasion_Proficiency * proficiency),
    religion_       : dexterityMod * (religion_Proficiency * proficiency),
    sleight_of_Hand_ : dexterityMod * (sleight_of_Hand_Proficiency * proficiency),
    stealth_        : dexterityMod * (stealth_Proficiency * proficiency),
    survival_       : dexterityMod * (survival_Proficiency * proficiency),

    weapon1 : "",
    weapon1DMG : "",
    weapon2 : "",
    weapon2DMG : "",
    weapon3 : "",
    weapon3DMG : "",
    weapon4 : "",
    weapon4DMG : "",

    setData: function(){
        //load data from data base
        
        //render stat updates to the screen
        this.render();
     
    },

    updateData: function(){

        this.characterName = document.getElementById("CharacterName").value;
        this.characterClass = document.getElementById("Class").value;
        this.characterLvl = document.getElementById("level").value;
        this.characterRace = document.getElementById("Race").value;
        this.characterSex = document.getElementById("Sex").value;
        this.characterBG = document.getElementById("Background").value;
        this.characterAlignment = document.getElementById("Alignment").value;
        this.characterPlayerName = document.getElementById("PlayerName").value;
        this.characterExp = document.getElementById("Exp").value;

        this.proficiency = 1 + Math.ceil(this.characterLvl/4);

        this.strength = document.getElementById("Strength").value;
        this.dexterity = document.getElementById("Dexterity").value;
        this.constitution = document.getElementById("Constitution").value;
        this.intelligence = document.getElementById("Intelligence").value;
        this.wisdom = document.getElementById("Wisdom").value;
        this.charisma = document.getElementById("Charisma").value;

        this.strengthMod = Math.floor((this.strength - 10) /2);
        this.dexterityMod = Math.floor((this.dexterity - 10) /2);
        this.constitutionMod = Math.floor((this.constitution - 10) /2);
        this.intelligenceMod = Math.floor((this.intelligence - 10) /2);
        this.wisdomMod = Math.floor((this.wisdom - 10) /2);
        this.charismaMod = Math.floor((this.charisma - 10) /2); 

        this.savingThrowStrengthProficiency = document.getElementById("StrengthSTP").value;
        this.savingThrowDexterityProficiency = document.getElementById("DexteritySTP").value;
        this.savingThrowConstitutionProficiency = document.getElementById("ConstitutionSTP").value;
        this.savingThrowIntelligenceProficiency = document.getElementById("IntelligenceSTP").value;
        this.savingThrowWisdomProficiency = document.getElementById("WisdomSTP").value;
        this.savingThrowCharismaProficiency = document.getElementById("CharismaSTP").value;

        this.savingThrowStrength = this.strengthMod + (this.savingThrowStrengthProficiency * this.proficiency);
        this.savingThrowDexterity = this.strengthMod + (this.savingThrowDexterityProficiency * this.proficiency);
        this.savingThrowConstitution = this.strengthMod + (this.savingThrowConstitutionProficiency * this.proficiency);
        this.savingThrowIntelligence = this.strengthMod + (this.savingThrowIntelligenceProficiency * this.proficiency);
        this.savingThrowWisdom = this.strengthMod + (this.savingThrowWisdomProficiency * this.proficiency);
        this.savingThrowCharisma = this.strengthMod + (this.savingThrowCharismaProficiency * this.proficiency);

        this.initiative = this.dexterityMod;
        this.speed = document.getElementById("Speed").value;

        this.hitPoints = document.getElementById("HitPoints").value;
        this.currentHitPoints = document.getElementById("CurrentHP").value;

        this.armour = document.getElementById("Armour").value;
        this.shield = document.getElementById("Shield").value;

        

        this.acrobatics_Proficiency = document.getElementById("Acrobatics_Proficiency").value;
        this.animal_Handling_Proficiency = document.getElementById("Animal_Handling_Proficiency").value;
        this.arcana_Proficiency = document.getElementById("Arcana_Proficiency").value;
        this.athletics_Proficiency = document.getElementById("Athletics_Proficiency").value;
        this.deception_Proficiency = document.getElementById("Deception_Proficiency").value;
        this.history_Proficiency = document.getElementById("History_Proficiency").value;
        this.insight_Proficiency = document.getElementById("Insight_Proficiency").value;
        this.intimidation_Proficiency = document.getElementById("Intimidation_Proficiency").value;
        this.investigation_Proficiency = document.getElementById("Investigation_Proficiency").value;
        this.medicine_Proficiency = document.getElementById("Medicine_Proficiency").value;
        this.nature_Proficiency = document.getElementById("Nature_Proficiency").value;
        this.perception_Proficiency = document.getElementById("Perception_Proficiency").value;
        this.performance_Proficiency = document.getElementById("Performance_Proficiency").value;
        this.persuasion_Proficiency = document.getElementById("Persuasion_Proficiency").value;
        this.religion_Proficiency = document.getElementById("Religion_Proficiency").value;
        this.sleight_of_Hand_Proficiency = document.getElementById("Sleight_of_Hand_Proficiency").value;
        this.stealth_Proficiency = document.getElementById("Stealth_Proficiency").value;
        this.survival_Proficiency = document.getElementById("Survival_Proficiency").value;
    
        
        
        this.acrobatics_     = this.dexterityMod * (this.acrobatics_Proficiency * this.proficiency);
        this.animal_Handling_ = this.dexterityMod * (this.animal_Handling_Proficiency* this.proficiency);
        this.arcana_         = this.dexterityMod * (this.arcana_Proficiency * this.proficiency);
        this.athletics_      = this.dexterityMod * (this.athletics_Proficiency * this.proficiency);
        this.deception_      = this.dexterityMod * (this.deception_Proficiency * this.proficiency);
        this.history_        = this.dexterityMod * (this.history_Proficiency * this.proficiency);
        this.insight_        = this.dexterityMod * (this.insight_Proficiency * this.proficiency);
        this.intimidation_   = this.dexterityMod * (this.intimidation_Proficiency * this.proficiency);
        this.investigation_ = this.dexterityMod  * (this.investigation_Proficiency * this.proficiency);
        this.medicine_       = this.dexterityMod * (this.medicine_Proficiency * this.proficiency);
        this.nature_         = this.dexterityMod * (this.nature_Proficiency * this.proficiency);
        this.perception_     = this.dexterityMod * (this.perception_Proficiency * this.proficiency);
        this.performance_    = this.dexterityMod * (this.performance_Proficiency * this.proficiency);
        this.persuasion_     = this.dexterityMod * (this.persuasion_Proficiency * this.proficiency);
        this.religion_       = this.dexterityMod * (this.religion_Proficiency * this.proficiency);
        this.sleight_of_Hand_ = this.dexterityMod * (this.sleight_of_Hand_Proficiency * this.proficiency);
        this.stealth_        = this.dexterityMod * (this.stealth_Proficiency * this.proficiency);
        this.survival_       = this.dexterityMod * (this.survival_Proficiency * this.proficiency);

        this.weapon1 = document.getElementById("WeaponSlot1").value;
        this.weapon1DMG = document.getElementById("Weapon1DMG").value;
        this.weapon2 = document.getElementById("WeaponSlot2").value;
        this.weapon2DMG = document.getElementById("Weapon2DMG").value;
        this.weapon3 = document.getElementById("WeaponSlot3").value;
        this.weapon3DMG = document.getElementById("Weapon3DMG").value;
        this.weapon4 = document.getElementById("WeaponSlot4").value;
        this.weapon4DMG = document.getElementById("Weapon4DMG").value;
        
        this.render();
        
    },
    updateInv: function(){
        //update treasure and stuff
        
        render();
    },

    render: function(){
        //updates character sheet values on documnet
        document.getElementById("CharacterName").value = this.characterName;
        document.getElementById("Class").value = this.characterClass;
        document.getElementById("level").value = this.characterLvl;
        document.getElementById("Race").value = this.characterRace;
        document.getElementById("Sex").value = this.characterSex;
        document.getElementById("Background").value = this.characterBG;
        document.getElementById("Alignment").value = this.characterAlignment
        document.getElementById("PlayerName").value =this.characterPlayerName;
        document.getElementById("Exp").value =this.characterExp;

        document.getElementById("proficiency").value = this.proficiency;

        document.getElementById("").value = this.strength;
        
        //FINISH THE REST LATER


    },

    updataDB: function(){
        //send character sheet changes to the database

    }
    


}


function submit(){
    var data = {
        
    }
}