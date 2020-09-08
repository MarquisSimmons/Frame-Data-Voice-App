/**
 * @author Marquis Simmons
 * This class does all of the work for actually retrieving the frame data from the Character Models
 */

const fs = require('fs');
// 1. Constans that map the user inputs to what their values are in the Model files =============================================
const moveStrengthMapping = {
	Light: 'L',
	Medium: 'M',
	Heavy: 'H',
	'E.X.': 'EX',
};
const frameTypeMapping = {
	'On Hit': 'framesOnHit',
	'On Block': 'framesOnBlock',
	Startup: 'startUpFrames',
	Recovery: 'recoveryFrames',
	Active: 'activeFrames',
};
const vSystemMapping = {
	'V-Skill 2': 'V-Skill 2 Version',
	'V-Skill 1': 'V-Skill 1 Version',
	'V-Trigger 1': 'V-',
	'V-Trigger 2': 'V-',
	'v skill 1': 'V-Skill 1 Version',
	'v skill 2': 'V-Skill 2 Version',
	'v trigger 1': 'V-',
	'v trigger 2': 'V-',
};
const normalMoveMapping = {
	Sweep: 'Crouching HK',
	Roundhouse: 'HK',
	Forward: 'MK',
	Short: 'LK',
	Fierce: 'HP',
	Strong: 'MP',
	Jab: 'LP',
};
const moveSynonyms = [ 'DP', 'Fireball', 'Tatsu', 'Red Fireball' ];

// 2. Functions used to retrieved the frame data from the Character's Model file =============================================

/**
 * 
 * @param {String} character - The SFV character who frames we are looking up
 * @param {String} specialMove - The name of the Special Move or Unique Move we are looking up by name
 * @param {String} moveStrength - The strength of the special move (L, M, H, EX)
 * @param {String} frameType - The type of frames we are looking for (Startup, Active, Recovery, On Hit, On Block) this is set to "Startup" by default
 * @param {String} vSystem - The V-System modifier of the move (if it is performed while V-Trigger or V-Skill is activated)
 */
function retrieveSpecialMoveFrameData(character, specialMove, moveStrength, frameType, vSystem) {
	// Retrieve the character's move file from the Model
	let fullMoveLookup = '';
	let defaultFrameType = frameType !== ' ' ? frameType : 'Startup';
	let move = undefined;

	const lookupVSystem = vSystemMapping[vSystem];
	let lookupMoveStrength = moveStrengthMapping[moveStrength];

	const data = fs.readFileSync('Model/' + character + '.json');
	if (!data) {
		console.log('File: Model/' + character + '.json could not be found');
		return 'There was a problem retrieving frame data for ' + character + '. You can try another character until this is resolved.';
	}
	const returnedData = JSON.parse(data);
	const characterSpecialMoveList = returnedData[character]['Special Moves'];

	if (!specialMove) {
		return 'There was no special move defined';
	}
	if (moveSynonyms.includes(specialMove)) {
		// Case if the move is heard as Fireball, Tatsu, DP etc.
		console.log(specialMove + ': ' + 'has been converted to: ' + ' ' + returnedData[character][specialMove]);
		specialMove = returnedData[character][specialMove];
	}
	// Can be "V-L Special Move" or "L Special Move V-Skill 1 Version"
	switch (lookupVSystem) {
		case undefined:
			fullMoveLookup = lookupMoveStrength ? lookupMoveStrength + ' ' + specialMove : specialMove;
			break;
		case ('V-Skill 1 Version', 'V-Skill 2 Version'):
			fullMoveLookup = lookupMoveStrength + ' ' + specialMove + ' ' + lookupVSystem;
			break;
		default:
			fullMoveLookup = lookupMoveStrength ? lookupVSystem + lookupMoveStrength + ' ' + specialMove : lookupVSystem + specialMove;
			break;
	}
	move = characterSpecialMoveList[fullMoveLookup];

	// Case we find the move successfully with all of the necessary slots filled out
	if (move) {
		console.log(character + "'s " + fullMoveLookup + ' found.');
		return createMoveOutput(move, character, specialMove, defaultFrameType, vSystem, moveStrength);
	}
	else if (!lookupMoveStrength) {
		console.log(character + "'s " + fullMoveLookup + ' not found. Looking up move again with move strength');
		// If we cannot find the move, check if it is because the user did not specify the move strength
		// If move strength is undefined then default it to Light
		// - Note: Some moves do not have move strengths which is why we only want to assign a default move strength iff the move could not be found.
		lookupMoveStrength = 'L';
		moveStrength = 'Light';
		switch (lookupVSystem) {
			case undefined:
				fullMoveLookup = lookupMoveStrength + ' ' + specialMove;
				break;
			case ('V-Skill 1 Version', 'V-Skill 2 Version'):
				fullMoveLookup = lookupMoveStrength + ' ' + specialMove + ' ' + lookupVSystem;
				break;
			default:
				fullMoveLookup = lookupVSystem + lookupMoveStrength + ' ' + specialMove;
				break;
		}
		// Retrieve the move again but this time using a default move strength
		move = characterSpecialMoveList[fullMoveLookup];
		if (move) {
			console.log(character + "'s " + fullMoveLookup + ' found after adding move strength.');
			return createMoveOutput(move, character, specialMove, defaultFrameType, vSystem, moveStrength);
		}
	}
	console.log(character + "'s " + fullMoveLookup + ' not found');
	return 'The frame data for ' + character + "'s " + moveStrength + ' ' + specialMove + ' could not be found';
}

/**
 * 
 * @param {String} character - The SFV character who frames we are looking up
 * @param {String} normalMove - The name of the Normal Move we are looking up (or Unique Move if we are looking it up by command like "Foward Fierce")
 * @param {String} position - The direction that is being held during the move (Up for Jumping, Down for Crouch, Forward, Back etc.)
 * @param {String} frameType - The type of frames we are looking for (Startup, Active, Recovery, On Hit, On Block) this is set to "Startup" by default
 * @param {String} vSystem - The V-System modifier of the move (if it is performed while V-Trigger or V-Skill is activated)
 */
function retrieveNormalMoveFrameData(character, normalMove, position, frameType, vSystem) {
	// Retrieve the character's move file from the Model
	let defaultPosition = position;
	let fullMoveLookup = '';
	let defaultFrameType = frameType !== ' ' ? frameType : 'Startup';
	let move = undefined;

	const lookupVSystem = vSystemMapping[vSystem];
	let lookupNormalMove = normalMoveMapping[normalMove];
	const standardPositions = [ 'Standing', 'Jumping', 'Crouching' ];
	const uniqueMovePositions = [ 'Down Back', 'Down Forward', 'Back', 'Forward' ];

	const data = fs.readFileSync('Model/' + character + '.json');
	if (!data) {
		console.log('File: Model/' + character + '.json could not be found');
		return 'There was a problem retrieving frame data for ' + character + '. You can try another character until this is resolved.';
	}

	let returnedData = JSON.parse(data);
	if (normalMove === 'Super') {
		// If we are looking up a C.A then ignore the position (so we wont get things like "Crouching Super")
		defaultPosition = '';
		const usingVTrigger = lookupVSystem ? true : false;
		move = lookupCriticalArt(returnedData[character], usingVTrigger);
		fullMoveLookup = usingVTrigger ? 'Critical Art during V-Trigger' : 'Critical Art';
		normalMove = fullMoveLookup;
	}
	else {
		const characterNormalMoveList = returnedData[character]['Normal Moves'];
		// Simple case where we are looking up a typical normal move by its move name
		if (standardPositions.includes(defaultPosition)) {
			defaultPosition = position !== ' ' ? position : 'Standing';
			fullMoveLookup = lookupVSystem ? lookupVSystem + defaultPosition + ' ' + lookupNormalMove : defaultPosition + ' ' + lookupNormalMove;
			move = characterNormalMoveList[fullMoveLookup];
		}
		else if (normalMove === 'Sweep') {
			fullMoveLookup = lookupVSystem ? lookupVSystem + ' ' + lookupNormalMove : lookupNormalMove;
			move = characterNormalMoveList[fullMoveLookup];
		}
		else if (uniqueMovePositions.includes(defaultPosition)) {
			// We look up the move by its command here
			const moveCommand = defaultPosition + ' ' + normalMove;
			fullMoveLookup = moveCommand;
			move = lookupMoveByCommand(moveCommand.trim(), character);
		}
	}
	if (move) {
		console.log(character + "'s " + fullMoveLookup + ' found.');
		return createMoveOutput(move, character, normalMove, defaultFrameType, vSystem, defaultPosition);
	}
	else {
		console.log(character + "'s " + fullMoveLookup + ' not found');
		return 'The frame data for ' + character + "'s " + position + ' ' + normalMove + ' could not be found';
	}
}

/**
 * Takes in a move attribute and creates an speech output for Alexa to say to the user
 * @param {JSON} moveJson - The character's move object we will use to look up the frame data
 * @param {String} character - The character who move data we are returning
 * @param {String} move - The normal or special move we are looking up
 * @param {String} defaultFrameType - The type of frames we want (Startup, Recovery, On Block etc.) This is set to Startup by default
 * @param {String} lookupVSystem - A V-System Modifier to make sure we look up the VT or VS version of a move
 * @param {String} moveModifier - This can be the move's Strength (for special moves LMH) or move position (for normal moves Standing, Crouching, Jumping)
 */
function createMoveOutput(moveJson, character, move, defaultFrameType, vSystem, moveModifier) {
	const lookupFrameType = frameTypeMapping[defaultFrameType];
	const lookupVSystem = vSystemMapping[vSystem];
	let frameNumber = undefined;
	let outputWithVSystem = undefined;
	let output = undefined;
	console.log(character, move, moveModifier, lookupFrameType, lookupVSystem);

	if (defaultFrameType === 'On Hit' || defaultFrameType === 'On Block') {
		if (moveJson[lookupFrameType] === '') {
			outputWithVSystem = character + 's ' + moveModifier + ' ' + move + ' with ' + vSystem + ' does not have any frames ' + defaultFrameType;
			output = character + 's ' + moveModifier + ' ' + move + ' does not have any frames ' + defaultFrameType;
		}
		else {
			frameNumber = moveJson[lookupFrameType] <= 0 ? moveJson[lookupFrameType] : 'plus ' + moveJson[lookupFrameType];
			outputWithVSystem =
				character + 's ' + moveModifier + ' ' + move + ' is ' + frameNumber + ' frames ' + defaultFrameType + ' with ' + vSystem;
			output = character + 's ' + moveModifier + ' ' + move + ' is ' + frameNumber + ' frames ' + defaultFrameType;
		}
	}
	else {
		if (moveJson[lookupFrameType] === '') {
			outputWithVSystem =
				character + 's ' + moveModifier + ' ' + move + 'during ' + vSystem + ' does not have any ' + defaultFrameType + ' frames.';
			output = character + 's ' + moveModifier + ' ' + move + ' does not have any ' + defaultFrameType + ' frames.';
		}
		else {
			outputWithVSystem =
				character +
				's ' +
				moveModifier +
				' ' +
				move +
				' has ' +
				moveJson[lookupFrameType] +
				' ' +
				defaultFrameType +
				' frames with ' +
				vSystem;
			output = character + 's ' + moveModifier + ' ' + move + ' has ' + moveJson[lookupFrameType] + ' ' + defaultFrameType + ' frames.';
		}
	}

	return lookupVSystem && !move.includes('V-Trigger') ? outputWithVSystem : output;
}

/**
 * This function lookups a character's special move by its move command (ex. forward medium punch)
 * @param {JSON} characterJson - The JSON representation of the character
 * @return The JSON representation of the move object
 */
function lookupMoveByCommand(moveCommand, character) {
	const data = fs.readFileSync('Model/' + character + '.json');
	if (!data) {
		console.log('File: Model/' + character + '.json could not be found');
		return 'There was a problem retrieving frame data for ' + character + '. You can try another character until this is resolved.';
	}
	let jsonData = JSON.parse(data);
	const specialMoves = jsonData[character]['Special Moves'];
	let foundMove = undefined;
	Object.entries(specialMoves).forEach((move) => {
		if (move[1].moveCommand && move[1].moveCommand.length > 0) {
			if (move[1].moveCommand.includes(moveCommand)) {
				foundMove = move[1];
			}
		}
	});
	return foundMove;
}

/**
 * This function retrieves a character's Critical Art from their JSON file
 * @param {JSON} characterJSON - The character's JSON object we will use to look up the Critical Art
 * @param {Boolean} withVTrigger - true if we are looking for a critical art with v trigger, false if otherwise
 */
function lookupCriticalArt(characterJSON, withVTrigger) {
	const criticalArt = characterJSON['Critical Art'];
	let returnedCA = undefined;
	if (withVTrigger) {
		const vTriggerSuper = Object.keys(criticalArt).filter((value) => value.startsWith('V-'))[0];
		if (vTriggerSuper) {
			returnedCA = criticalArt[vTriggerSuper];
		}
	}
	else if (Object.keys(criticalArt)[0]) {
		console.log('Could not find super with V-Trigger, returning standard super');
		// If it is a normal super ( without VT) then just grab the first one
		// This might need to change depending on user feedback for characters like Dhalsim but until then we will keep it simple
		const value = Object.keys(criticalArt)[0];
		console.log('Found super: ' + value);
		returnedCA = criticalArt[value];
	}
	else {
		console.log('Could not find super');
	}
	return returnedCA;
}
module.exports = { retrieveNormalMoveFrameData, retrieveSpecialMoveFrameData };
