// Static Language Model for reference
const model = require('./Model/IntentSchema.json');

const Alexa = require('ask-sdk');
const fs = require('fs');
const invocationName = 'frame data';

// 1. Intent Handlers =============================================

const AMAZON_CancelIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Okay, talk to you later! ';

		return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
	},
};

const AMAZON_HelpIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let intents = [
			'How many frames is Chun-lis standing fierce on block',
			'How many frames is Kens heavy tatsu on block',
			'How many startup frames is Mikas peach',
			'What are the recovery frames for Akumas standing heavy punch',
			'How many frames is Seths low forward',
			'How many active frames is Guiles D.P',
		];
		let sampleIntent = randomElement(intents);

		let say = ' Here is something you can ask me. ' + sampleIntent;

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const AMAZON_StopIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Okay, talk to you later! ';

		return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
	},
};
const AMAZON_NavigateHomeIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Hello from AMAZON.NavigateHomeIntent. ';

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const GetSpecialMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetSpecialMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}
		let characterName = ' ';
		let vSystem = ' ';
		let frameType = ' ';
		let moveStrength = ' ';
		let specialMoveName = ' ';

		let say = '';

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

		//   SLOT: Character
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			characterName = slotValues.Character.resolved;
		}
		else if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
			say = 'There was no frame data found for ' + slotValues.Character.heardAs + '. please try saying the character name again.';
			return responseBuilder
				.speak(say)
				.reprompt('please try saying the character name again.')
				.addElicitSlotDirective('Character')
				.getResponse();
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.VSystem.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			frameType = slotValues.FrameType.resolved;
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}
		//   SLOT: MoveStrength
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_MATCH') {
			moveStrength = slotValues.MoveStrength.resolved;
		}
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.MoveStrength.heardAs + '" to the custom slot type used by slot MoveStrength! ');
		}
		//   SLOT: SpecialMove
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_MATCH') {
			specialMoveName = slotValues.SpecialMove.resolved;
		}
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.SpecialMove.heardAs + '" to the custom slot type used by slot SpecialMove! ');
			say = 'Frame data for, ' + slotValues.SpecialMove.heardAs + ' could not be found. try saying the move name again';

			return responseBuilder.speak(say).addElicitSlotDirective('SpecialMove').getResponse();
		}

		say = retrieveSpecialMoveFrameData(characterName, specialMoveName, moveStrength, frameType, vSystem);
		return responseBuilder.speak(say).getResponse();
	},
};

const GetNormalMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetNormalMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}

		let characterName = ' ';
		let vSystem = ' ';
		let frameType = ' ';
		let position = ' ';
		let normalMove = ' ';

		let say = '';

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			characterName = slotValues.Character.resolved;
		}
		else if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
			say = 'There was no frame data found for ' + slotValues.Character.heardAs + '. please try saying the character name again.';
			return responseBuilder
				.speak(say)
				.reprompt('please try saying the character name again.')
				.addElicitSlotDirective('Character')
				.getResponse();
		}
		//   SLOT: Position
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_MATCH') {
			position = slotValues.Position.resolved;
		}
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Position.heardAs + '" to the custom slot type used by slot Position! ');
		}
		//   SLOT: NormalMove
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_MATCH') {
			normalMove = slotValues.NormalMove.resolved;
		}
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.NormalMove.heardAs + '" to the custom slot type used by slot NormalMove! ');
			say =
				'Frame data for, ' +
				slotValues.NormalMove.heardAs +
				' could not be found. ' +
				'A few valid values are, ' +
				sayArray(getExampleSlotValues('GetNormalMoveFrames', 'NormalMove'), 'or');
			return responseBuilder.speak(say).getResponse();
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			frameType = slotValues.FrameType.resolved;
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.VSystem.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}
		//   SLOT: Item
		if (slotValues.Item.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.Item.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		say = retrieveNormalMoveFrameData(characterName, normalMove, position, frameType, vSystem);

		return responseBuilder.speak(say).getResponse();
	},
};

const GetVSystemMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetVSystemMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}

		let say = 'Hello from GetVSystemMoveFrames. ';

		let slotStatus = '';
		let resolvedSlot;

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.heardAs) {
			slotStatus += ' slot Character was heard as ' + slotValues.Character.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Character is empty. ';
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Character.resolved !== slotValues.Character.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Character.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
		}

		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Character.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'Character'), 'or');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.heardAs) {
			slotStatus += ' slot VSystem was heard as ' + slotValues.VSystem.heardAs + '. ';
		}
		else {
			slotStatus += 'slot VSystem is empty. ';
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.VSystem.resolved !== slotValues.VSystem.heardAs) {
				slotStatus += 'synonym for ' + slotValues.VSystem.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.VSystem.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'VSystem'), 'or');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.heardAs) {
			slotStatus += ' slot FrameType was heard as ' + slotValues.FrameType.heardAs + '. ';
		}
		else {
			slotStatus += 'slot FrameType is empty. ';
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.FrameType.resolved !== slotValues.FrameType.heardAs) {
				slotStatus += 'synonym for ' + slotValues.FrameType.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}

		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.FrameType.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'FrameType'), 'or');
		}

		say += slotStatus;

		return responseBuilder.speak(say).getResponse();
	},
};

const LaunchRequest_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const responseBuilder = handlerInput.responseBuilder;

		let say = 'Hey welcome to ' + invocationName + ' what would you like to look up? You can say help to find out your options';

		let skillTitle = capitalize(invocationName);

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const SessionEndedHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		const request = handlerInput.requestEnvelope.request;

		console.log(`Error handled: ${error.message}`);
		// console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);

		return handlerInput.responseBuilder
			.speak('Sorry, an error occurred.  Please say again.')
			.reprompt('Sorry, an error occurred.  Please say again.')
			.getResponse();
	},
};

// 2. Constants ===========================================================================

// Here you can define static data, to be used elsewhere in your code.
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

// 3.  Helper Functions ===================================================================
function capitalize(myString) {
	return myString.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
}

function randomElement(myArray) {
	return myArray[Math.floor(Math.random() * myArray.length)];
}

function stripSpeak(str) {
	return str.replace('<speak>', '').replace('</speak>', '');
}

function getSlotValues(filledSlots) {
	const slotValues = {};

	Object.keys(filledSlots).forEach((item) => {
		const name = filledSlots[item].name;

		if (
			filledSlots[item] &&
			filledSlots[item].resolutions &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code
		) {
			switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
				case 'ER_SUCCESS_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
						ERstatus: 'ER_SUCCESS_MATCH',
					};
					break;
				case 'ER_SUCCESS_NO_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: '',
						ERstatus: 'ER_SUCCESS_NO_MATCH',
					};
					break;
				default:
					break;
			}
		}
		else {
			slotValues[name] = {
				heardAs: filledSlots[item].value,
				resolved: '',
				ERstatus: '',
			};
		}
	}, this);

	return slotValues;
}

function getExampleSlotValues(intentName, slotName) {
	let examples = [];
	let slotType = '';
	let slotValuesFull = [];

	let intents = model.interactionModel.languageModel.intents;
	for (let i = 0; i < intents.length; i++) {
		if (intents[i].name === intentName) {
			let slots = intents[i].slots;
			for (let j = 0; j < slots.length; j++) {
				if (slots[j].name === slotName) {
					slotType = slots[j].type;
				}
			}
		}
	}
	let types = model.interactionModel.languageModel.types;
	for (let i = 0; i < types.length; i++) {
		if (types[i].name === slotType) {
			slotValuesFull = types[i].values;
		}
	}

	examples.push(slotValuesFull[0].name.value);
	examples.push(slotValuesFull[1].name.value);
	if (slotValuesFull.length > 2) {
		examples.push(slotValuesFull[2].name.value);
	}

	return examples;
}

function sayArray(myData, penultimateWord = 'and') {
	let result = '';

	myData.forEach(function(element, index, arr) {
		if (index === 0) {
			result = element;
		}
		else if (index === myData.length - 1) {
			result += ` ${penultimateWord} ${element}`;
		}
		else {
			result += `, ${element}`;
		}
	});
	return result;
}

function getCustomIntents() {
	const modelIntents = model.interactionModel.languageModel.intents;

	let customIntents = [];

	for (let i = 0; i < modelIntents.length; i++) {
		if (modelIntents[i].name.substring(0, 7) != 'AMAZON.' && modelIntents[i].name !== 'LaunchRequest') {
			customIntents.push(modelIntents[i]);
		}
	}
	return customIntents;
}

function getPreviousIntent(attrs) {
	if (attrs.history && attrs.history.length > 1) {
		return attrs.history[attrs.history.length - 2].IntentRequest;
	}
	else {
		return false;
	}
}

function getPreviousSpeechOutput(attrs) {
	if (attrs.lastSpeechOutput && attrs.history.length > 1) {
		return attrs.lastSpeechOutput;
	}
	else {
		return false;
	}
}

// 4. Frame data retrieval functions =======================================================

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
	console.log(character, move, moveModifier, lookupFrameType, lookupVSystem);

	if (defaultFrameType === 'On Hit' || defaultFrameType === 'On Block') {
		const frameNumber = moveJson[lookupFrameType] <= 0 ? moveJson[lookupFrameType] : 'plus ' + moveJson[lookupFrameType];
		const outputWithVSystem =
			character + 's ' + moveModifier + ' ' + move + ' is ' + frameNumber + ' frames ' + defaultFrameType + ' with ' + vSystem;
		const output = character + 's ' + moveModifier + ' ' + move + ' is ' + frameNumber + ' frames ' + defaultFrameType;
		return lookupVSystem && !move.includes('V-Trigger') ? outputWithVSystem : output;
	}
	else {
		const outputWithVSystem =
			character + 's ' + moveModifier + ' ' + move + ' has ' + moveJson[lookupFrameType] + ' ' + defaultFrameType + ' frames with ' + vSystem;
		const output = character + 's ' + moveModifier + ' ' + move + ' has ' + moveJson[lookupFrameType] + ' ' + defaultFrameType + ' frames.';
		return lookupVSystem && !move.includes('V-Trigger') ? outputWithVSystem : output;
	}
}

/**
 * This function lookups a character's special move by its move command (ex. forward medium punch)
 * @param {JSON} characterJson - The JSON representation of the character
 */
function lookupMoveByCommand(moveCommand, character) {
	const data = fs.readFileSync('Model/' + character + '.json');
	if (!data) {
		console.log('File: Model/' + character + '.json could not be found');
		return 'There was a problem retrieving frame data for ' + character + '. You can try another character until this is resolved.';
	}
	let jsonData = JSON.parse(data);
	const specialMoves = jsonData[character]['Special Moves'];
	let returnedMove = Object.entries(specialMoves).filter((move) => move[1].moveCommand === moveCommand)[1];

	return returnedMove[1];
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
// 5. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
	.addRequestHandlers(
		AMAZON_CancelIntent_Handler,
		AMAZON_HelpIntent_Handler,
		AMAZON_StopIntent_Handler,
		AMAZON_NavigateHomeIntent_Handler,
		GetSpecialMoveFrames_Handler,
		GetNormalMoveFrames_Handler,
		GetVSystemMoveFrames_Handler,
		LaunchRequest_Handler,
		SessionEndedHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();

// End of Skill code -------------------------------------------------------------
